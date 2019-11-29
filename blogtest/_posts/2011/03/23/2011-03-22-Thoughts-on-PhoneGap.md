---
layout: post
title: "Thoughts on PhoneGap"
date: "2011-03-23T10:03:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2011/03/23/Thoughts-on-PhoneGap
guid: 4167
---

Over the past few days I've had a chance to play a bit with <a href="http://www.phonegap.com/">PhoneGap</a>. PhoneGap is a free platform that allows you to use HTML to create mobile native applications for Android, iOS, Blackberry, webOS, Symbian, and Windows 7 (soon). This blog entry will not detail how to work with PhoneGap since they provide excellent documentation  already. Rather I'm going to focus on my experience in getting it running.
<!--more-->
<p/>

<h2>Getting Started</h2>
<p/>

My experience began with the <a href="http://www.phonegap.com/start">Getting Started</a> page where - I have to admit - I had massive brain fart. The page talks about iOS when you first land. I thought - at first - that was the only platform they were documenting. Believe it or not it never occurred to me to hover over and click on the <a href="http://www.phonegap.com/start#android">Android</a> link. Yeah it's pretty obvious to me now but at the time I just assumed they weren't providing a guide for non-iOS devices. 
<p/>

The guide recommends installing Eclipse Classic. I wanted to use ColdFusion Builder 2 of course. Following the directions I ran into an issue when I was asked to install <a href="http://developer.android.com/sdk/eclipse-adt.html#installing">ADT</a>. I love that Eclipse plugins can so easily tell you what they are missing yet provide so little help in actually getting you to the plugin. <a href="http://www.henke.ws/">Mike Henke</a> helped me out by suggesting I add http://download.eclipse.org/releases/helios/ as an update site. I did that and filtered on GEF once the resources loaded. The resource ADT was complaining about can be fulfilled by adding <b>Graphical Editing Framework GEF SDK</b>
<p/>

<img src="https://static.raymondcamden.com/images/ScreenClip50.png" />
<p/>

Obvious, right? Install that, then come back and get ADT added. Once done I was able to proceed with the Getting Started guide.
<p/>

The guide has a few steps of the sort "Copy this file here" and "Modify this line so and so." They all work fine. But whenever I read documentation like this I always get a bit worried. I feel like the guy on the disaster flick who has to land the 747 while air traffic control tells me what buttons and levers to push. Don't get me wrong - it was easy enough to follow (* see the note on the small typo following) but when I don't know <i>why</i> I'm doing something I'm always concerned it will break. Luckily everything worked perfectly fine. The only small issue is that you are asked to copy phonegap.js and the file is actually phonegap.0.9.4.js. Easy enough to figure out. 
<p/>

<h2>Running</h2>
<p/>

If you've already set up the Android SDK and created a virtual device, then running your application via Eclipse is pretty trivial. Unfortunately, you now get to experience the massive fail that is the Android simulator. Don't get me wrong - I love me some Android. I love that Android's SDK isn't Mac only like iOS. But the performance of their simulator mimics my old 386 PC from 1991. It's horrible and there is no excuse for it. The last time I googled on the topic I mainly found people saying "Yep, it's slow, deal with it." Anyway, I think my first run took about 4 minutes to actually show up in the simulator. Ticked off - I killed my current VM and made a new one. This time a run took about two minutes. Better, but a) I have no idea why and b) two minutes is <b>hella</b> long to run something. 
<p/>

Luckily there is an alternative. If you have a real Android phone, you can push to it if you have USB debugging turned on. This ran <b>extremely</b> fast. I'd say about 3-5 seconds. What was tricky - for me - was figuring out how to tell Eclipse to go to a real device. When you look at run configurations, you see this:
<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip51.png" />
<p/>

As you can see, we have two choices - Manual and Automatic. Automatic listed all my VMs. To me, nothing seemed obvious as "real" hardware. On a whim I clicked "Manual" and then run and I saw my device...
<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip52.png" />
<p/>

And bam - that's it. I don't yet know how to make my Eclipse run button "just do that", but I don't mind that. As I said, from me wanting to run to seeing it on my phone was approximately 5 seconds. That's epic good in my mind. 
<p/>

<h2>Testing</h2>
<p/>

So - I got me some HTML on my phone. Cool! But now I wanted to see what I could actually do with the HTML. In my first test I wanted to see if the cross-domain XHR restrictions were in place. This is the security block that prevents you from requesting a JSON packet from some other domain. Here's the code I used:

<p/>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;

&lt;head&gt;
&lt;title&gt;List Examples - Nesting&lt;/title&gt;
&lt;script type="text/javascript" charset="utf-8" src="phonegap.0.9.4.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jquerymobile/jquery-1.5.1.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#testBtn").click(function() {
		$("#testDiv").append("Beginning test&lt;p&gt;");
		$.getJSON("http://groups.adobe.com/api/group.cfc?method=getgroup&id=113",{}, function(res,code) {
			$("#testDiv").append("Result = "+res.NAME);
		});
	});

});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;input type="button" id="testBtn" value="TEST" style="width:100%;height:100px;"&gt;

&lt;div id="testDiv"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p/>

I honestly didn't know what to expect here. My understanding is that PhoneGap is essentially wrapping a browser, and browser's have restrictions. But luckily this worked perfectly. Immediately it occurred to me - this is just like building an HTML based Adobe AIR application, and indeed, it turned out to be closer to that then I expected. As you may know, when writing HTML-based AIR apps, your JavaScript can be extended using new built in objects that provide access to things like the file system, web camera, etc. PhoneGap provides a similar system. So for example, I can introspect the device:

<p/>

<code>
$("#testDiv").append("Phone is "+device.name +" and is a "+device.platform+"&lt;br/&gt;");
</code>

<p/>

And I can search the phone's contact system:

<p/>

<code>
var fields = ["displayName"];
var options = new ContactFindOptions();
   options.filter="Adam";
navigator.service.contacts.find(fields, contactSuccess, contactError,options);
</code>

<p/>

Looking at PhoneGap's <a href="http://docs.phonegap.com/">API</a>, it looks like you have access to basically <i>everything</i>. There seem to be many caveats (ie, this feature does this on iPhone and does this on Android), but in general it feels like you can build something with pretty deep integration. 

<p/>

Finally, I tested jQuery Mobile. I simply copied one of the samples from my presentation and ran it. It worked perfectly. No big surprise here, but it was nice to see.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip53.png" />

<p/>

All in all, I'm pretty impressed with what I see so far. What's even cooler is that they are looking to make this even simpler. The team is currently running a beta called <a href="https://build.phonegap.com/">PhoneGap Build</a>, where basically all you do is upload your code. I haven't tried it yet (although I did sign up for the beta and got access) as I wanted to try things the manual way, but this feature could be absolute killer for them. I could easily see paying a yearly subscription for such a service. According to their <a href="https://build.phonegap.com/faq">FAQ</a> the service will be free for OS projects and they will be announcing pricing for commercial apps. I really hope they announce that soon. I can think of a certain other service I liked quite a bit that took <i>forever</i> to decide on a price and once they did - it was far too high. 

<h2>Sermon</h2>

You've been warned, the "review" part of this blog entry is done. ;) I find it sad that some people are so opposed to tools like PhoneGap. There seems to be an attitude that if you make it easy for people to create, they will only create crap. That's truly sad. It's elitist. It's unfair. And it prevents otherwise creative people from sharing their vision with the rest of the world. Don't get me wrong - I appreciate the fact that programming is a science. I can appreciate the skill it takes to create something "important" like, oh, Angry Birds. But not every application needs the skills of a hard core Objective-C coder. Opening the gates and allowing more people to create <i>will</i> result in more crap. I don't deny that. But I'd take a thousand more fart apps if it allows the creation of one gem. I think it's great that organizations like PhoneGap and companies like Adobe are making it easier to build on multiple platforms. I haven't felt this way since I first ran Mosaic and used ed on a Sparc machine to edit an HTML file!