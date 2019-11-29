---
layout: post
title: "ColdFusion 8's Ajax debug works nicely with Spry"
date: "2007-08-14T17:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/14/ColdFusion-8s-Ajax-debug-works-nicely-with-Spry
guid: 2278
---

Wow - this was a surprise. I was trying to debug a Spry issue this morning and not having any luck at all. I was using Spry's debug panel which you enable like so:

<code>
Spry.Data.Region.debug = false;
</code>

And I was sending debug messages like so:

<code>
Spry.Debug.trace('....');
</code>

On a whim I decided to see if ColdFusion 8's debug window would show me more information as I was banging my head against the wall trying to figure out the solution. 

The first thing I did was to enable the Ajax debug console in the ColdFusion Admin. I then went to my test page with ?cfdebug=1 in the URL, but nothing showed up. Turns out that the ColdFusion debug window will not show up unless ColdFusion <i>thinks</i> you are actually using Ajax - it's own Ajax. While I think that is a mistake on Adobe's part - it is very easy to work around. <a href="http://cfsilence.com/blog/client/">Todd Sharp</a> made this suggestion - just add an empty cfajaximport to your page, like so:

<code>
&lt;cfajaximport /&gt;
</code>

This line by itself will trick the window into working.

Now at this point you can use the normal ColdFusion debug items - or even use the Spry debug commands. But to use Spry's debug stuff, you must enable Spry debugging, which means you will have two debug windows on screen. What is cool is that ColdFusion's window picks up and displays the same Spry debug information as Spry does - and will even show a spry "group" that you can filter by.