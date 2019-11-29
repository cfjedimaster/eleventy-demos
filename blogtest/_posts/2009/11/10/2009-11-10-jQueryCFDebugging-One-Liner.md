---
layout: post
title: "jQuery/CFDebugging One-Liner"
date: "2009-11-10T13:11:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/11/10/jQueryCFDebugging-One-Liner
guid: 3598
---

Ok, so this is more proof of concept than actual usable code, but I thought it might be fun to write up during lunch. Have you ever encountered ColdFusion debugging code that 'leaked' into a pure CSS site? Most of us have. That was one of the main reasons behind the genesis of <a href="http://coldfire.riaforge.org">ColdFire</a>. I was curious, though, to see if there was a jQuery way to manipulate the debug output.
<!--more-->
I opened up the debug template and found that the HTML started off with: (well, ignoring the CSS above it)

<code>
&lt;table class="cfdebug" bgcolor="white"&gt;
</code>

So with that in mind, I whipped up the following jQuery one-liner. Now - if you have heard me present on jQuery, you know that I don't actually like seeing code like this. I find it hard to read and overly confusing to people knew to jQuery. <b>Please</b> do not consider this something I'm promoting. As I said, it was more a test than anything else.

<code>
$(document).ready(function() {
	$("table.cfdebug:first").hide().parent().append("&lt;a href='' id='cfdebugtoggle'&gt;[Toggle Debug]&lt;/a&gt;").click(function() {% raw %}{$("table.cfdebug:first").toggle();return false}{% endraw %})
})
</code>

Ok, technically that is more than one line, but I'm not counting the document.ready block. What this code does, in steps, is:

<ul>
<li>Find the first instance of a table with the class debug. (I had to find the first since internal tables also used the class.)
<li>Hide it.
<li>Go up to the parent and append some HTML.
<li>For the HTML I just added, a link, add this new click handler.
<li>And in the click handler, toggle the visibility of the debug table and return false.
</ul>

Now when you load a page with ColdFusion debugging in it, you just get the link. Clicking it will open and close the debugging information. And to be clear - I didn't actually test this on a nice CSS-based web page because - well - I can't write nice CSS-based web pages. Not yet anyway.