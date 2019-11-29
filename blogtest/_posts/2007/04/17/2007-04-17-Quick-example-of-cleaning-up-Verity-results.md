---
layout: post
title: "Quick example of cleaning up Verity results"
date: "2007-04-17T13:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/17/Quick-example-of-cleaning-up-Verity-results
guid: 1964
---

Christian Ready pinged me a few days ago about an interesting problem he was having at one of his <a href="http://www.marcor.com/">web sites</a>. His search (Verity-based on CFMX7) was returning HTML. The HTML was escaped so the user literally saw stuff like this in the results:

<blockquote>
Hi, my name is &lt;b&gt;Bob&lt;/b&gt; and I'm a rabid developer!
</blockquote>
<!--more-->
I pointed out that the regex used to remove HTML would also work for escaped html:

<code>
&lt;cfset cleaned = rereplace(str, "&lt;.*?&gt;", "", "all")&gt;
</code>

In English, this regex matches the escaped less than sign (&amp;lt;), any character (non greedy, more on that in a bit), and then the escaped greater than symbol (&amp;gt;). The "non greedy" part means to match the smallest possible match possible. Without this, the regex would remove the html tag and everything inside of it! We just want to remove the tags themselves.

This worked - but then exposed another problem. Verity was returning text with incomplete HTML tags. As an example, consider this text block:

<code>
ul&gt;This is some &lt;b&gt;bold&lt;/b&gt; html with &lt;i&gt;markup&lt;/i&gt; in it.
Here is &lt;b
</code>

Notice the incomplete HTML tag at the beginning and end of the string. Luckily regex provides us with a simple way to look for patterns at either the beginning or end of a string. Consider these two lines:

<code>
&lt;cfset cleaned = rereplace(cleaned, "&lt;.*?$", "", "all")&gt;
&lt;cfset cleaned = rereplace(cleaned, "^.*?&gt;", "", "all")&gt;
&lt;/code

The first line looks for a match of a &amp;lt; at the end of the string. The next line looks for a &gt; at the beginning of the string. Both allow for bits of the html tag as well.

So all together this is the code I gave him:

&lt;code&gt;
&lt;cfset cleaned = rereplace(str, "&lt;.*?&gt;", "", "all")&gt;
&lt;cfset cleaned = rereplace(cleaned, "&lt;.*?$", "", "all")&gt;
&lt;cfset cleaned = rereplace(cleaned, "^.*?&gt;", "", "all")&gt;
</code>

Most likely this could be done in one regex instead.