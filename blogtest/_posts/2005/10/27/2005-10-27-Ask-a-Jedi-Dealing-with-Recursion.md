---
layout: post
title: "Ask a Jedi: Dealing with Recursion"
date: "2005-10-27T18:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/27/Ask-a-Jedi-Dealing-with-Recursion
guid: 877
---

This question came in today and I just had to answer it quickly: (Sorry to the 200 other people who have email in my queue!)

<blockquote>
How do I return a value from a recursive function? This does not seem to work in cf. I'm basically walking up a hierarchy returning needed items when I find them.
</blockquote>

Luckily s/he sent the code. The problem will probably jump out as soon as you see it:

<code>
&lt;cffunction name="recursive" returntype="struct"&gt;
	&lt;cfargument name="id" type="numeric" required="yes" /&gt;
	&lt;cfset var stThing = structnew() /&gt;
	
	&lt;!--- do some lookup based on id ---&gt;
	&lt;cfif lookup succesful&gt;
		&lt;cfreturn stThing /&gt;
	&lt;cfelse&gt;
		&lt;!--- get parent id ---&gt;
		&lt;cfset recursive(parentid) /&gt;
	&lt;/cfif&gt;
	
&lt;/cffunction&gt;
</code>

Let's trace this line by line to see where the error occurs.

<ol>
<li>The first thing we do is create stThing as a new structure.
<li>Then we do a look up. This is the part of the code that is assumed.
<li>If the look up was successful, we return the value.
<li>If not.... and here comes the important part - we call the method again, but notice we don't set a value. Whenever you do, cfset foo(), which is allowed, you are basically running a function and ignoring the result.
</ol>

So basically his code does call itself recursively, but each time the result gets "lost" in the ether and isn't returned to the user. If he changed the cfset to:

<code>
&lt;cfreturn recursive(parentid)&gt;
</code>

It should work correctly. Recursion is like sushi - you need to be <i>very</i> careful when preparing it or the end result is crap (or even better, a server that loops until it crashes).