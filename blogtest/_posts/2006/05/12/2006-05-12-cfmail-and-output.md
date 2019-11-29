---
layout: post
title: "cfmail and cfoutput"
date: "2006-05-12T12:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/12/cfmail-and-output
guid: 1264
---

A week or so ago I had an odd error report on the BlogCFC beta. A user had errors using the Send() function on a CFMX 6.1 box, but not 7. The error was a null pointer exception (npe), which are notorious for being hard to debug. (For me anyway.) The error was occurring inside cfmail tags where I rendered the body of the entry. For the life of me I couldn't figure out what was going wrong... until I noticed that I had used cfoutput tags.

You aren't supposed to need cfoutput tags inside a cfmail tag since the cfmail acts like a cfoutput. So this is fine:

<code>
&lt;cfmail ...&gt;
#x#
&lt;/cfmail&gt;
</code>

In fact, earlier in the email I had done exactly that. I had simply forgotte and used cfoutput tags. 

What made this odd is that CFMX 7 had no problem with the code at all. It ran just fine. Only CFMX 6.1 threw the NPE. Anyone know why? I'm sure it's something simple. 

For those who want to test, this is a simple script I used in both 6.1 and 7:

<code>
&lt;cfmail to="whoever@localhost.com"  from="whover@localhost.com" subject="oops"&gt;
&lt;cfoutput&gt;foo&lt;/cfoutput&gt;
&lt;/cfmail&gt;
</code>

p.s. Guess which popular blogging application will be shipping later today?