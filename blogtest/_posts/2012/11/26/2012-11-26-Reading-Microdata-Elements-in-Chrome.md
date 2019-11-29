---
layout: post
title: "Reading Microdata Elements in Chrome"
date: "2012-11-26T15:11:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2012/11/26/Reading-Microdata-Elements-in-Chrome
guid: 4790
---

Before going any further, please note this blog post definitely falls into the "questionable" category. Please read the following with a large grain of salt (and a cold beer at your side). I've read a few articles recently on microdata. Today I read another good one here: <a href="http://html5hacks.com/blog/2012/11/21/make-your-page-consumable-by-robots-and-humans-alike-with-microdata/">Make Your Page Consumable by Robots and Humans Alike With Microdata</a>.
<!--more-->
The concept is rather simple. By embedding a bit of metadata into your code, you make your pages have machine-readable context. This is a bit like data attributes, but in my mind a bit different. Data attributes are, in my opinion, useful for data in a self-contained manner. Ie, you mark up your pages so your code (JavaScript or CSS) can do something with it. Microdata is for <i>external</i> consumers. Mixed with external schemas this could be pretty powerful. Apparently Google is already using this so it has some SEO value as well.

I got even more interested when I saw there was a DOM API for it: document.getItems(). This would, supposedly, return all the microdata items in your current document. Unfortunately, this failed in Chrome. Surprisingly, <a href="http://www.caniuse.com">CanIUse.com</a> failed to report on the API and I had to dig a bit more to find that - apparently - only Firefox and Opera support this API at the moment. 

I wanted to build something that would a) notice if microdata was in use and b) report how it was used. I knew I could get, and iterate, over all the items in the DOM but I assumed that would be rather wasteful. Then I discovered the <a href="https://developer.mozilla.org/en-US/docs/DOM/document.evaluate">document.evaluate</a> function. This allows you to use XPath to search the DOM. So with that at my disposal, I first created a function that would check for the existence of any microdata in use:

<script src="https://gist.github.com/4150363.js?file=gistfile1.js"></script>

If you didn't read the article I linked to before, the use of a itemscope as an attribute "wraps" DOM items that are considered one logical unit of microdata. My XPath simply looks for this and runs a count() operation to get the number of items that match.

I then wrote a function that would return these items. For the most part, this is a simple matter of iterating over XPath results and using DOM functions to get values, but you have to use a bit of logic based on what type of DOM node you're dealing with. So for example, if an Anchor tag is used for a property, then the microdata value is sourced by the href attribute. For most other things you simply use the inner text. Here's my getItems function (and yes, that name is too generic):

<script src="https://gist.github.com/4150389.js?file=gistfile1.js"></script>

I used some source HTML based on the article I linked to earlier:

<script src="https://gist.github.com/4150394.js?file=gistfile1.html"></script>

When I execute my JavaScript against this, I get:

<img src="https://static.raymondcamden.com/images/screenshot40.png" />

Useful? Not sure yet. I assume, eventually, Chrome will get the native API anyway. (Although in Firefox it returns the Node items, not a nice array like I've got, unless I'm using it wrong it looks like there may still be a need for a utility function.)