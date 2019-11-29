---
layout: post
title: "Quick Ripple Tip - Detecting Ripple"
date: "2014-01-22T12:01:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/01/22/Quick-Ripple-Tip-Detecting-Ripple
guid: 5135
---

<p>
This was asked on the Ripple development listserv:
</p>

<blockquote>
For debugging purposes, I'd like to do different things when I am using ripple, than when I am running Phonegap on my phone.  Is there an easy way to tell, if I am in Ripple?
</blockquote>
<!--more-->
<p>
Gord Tanner replied that you can look for window.parent.ripple. He said he hadn't tested it but I ran a quick test and it worked fine (it existed in Ripple and did not exist in the iOS simulator).
</p>

<p>
In general writing code like this concerns me as it smells like the type of thing you can forget to remove in production, but we've all done stuff like this before (including myself) so there ya go. ;)
</p>

<p>
By the way, information about how to sign up for the mailing list can be found here: <a href="http://ripple.incubator.apache.org/#mailinglist">http://ripple.incubator.apache.org/#mailinglist</a>.
</p>