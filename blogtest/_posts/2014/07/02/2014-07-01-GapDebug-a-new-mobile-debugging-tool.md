---
layout: post
title: "GapDebug, a new mobile debugging tool"
date: "2014-07-02T08:07:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/07/02/GapDebug-a-new-mobile-debugging-tool
guid: 5257
---

<p>
For the past few days I've been playing with a new, and rather interesting, mobile debugging tool called <a href="https://www.genuitec.com/products/gapdebug/">GapDebug</a>. Currently in private beta, it will switch to an open beta around July 9th</a>. You can sign up on the site to get notified when it becomes available.
</p>
<!--more-->
<p>
GapDebug provides a simpler way to debug both iOS and Android mobile applications. It works with web pages, PhoneGap, and Cordova applications. If you have read my guides on this (see both <a href="http://css.dzone.com/articles/overview-mobile-debugging">this article</a> and <a href="http://css.dzone.com/articles/overview-mobile-debugging-2?mz=27249-mobile">the follow-up</a>), then you know that iOS requires you to use Safari to debug mobile applications and Android requires you to use Chrome. The great thing about GapDebug is that it brings both debugging environments together in one tab in your Chrome browser. Let's take a look. 
</p>

<p>
After installing GapDebug, you get a new icon in your taskbar to launch a new debugging session. (GapDebug supports both Windows and OS X. That means you can debug your iOS apps on a Windows machine!) Simply click it and select "Open Debugging" to start a new session.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s116.png" />
</p>

<p>
Notice how GapDebug picks up on all my connected devices - in this case my iPhone and my Android emulator. It does <strong>not</strong> pick up the iPhone Simulator, which is a shame. Notice too that it is detecting Safari on the iPhone. As I mentioned earlier, GapDebug supports basic web page debugging as well. (This is enabled via Settings and is not on by default.)
</p>

<p>
If you select one of the currently detected applications, a new debugging tab will open up. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/s214.png" />
</p>

<p>
Notice that this is the same UI you get with Safari remote debugging - all without the shame of actually being seen to open Safari. (I'm kidding, mostly.) The toolset you get is based on the environment you are testing. So while the screen shot above uses the same UI you would get with Safari's remote debugger, if you select an Android app you get the same one from Chrome.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s37.png" />
</p>

<p>
Notice how GapDebug just uses additional tabs for each debugging connection. This is <i>really</i> convenient. There are a few issues with the current beta that need a bit of addressing. For iOS only, modifying the DOM via the debugger is painfully slow - but just that particular aspect - nothing more. (This is already reported to the team and is being addressed.) Everything else, like the console, the debugger, etc. runs great. Another issue is that if you rebuild the application, your debugging tab becomes disconnected and you have to reconnect. This is being investigated for a fix in the next version. It is annoying, but less annoying than having to go to the debug menu in Safari and click around to reopen the debugger there. That sounds like a minor thing, but I can't tell you how much it bugs me with Safari. 
</p>

<p>
So far, I'm pretty impressed. If you are a Windows user, this tool will be a must have if you want to do any iOS work. For me, it just feels a heck of a lot more convenient to use - especially if I'm going to be testing Android and iOS both in one session. 
</p>

<p>
To learn more, check out the <a href="https://www.genuitec.com/products/gapdebug/">GapDebug</a> web page and follow them on <a href="https://twitter.com/GapDebug">Twitter</a>.
</p>