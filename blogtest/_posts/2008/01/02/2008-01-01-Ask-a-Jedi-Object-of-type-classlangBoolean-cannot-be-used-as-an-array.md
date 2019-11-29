---
layout: post
title: "Ask a Jedi: \"Object of type class.lang.Boolean cannot be used as an array\""
date: "2008-01-02T07:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/02/Ask-a-Jedi-Object-of-type-classlangBoolean-cannot-be-used-as-an-array
guid: 2568
---

Darren asks:

<blockquote>
<p>
is there anything wrong with this function because when i invoke it i get a weird error i don't understand which is "Object of type class.lang.Boolean cannot be used as an array"

all i'm doing is query the db and compiling it into a 1 dimensional array. heres the function

(some stuff deleted)<br>
&lt;cfquery name="getExtraImages" datasource="#request.dsn#">
SELECT *
FROM extraimages
&lt;/cfquery&gt;<br>

&lt;cfset imageArray = arrayNew(1)&gt;<br>

&lt;cfloop query="getExtraImages" startrow="1"
endrow="#getExtraImages.recordcount#"&gt;<br>
  &lt;cfset imageArray = arrayAppend(imageArray, "#extraImagePath#")&gt;<br>
&lt;/cfloop&gt;<br>
</p>
</blockquote>

This is a simple problem, and one I see often. I'm pretty sure I answered this question before on the blog before, but as I said - it shows up often. The problem is the arrayAppend function. You would think that it takes an array, a value to add to it, and returns the new (larger) array. Instead, the function changes the array you pass to it directly and returns true or false. Now - I've never seen arrayAppend return false before, so it isn't something you have to worry about checking, but you do need to ensure you use it the right way. I'd change his line above to:

<code>
&lt;cfset arrayAppend(imageArray, extraImagePath)&gt;
</code>

Note that I removed the unnecessary pound signs as well. If that line confuses you, you can think of it like running a function and assigning to nothing. Imagine this:

<code>
&lt;cfset temp = arrayAppend(imageArray, extraImagePath)&gt;
</code>

Now imagine you don't need temp. That's where the shorter syntax is useful.