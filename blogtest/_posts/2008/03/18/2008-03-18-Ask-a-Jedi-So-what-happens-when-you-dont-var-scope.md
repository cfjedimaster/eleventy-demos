---
layout: post
title: "Ask a Jedi: So what happens when you don't var scope?"
date: "2008-03-18T19:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/18/Ask-a-Jedi-So-what-happens-when-you-dont-var-scope
guid: 2715
---

So I got a good follow up question today on var scoping (Did someone decide today was Var Scope day? What do I give?) based on my <a href="http://www.raymondcamden.com/index.cfm/2008/3/18/Ask-a-Jedi-CFC-Scope-Question">earlier post</a>. Matt asks:

<blockquote>
<p>
I know that I am supposed to var my variables inside my cfc functions. What happens if I don't var them.
</p>
</blockquote>

You've probably heard me preach on var scoping many times before, as well as other speakers in the ColdFusion community. So why do we keep ranting on it? The simple answer is that un-var scoped values leak. What do I mean? Consider this simple, non-cfc example. (Don't forget the 'var scoping' rule applies to both CFC methods and UDFs.)
<!--more-->
<code>
&lt;cfscript&gt;
function doit(x) {
	y = 2;
	return x*y;
}
&lt;/cfscript&gt;

&lt;cfoutput&gt;#doit(10)#&lt;/cfoutput&gt;
</code>

This UDF simply returns the double of a value. What makes this interesting is if you add a bit of debugging:

<code>

&lt;cfscript&gt;
function doit(x) {
	y = 2;
	return x*y;
}
&lt;/cfscript&gt;

&lt;cfdump var="#variables#"&gt;
&lt;cfoutput&gt;#doit(10)#&lt;/cfoutput&gt;
&lt;cfdump var="#variables#"&gt;
</code>

When you first run it, the Variables scope only contains the UDF. But when you run it again, y is now defined as 2. So why is this a big deal? Consider this example:

<code>

&lt;cfscript&gt;
function doit(x) {
	y = 2;
	return x*y;
}
&lt;/cfscript&gt;

&lt;cfset y = 199&gt;
&lt;cfset doubley = doit(y)&gt;
&lt;cfoutput&gt;
Our original value is #y#, and double it is #doubley#
&lt;/cfoutput&gt;
</code>

I've taken a variable, Y, and stored a value in it. I then call my UDF to get the double of it - then I output the results. If you run this, you will see:

<blockquote>
<p>
Our original value is 2, and double it is 398 
</p>
</blockquote>

This is certainly <b>not</b> what we want and it clearly shows the negative side effects of missing var statements. In my example it was relatively easy to track down since the UDF was on page, but in a CFC it could be much harder to figure out. Missing var scopes are one of the most difficult bugs to track down.