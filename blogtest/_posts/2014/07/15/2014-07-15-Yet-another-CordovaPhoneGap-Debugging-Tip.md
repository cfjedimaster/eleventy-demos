---
layout: post
title: "Yet another Cordova/PhoneGap Debugging Tip"
date: "2014-07-15T11:07:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/07/15/Yet-another-CordovaPhoneGap-Debugging-Tip
guid: 5267
---

<p>
Want another way to debug Cordova/PhoneGap apps? This isn't new, but I tend to forget about this option and it came in handy yesterday so I thought I would share. When you send builds to the simulator/device via the command line, you may notice that at the end of all the output about building this and generating that, you get these two lines:
</p>
<!--more-->
<p>
<code>2014-07-14 17:23:36.846 ios-sim[1335:507] stderrPath: /Users/ray/readtextfile/platforms/ios/cordova/console.log&lt;br/&gt;
2014-07-14 17:23:36.847 ios-sim[1335:507] stdoutPath: /Users/ray/readtextfile/platforms/ios/cordova/console.log</code>
</p>

<p>
What this is telling you is that you have a log file that will report on errors from your application. This also includes console.log output. (As well as console.dir.) If you simply <code>tail -f</code> this file in another terminal tab (and yes, you get tail -f in Windows too with the right download), you get your console output as plain text right in your terminal. Here is an example from what I was working on yesterday.
</p>

<p>
<img src="https://static.raymondcamden.com/images/tail.jpg" />
</p>

<p>
<strong>Edit on July 16:</strong> As just an FYI, when I just tested this on a new app this morning, it did not work. I had to add the Console plugin. My initial test was with a Ionic app where this was added automatically.
</p>