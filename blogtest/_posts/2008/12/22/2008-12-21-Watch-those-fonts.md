---
layout: post
title: "Watch those fonts"
date: "2008-12-22T07:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/22/Watch-those-fonts
guid: 3157
---

This weekend some of the older code I worked on for <a href="http://www.broadchoice.com">Broadchoice</a> was moved to a new server. Everything worked fine until this error began to fire:

<blockquote>
<p>
The ARIAL,TIMES,COURIER font name is/are not supported.
</p>
</blockquote>

Pretty much immediately I knew what this was. The template was making use of cfimage to generate a CAPTCHA and the fonts that worked on the initial system did not work on the new system.

While easy enough to fix, I started to dig a bit to see if there was a nicer way around this. I did a bit of Googling and came across: <a href="http://cfsearching.blogspot.com/2008/07/what-fonts-are-available-in-myjvm.html">What Fonts are Available in myJVM?</a>

The good news is that yes - you can - at runtime - figure out which fonts are available. Unfortunately, even with this list you get a set of fonts that simply won't work with cfimage. When I tried his (I assume him - not sure who cfsearching is - but the blog has some <i>very</i> good entries) code I saw quite a few fonts that didn't work.

So I think the point of all this is - I don't think you can <i>nicely</i> write code that will programatically tell you which fonts you can use for CAPTCHAs. Even if you did, you would need a human opinion on which fonts are good for CAPTCHAs anyway. As much as we try to write portable code, this is probably one area where you will have to simply run a test before deploying your code. cfsearching's demo template that shows the font styles and lists the 'bad' ones is an excellent tool for this.