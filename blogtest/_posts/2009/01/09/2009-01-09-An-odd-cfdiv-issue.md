---
layout: post
title: "An odd cfdiv issue"
date: "2009-01-09T21:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/09/An-odd-cfdiv-issue
guid: 3187
---

Forgive the vague title, but the title I wanted to use would reveal the secret behind the mystery that plagued a reader of mine for the past few days. He was using cfdiv to load dynamic content and discovered that the content would loop itself in a loop. What do I mean?
<!--more-->
Imagine a page with one cfdiv using bind="url:content.cfm". You would expect that when the page loaded, there would be one HTTP request to load content.cfm. Instead, he was seeing the following (and again, for Mac Firefox users, click the upper left hand triangle if you don't see a big play button):

<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="614" height="427"> <param name="movie" value="http://content.screencast.com/users/jedimaster/folders/Jing/media/aa4cf1ea-0fa4-4558-9c65-1ab44a3c794c/bootstrap.swf"></param> <param name="quality" value="high"></param> <param name="bgcolor" value="#FFFFFF"></param> <param name="flashVars" value="thumb=http://content.screencast.com/users/jedimaster/folders/Jing/media/aa4cf1ea-0fa4-4558-9c65-1ab44a3c794c/FirstFrame.jpg&width=614&height=427&content=http://content.screencast.com/users/jedimaster/folders/Jing/media/aa4cf1ea-0fa4-4558-9c65-1ab44a3c794c/00000002.swf"></param> <param name="allowFullScreen" value="true"></param> <param name="scale" value="showall"></param> <param name="allowScriptAccess" value="always"></param> <param name="base" value="http://content.screencast.com/users/jedimaster/folders/Jing/media/aa4cf1ea-0fa4-4558-9c65-1ab44a3c794c/"></param> <embed src="http://content.screencast.com/users/jedimaster/folders/Jing/media/aa4cf1ea-0fa4-4558-9c65-1ab44a3c794c/bootstrap.swf" quality="high" bgcolor="#FFFFFF" width="614" height="427" type="application/x-shockwave-flash" allowScriptAccess="always" flashVars="thumb=http://content.screencast.com/users/jedimaster/folders/Jing/media/aa4cf1ea-0fa4-4558-9c65-1ab44a3c794c/FirstFrame.jpg&width=614&height=427&content=http://content.screencast.com/users/jedimaster/folders/Jing/media/aa4cf1ea-0fa4-4558-9c65-1ab44a3c794c/00000002.swf" allowFullScreen="true" base="http://content.screencast.com/users/jedimaster/folders/Jing/media/aa4cf1ea-0fa4-4558-9c65-1ab44a3c794c/" scale="showall"></embed> </object>

What you are seeing here is a few reloads and the Ajax loads normally, and then all of a sudden the last reload causes an infinite reload as reported by Firebug.

I had no idea what the problem was until my reader mentioned he was using SES urls. Guess what - that was the issue. I simply added /x/1 to my URL (for example: http://localhost/test.cfm/x/ismell). 

If you think about it, it kind of makes sense that a cfdiv with this url "test.cfm", isn't qualified and would be a problem. However, I would not have guessed tht it would cause the constant looping as is shown above.

The fix, of course, is to change the cfdiv to use a full url:

<code>
&lt;cfdiv bind="url:/data.cfm" /&gt;
</code>