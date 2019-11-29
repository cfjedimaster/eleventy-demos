---
layout: post
title: "Interesting PhoneGap/Android crash"
date: "2012-03-01T17:03:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2012/03/01/Interesting-PhoneGapAndroid-crash
guid: 4547
---

I've been hanging out in the jQuery Mobile IRC chat room lately and a user came in with a rather odd issue. He had a jQuery Mobile based page run via the PhoneGap wrapper that would crash (a bad SIGSEGV) when users entered a 7 in a form field. Yes, a 7.
<!--more-->
<p/>

I had absolutely no idea what this could be, but I ran the user through the normal tests I do when something bat-crap crazy happens. I had him remove parts of the form, remove jQuery Mobile, heck, remove PhoneGap, just basically start ripping things out until the app doesn't crash anymore. I wasn't able to reproduce this at all on my device.

<p/>

So - he continued down this path until he came across an incredible discovery. When he removed his CSS file, things worked.

<p/>

Yeah... CSS. So I had him share his CSS with me and Eclipse, right away, pointed out a few things as invalid. However, my Eclipse IDE is still stuck in HTML2 land so I didn't necessarily trust it. I cleared the errors, built out, and still couldn't reproduce the error myself. But he kept plugging away, until he found it:

<p/>

<code>
.ui-page {
	-webkit-backface-visibility: hidden;
}
</code>

<p>

In case you're curious, this was added due to a recommendation <a href="https://forum.jquery.com/topic/first-page-transistion-in-phonegap-blank-screen-before-transition">here</a>. Anyway, as soon as he removed the CSS, the application worked perfectly.

<p>

Credit for this goes to the user, Jim Nelson of <a href="http://www.broadtime.com">Broadtime</a>. 

<p>

Raise your hand if you <i>honestly</i> would have thought that CSS could crash an application.