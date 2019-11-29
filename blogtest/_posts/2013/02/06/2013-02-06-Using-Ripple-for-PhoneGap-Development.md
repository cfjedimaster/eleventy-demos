---
layout: post
title: "Using Ripple for PhoneGap Development"
date: "2013-02-06T15:02:00+06:00"
categories: [development,javascript,mobile]
tags: []
banner_image: 
permalink: /2013/02/06/Using-Ripple-for-PhoneGap-Development
guid: 4848
---

Ripple has been around for a while now, but only recently have I really noticed how freaking cool it is. I thought it might be helpful for my readers if I wrote up an introduction guide to Ripple and how you can more effectively use it. This will be a reflection of the issues and cool things I've run into personally and as always, I'd love to hear your opinions as well.
<!--more-->
First and foremost, what in the heck is Ripple? Ripple is an open source project in incubation status at Apache (<a href="http://incubator.apache.org/projects/ripple.html">http://incubator.apache.org/projects/ripple.html</a>). Its aim is to allow your browser to emulate a mobile device. Currently it has support for both Blackberry WebWorks and PhoneGap. For this blog entry I'll just be focusing on PhoneGap.

It works via a Chrome extension, which means, obviously, it is Chrome only. You can get the plugin by either searching in Chrome's online store or by simply clicking <a href="https://chrome.google.com/webstore/detail/geelfhphabnejjhdalkjhgipohgpdnoc">here</a>. 

Once installed, your Chrome browser will get a new icon up by the URL:

<img src="https://static.raymondcamden.com/images/ScreenClip170.png" />

The extension works with any HTTP-based URL, even your local server. You aren't required to upload your files to a public host. As a test, you can simply point to an HTML file on your local server and then click the Ripple icon.

<img src="https://static.raymondcamden.com/images/ScreenClip171.png" />

Click to enable Ripple and the page is reloaded with the Ripple emulator UI. Note - Ripple will (should) remember this setting. If you return to the page later it automatically loads Ripple. Just click the icon again to disable Ripple for that site. (Note - I'm not 100% sure on how long this 'sticks' - you may see something different.)

<img src="https://static.raymondcamden.com/images/ScreenClip172.png" />

There's a heck of a lot going on here. Each of the boxes surrounding your app allow for various configuration/testing options, but if you want to focus on just your app you can click the little arrows above the device simulator to hide them.

<img src="https://static.raymondcamden.com/images/ScreenClip173.png" />

You can selectively close them as well. (I.e., keep the right one open but close the left.)

For the most part the UI here should be self-explanatory. I'll go through it anyway  to provide some additional context.

<h2>Devices</h2>

The devices pod allows you to select from a pretty large set of options. What's cool is that this integrates fully with PhoneGap's <a href="http://docs.phonegap.com/en/2.3.0/cordova_device_device.md.html#Device">Device API</a>. If you run the example code for the API and toggle between different devices, you see the right results in Ripple. Here are some examples.

<img src="https://static.raymondcamden.com/images/ScreenClip175.png" />
<p/>

<img src="https://static.raymondcamden.com/images/ScreenClip176.png" />

<h2>Platforms</h2>

To be honest, I never need to touch this. You can select PhoneGap 1.0.0 if you really want to, but honestly, I just leave it at the default. It always seems to default to PhoneGap 2.0.0 for me.

<h2>Information</h2>

Never use it. I suppose it is useful, but I'd just click the header to minimize it. 

<h2>Accelerometer</h2>

This allows you to test motion-enabled applications. You can either click on the little device and move your mouse or just click the Shake button. Everything described in the PhoneGap <a href="http://docs.phonegap.com/en/2.3.0/cordova_accelerometer_accelerometer.md.html#Accelerometer">Accelerometer API</a> should work fine here. I <a href="http://www.raymondcamden.com/index.cfm/2013/1/15/PhoneGap-Sample--Shake-to-Roll">blogged</a> an example application of the accelerometer last month that made use of Ripple.

<h2>Settings</h2>

Again, should be obvious. Tooltips and Themes simply provide some UI options to Ripple itself. However, the <b>Cross Domain Proxy</b> is a very important one.

One of the issues you run into when using your desktop browser for mobile development is the inability of your Ajax code to make cross domain requests. This is a browser security issue and is pretty darn well out of your control. There are options though. In Chrome, you can start the browser with a flag to bypass that restriction. Another option is to just use JSON/P. Finally, if the remote service uses CORS, then you can just use the API without worry. 

Ripple allows you to use remote APIs directly by simply using a proxy service. So when your code requests foo.com/fancy.api, Ripple intercepts this, makes a request for the data from its own server, and proxies the result back to you.

For the most part this just works, but I've run into two situations now where it caused problems.

First - I did some testing a while ago against an API where everything worked fine in Chrome by itself (<b>when using the flag to allow cross domain calls</b>), but failed in Ripple. Why? I forgot that the API had employed remote IP rules. It worked fine from my IP, but not the remote IP. To fix that, I simply asked my friend to temporarily remove the IP rules. 

Second - Ripple's proxy completely borked <a href="http://www.parse.com">Parse.com</a> calls. I'm not exactly sure why, but it just did.

Luckily, there is an easy fix for that. Parse.com can work with CORS, and Ripple now lets you disable the proxy. 

<img src="https://static.raymondcamden.com/images/ScreenClip177.png" />

I tested this a few minutes ago with a Parse.com demo and as soon as I disabled it, it worked fine in Ripple.

<h2>Device &amp; Network Settings</h2>

This allows you to set the connection type as well as simulate lag. Again, this is fully compliant with PhoneGap's <a href="http://docs.phonegap.com/en/2.3.0/cordova_connection_connection.md.html#Connection">Connection API</a>. My latest article for the Adobe Developer Connection (<a href="http://www.adobe.com/devnet/phonegap/articles/using-parse-with-phonegap-part-2-the-phone-strikes-back.html">Using Parse.com with PhoneGap – Part 2: The phone strikes back</a>) discusses using the Connection API to enable/disable UI items based on network availability. It works great with Ripple.

<h2>Geo Location</h2>

You wouldn't normally need any help with Geolocation since it works just fine in Chrome, but Ripple lets you emulate different locations. This is <i>incredibly</i> helpful during testing. 

<img src="https://static.raymondcamden.com/images/ScreenClip178.png" />

<h2>Config</h2>

If you are using config.xml files for your PhoneGap app, then Ripple will attempt to read and parse the XML file. Here is an example.

<img src="https://static.raymondcamden.com/images/screenshot61.png" />

<h2>Events</h2>

Finally, the Event section lets you simulate various events. This is not a complete list of events supported by the PhoneGap <a href="http://docs.phonegap.com/en/2.3.0/cordova_events_events.md.html#Events">Events API</a>. As an example, the battery events are missing. But you could easily go into your console and trigger those events by hand if you need to.

<h2>What Else?</h2>

So to be honest, one of the reasons I avoided Ripple in the past is because I believed that's all Ripple supported. But that's not the case. For example, Ripple supports the PhoneGap <a href="http://docs.phonegap.com/en/2.3.0/cordova_camera_camera.md.html#Camera">Camera API</a>. It works by simply asking you to upload a picture instead. Here is an example of what you would see if your app requests the device camera.

<img src="https://static.raymondcamden.com/images/ScreenClip179.png" />

Hitting Select File gives you a regular browser based file selector. Once you select a file, you even get a preview, much like a real device.

<img src="https://static.raymondcamden.com/images/ScreenClip180.png" />

Another feature that works is <a href="http://docs.phonegap.com/en/2.3.0/cordova_notification_notification.md.html#Notification">notification</a> - partially. You can fire off a notification.alert but the title and button value attributes are not used. The callback worked, but fired immediately, not after I closed the alert. Vibration worked by simply shaking the simulator (which would be a pretty incredible vibration in real life I think). 

Beep did not, but it brings up something cool. So what happens when you call an API not supported by Ripple?

<img src="https://static.raymondcamden.com/images/ScreenClip181.png" />

As you can see, Ripple noticed the problem but provided you a quick way to handle it. You can type in a JSON result to 'fake' the result you expected.

How about the <a href="http://docs.phonegap.com/en/2.3.0/cordova_compass_compass.md.html#Compass">Compass API</a>? Yep, it works too. If you modify settings under Geo Location you will see them reflected in calls to the compass API. Again - I had just assumed that panel was for one feature. It never occurred to me that it would work with the compass.

How about the <a href="http://docs.phonegap.com/en/2.3.0/cordova_contacts_contacts.md.html#Contacts">Contact API</a>? Create works just fine, although it isn't obviously storing a new contact on your desktop. Search fails, but again, Ripple handles it nicely, letting you paste in a JSON response. 

<img src="https://static.raymondcamden.com/images/ScreenClip182.png" />

How about the <a href="http://docs.phonegap.com/en/2.3.0/cordova_file_file.md.html#File">File API</a>? This is one I haven't played with yet. Chrome supports the File System API, so some parts should "just work", but I'd be surprised if the File Transfer portion works at all. (Then again, every time I think Ripple can't do something it surprises me.)

<a href="http://docs.phonegap.com/en/2.3.0/cordova_globalization_globalization.md.html#Globalization">Globalization</a> does not seem to be supported at all currently. Ditto for <a href="http://docs.phonegap.com/en/2.3.0/cordova_media_capture_capture.md.html#Capture">Capture</a> and <a href="http://docs.phonegap.com/en/2.3.0/cordova_media_media.md.html#Media">Media</a>. I didn't even try <a href="http://docs.phonegap.com/en/2.3.0/cordova_splashscreen_splashscreen.md.html#Splashscreen">Splashscreen</a> since it involves native settings as well. 

Since the <a href="http://docs.phonegap.com/en/2.3.0/cordova_inappbrowser_inappbrowser.md.html#InAppBrowser">InAppBrowser API</a> uses window.open, this will just plain work, but I'd imagine the various events will not be supported.

And finally, <a href="http://docs.phonegap.com/en/2.3.0/cordova_storage_storage.md.html#Storage">Storage</a> is just WebSQL so it will work fine in Chrome.

I'll wrap this up with one pretty crucial tip. When using Ripple, you <i>do</i> want to include a script tag that points to a copy of cordova.js. Unlike PhoneGap Build, this will be a <b>real</b> file on your file system. <b>It is crucial that you use the Android version, not iOS.</b> I lost time today trying to debug a very odd issue. My deviceready event was firing twice (and by the way, did I mention Ripple handles firing this for you automatically). The culprit turned out to be the iOS cordova.js file. Very odd, but luckily it was easy enough to get around. 

As a last tip, you can find links to the source and support forums at <a href="http://ripple.tinyhippos.com/">http://ripple.tinyhippos.com/</a>.