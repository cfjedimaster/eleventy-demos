---
layout: post
title: "Ask a Jedi: Detect JavaScript with ColdFusion?"
date: "2008-10-15T22:10:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2008/10/15/Ask-a-Jedi-Detect-JavaScript-with-ColdFusion
guid: 3055
---

Jose asks:

<blockquote>
<p>
Is there a way to check if JavaScript is enabled using Coldfusion?
</p>
</blockquote>

The answer is absolutely not. JavaScript is client side. ColdFusion is server side. That being said, if you don't mind hacking it up a bit, it isn't too difficult to accomplish.
<!--more-->
The simplest way is to use an intermediate web page. By that I mean when a user requests index.cfm, you output a page with JavaScript that uses JavaScript to change the location to something like index.cfm?jsenabled=1. The presence of the URL variable would tell you if JavaScript is enabled. A variation of this technique would use JavaScript to set a cookie that ColdFusion could then read.

In both cases though you can't do it in one request only. You would have to use two requests to figure it out. 

Personally I prefer keeping it simple. Put a message on your web site and you're done. Detecting JavaScript isn't full proof, and even if you use code to check for JavaScript when someone enters your site, it is trivial to then turn it off later on.

<b>Edit:</b> I forgot to mention. I've used the excellent <a href="http://cyscape.com/products/bhawk/">BrowserHack</a> in the past for clients who insist on stuff like this.