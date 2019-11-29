---
layout: post
title: "Ask a Jedi: Formatting a year to just 08?"
date: "2008-01-17T14:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/17/Ask-a-Jedi-Formatting-a-year-to-just-08
guid: 2598
---

Robert asks:

<blockquote>
<p>
Ok.. I'm doing :

#Year(Now())#

to get just the current year. It returns 2008.. great.. How do I get it to return just 08?

I've tried:

#Year(Now(),"yy")#
#Year(Now(),"y")#

But both fail. Any suggestions for the stupid?
</p>
</blockquote>

You aren't stupid. You just overthought it a bit. ;) Like most things in ColdFusion, you have multiple ways to do this. One way is with the simple Right() function:

<code>
&lt;cfset thisyear = year(now())&gt;
&lt;cfset oyear = right(thisyear,2)&gt;
&lt;cfoutput&gt;#oyear#&lt;/cfoutput&gt;
</code>

You could write that all in one line of course. Another way to do it with dateFormat, and that's the form I'd use:

<code>
&lt;cfoutput&gt;#dateFormat(now(), "yy")#&lt;/cfoutput&gt;
</code>