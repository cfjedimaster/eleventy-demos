---
layout: post
title: "Why do HTMLEditFormat and HTMLCodeFormat take a version?"
date: "2007-11-27T17:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/27/Why-do-HTMLEditFormat-and-HTMLCodeFormat-take-a-version
guid: 2500
---

Sorry for all the 'why' questions today - but this is the second time today I've run into something weird in ColdFusion. Did you know that both HTMLEditFormat and HTMLCodeFormat take a second argument? The argument, version, is supposed to allow you to specify what version of HTML to target. But for both tags - the argument is ignored. Even though the argument is ignored, the docs list out 3 possible values:

<ul>
<li>-1: The latest implementation of HTML
<li>2.0: HTML 2.0 (default)
<li>3.2: HTML 3.2
</ul>

I'm wondering if this is something that was planned a while ago and just forgotten - like the <a href="http://www.raymondcamden.com/index.cfm/2007/11/27/Why-must-cfexecute-be-closed">cfexecute oddity</a> I found earlier.