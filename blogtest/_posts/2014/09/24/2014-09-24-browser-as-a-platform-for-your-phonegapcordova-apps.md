---
layout: post
title: "Browser as a platform for your PhoneGap/Cordova apps"
date: "2014-09-24T18:09:00+06:00"
categories: [development,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/09/24/browser-as-a-platform-for-your-phonegapcordova-apps
guid: 5316
---

<strong>Over a year later and this blog post is still highly popular. If you like this content, be sure to <a href="https://feedburner.google.com/fb/a/mailverify?uri=RaymondCamdensBlog&loc=en_US">subscribe</a> to the blog to get the latest updates. You may also want to check out my <a href="http://www.manning.com/camden">Apache Cordova book</a> and the <a href="/about-me">JavaScript videos</a> I have available.</strong>

<p>
This is a pretty exciting change. If you've recently updated to the latest version of Cordova, you will notice that a new platform exists: browser. What exactly does this mean? It means the browser is now (well, becoming) a viable way to test your PhoneGap/Cordova applications. For a long time now I've done a lot of my development in the browser. Most of the time I'm not concerned about some random Cordova feature, instead I'm more concerned about something else. So I'll skip, or mock, a Cordova feature and focus on the important stuff. But eventually I hit that point where I need to do something via a core plugin and then I leave the desktop. Now we have an alternative.
</p>
<!--more-->
<p>
Plugins currently ship with code for each of their supported platforms. This means that for a plugin to support Cowbell (random example) it ships code for Android, iOS, and whatever other platform it wants to support. They ship a standard JavaScript interface so your use of the code "just works" across platforms. (To be clear, there are quirks sometimes, and most plugins do a good job of documenting this.)
</p>

<p>
With the addition of "Browser" as a platform, a plugin can write code to support running under a desktop environment. <i>How</i> it does this is completely up to the plugin. As an example, the Barcode scanner plugin could simply return a hard coded barcode value. 
</p>

<p>
As an additional change, when you run the browser platform, the deviceready event will automatically fire. Normally when I'm running on the desktop I add a line of code to fake it until I switch to a device, but now I can skip it. So how does it work?
</p>

<p>
First and foremost - there are some bugs with the implementation right now. <strong>These are going away soon.</strong> Keep that in mind if you are reading this in the future. (How did the iPad 5 Plus turn out?)
</p>

<p>
To begin, you need to add browser as a platform. However, you <strong>cannot</strong> do the normal <code>cordova platform add browser</code>. Instead, use the --usegit flag, like so: <code>cordova platform add browser --usegit</code>. As I warned above, this is one of those bugs that will go away soon.
</p>

<p>
To run your application in the browser, you must close Chrome. Completely. Why? Because currently the CLI has to start Chrome with a few flags attached. So kill Chrome, and then type: <code>cordova run browser</code>. This will open up Chrome and point it at your application. You will see a warning about the flags it added but you can ignore those.
</p>

<p>
The next issue is updating. If you edit your code and run <code>cordova run browser</code> again, Chrome will become focused, but will not reload. Nor will it select the tab with your application if you happened to switch it. So just select the tab (if changed) and click reload.
</p>

<p>
So to be clear, the process is - do the run at the CLI, let Chrome focus, and just hit reload. Again, this can, and will, become better.
</p>

<p>
Alright - now that you can test it, what's supported? I checked the core plugins only, but here are the plugins with browser as a platform support:
</p>

<ul>
<li>Camera</li>
<li>Device</li>
<li>Device Motion (Accelerometer)</li>
<li>Device Orientation (Compass)</li>
<li>Network Information</li>
</ul>

<p>
I then worked on a sample application that would let me test how these guys react in the browser environment. Here is that report. (As the sample app just runs the standard APIs, I didn't bother attaching the code to the blog post, but if anyone wants it, just ask.)
</p>

<h2>Camera</h2>

<p>
Everything works as you would expect except that you can only use base64 strings for the captured image, not file URIs. This is documented but as the docs suggest you <i>normally</i> should use file URIs, so keep it in mind. My demo application used two buttons, one to ask for a new image from the camera and one for an image from the photo gallery. When you try to select an image from the camera, the plugin makes use of your web cam.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot111.png" class="bthumb" />
</p>

<p>
After you grant permission, the plugin adds a little video output screen to the page and lets you select an image.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot211.png" class="bthumb"/>
</p>

<p>
Finally, when you click capture, the base64 data is transmitted back to your success handler and you can add it to the DOM.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot37.png" class="bthumb" />
</p>

<p>
If you select to use an image from the photo gallery, the plugin just makes use of a file picker.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot41.png" class="bthumb" />
</p>

<p>
Cool - so the only real oddity is that the webcam version also uses your mic. When I tested I got some weird feedback. I've already filed a bug for the plugin to simply skip the mic. There really isn't any use for it. (But the Media Capture plugin could certainly use it.)
</p>

<h2>Device</h2>

<p>
For Device, it simply sniffs the browser and uses some sensible defaults. I kinda wish Chrome would pretend to be Android, or maybe even iOS. I wrote code to simply dump out the device object to the console. Here is that result.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot51.png" class="bthumb" />
</p>

<h2>Device Motion (Accelerometer)</h2>

<p>
Using this API will simply return random data. It will <i>not</i> integrate with Chrome's DevTools Accelerometer tester, which is unfortunate, but I can live without it. Both the getCurrent and watch APIs work as expected, although I noticed a bit of delay in the watch version. I did not see this in the orientation plugin. Here is a screen shot.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot61.png" class="bthumb" />
</p>

<h2>Device Orientation (Compass)</h2>

<p>
Yep, just repeat what I said above. Random data. The only real difference is that the watch interval seemed to be perfectly in sync. Again, a screen shot.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot71.png" class="bthumb" />
</p>

<h2>Conclusion</h2>

<p>
So - all in all - this is a pretty exciting change. I hope more plugin authors adopt this platform and add support for it. (In fact, I'd consider it <i>required</i> but that's just me.) I should point out that the PhoneGap CLI does not support this platform yet.
</p>