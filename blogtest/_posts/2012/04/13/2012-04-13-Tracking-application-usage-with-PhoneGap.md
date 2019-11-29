---
layout: post
title: "Tracking application usage with PhoneGap"
date: "2012-04-13T12:04:00+06:00"
categories: [development,html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2012/04/13/Tracking-application-usage-with-PhoneGap
guid: 4588
---

Last September I wrote a <a href="http://www.raymondcamden.com/index.cfm/2011/9/24/Tracking-application-usage-with-Flex-Mobile">blog entry</a> discussing how you could track basic application usage within a Flex Mobile application. I thought I'd take a look at this today with a PhoneGap application. I took an entirely different approach than the earlier example and I'd love to hear what people think.
<!--more-->
<p>

For this proof of concept I decided to track one simple statistic - total time used. Because I'm only tracking one particular stat, I can skip making use of a database and simply use localStorage. I've decided to follow up this entry next week with a database example that demonstrates tracking of user actions, but for now, I want to simply track how long you've used the application.

<p>

In order to do this I needed to make use of two basic events in my PhoneGap application: <a href="http://docs.phonegap.com/en/1.6.0/cordova_events_events.md.html#pause">Pause</a> and <a href="http://docs.phonegap.com/en/1.6.0/cordova_events_events.md.html#resume">Resume</a>. Notice that I'm not tracking when an application exits. While it is possible to force an application to close, there is no documented, standard way to track when an application ends, and from what my research has dug up, it is impossible in iOS to really "do something" in that case. 

<p>

Therefore I decided on the following, somewhat simple, application flow:

<p>

<ol>
<li>On application start, note the time.
<li>When the application pauses, get the difference and add it to our storage.
<li>When the application resumes, reset a 'start time' value.
</ol>

<p>

There are - of course - some issues with this approach. If you start the application and power cycle the phone, you won't register the time spent with the application. I could get around that by switching to a "ping" approach where I record time every 60 seconds or so, but I really wanted something unobtrusive and out of the way. As I said - this is a proof of concept. It could be done many different ways. Let's look at the code.

<p>

<script src="https://gist.github.com/2377854.js?file=index.html"></script>

<p>

Let's tackle this top to bottom. As with almost all PhoneGap apps, your main startup routine should be the deviceready event. You can see that my init function simply creates that listener for me.

<p>

Within startup I check my localStorage value and if it is not there, I initialize it to 0. I then create a startTime value and listen for my pause/resume events.

<p>

The pause event handler is where the magic happens. I ensure I've got a valid startTime value and if so - do a bit of date math to figure out the difference. Note that I'm flooring the value. This may be a mistake as I'll probably lose a bunch of "half minute" uses. Again - you could tweak this to your liking. 

<p>

The resume handler just takes care of resetting startTime.

<p>

Finally - I built a basic display handler for the stat. I wouldn't do this in a real application since it isn't updated while the user watches it and would probably confuse them.

<p>

So - any thoughts on this approach? If you would like to download an APK of this, try the link below. (Note - this is the public URL from PhoneGap Builder. Trying it out in an iframe. If it doesn't work or looks clunky, let me know.)

<p>

<iframe src="https://build.phonegap.com/apps/100674/share" width="400"></iframe>