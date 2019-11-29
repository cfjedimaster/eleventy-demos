---
layout: post
title: "XCode \"forgets\" frameworks and bundles after a restart"
date: "2014-06-25T11:06:00+06:00"
categories: [development,misc]
tags: []
banner_image: 
permalink: /2014/06/25/XCode-forgets-frameworks-and-bundles-after-a-restart
guid: 5253
---

<p>
Just blogging this as I had trouble Googling for a solution when it hit me. I've been doing ObjectiveC work lately for the <a href="https://creativesdk.adobe.com/">CreativeSDK</a> project and I kept running into an odd problem. I'd set up a simple project, do some work on it, and when I returned the next day, any use of the CreativeSDK would fail. If I removed the frameworks and bundles from my project and re-added them, it worked again. The first time (OK, the first few times) this happened, I just assumed I made a mistake when adding it, but when it happened consistently, I figured something was up.
</p>
<!--more-->
<p>
I turned to Stack Overflow where user <a href="http://stackoverflow.com/users/631076/anthony">Anthony</a> suggested I look at the framework search property in my XCode project. When I did, I noticed something odd:
</p>

<p>
<img src="https://static.raymondcamden.com/images/foo.png" />
</p>

<p>
See the 3rd and 4th line item? That's actually one path: <code>/Users/ray/Dropbox/Work Projects/CreativeSDK/frameworks</code>. Apparently XCode had an issue with the space in the folder name. Because... I don't know. I mean - I've got a <strong>lot</strong> of respect for XCode now, especially after my ObjectiveC training, but come on, this is 2014 and it boggles my mind that I still run into programs that barf on spaces in folders. (Cordova did for quite some time as well.)
</p>

<p>
Anyway... yeah... don't do that.
</p>