---
layout: post
title: "Ask a Jedi: cfinvoke versus createObject"
date: "2006-04-05T18:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/05/Ask-a-Jedi-cfinvoke-versus-createObject
guid: 1189
---

So I could have sworn I had blogged on this before, but I couldn't find it in my archives, so here goes. (And if I do start repeating myself, let me know folks!)

<blockquote>
Is there a reason to favor cfinvoke over cfobject? Does cfinvoke clean up after itself faster?
</blockquote>

Technically you are comparing apples and oranges. The cfobject tag (and createObject function) are meant to create an instance of a CFC. The cfinvoke tag runs a method on a CFC. You can use createObject to both create a CFC and run a method:

<code>
&lt;cfset foo = createObject("component", "president").init(42)&gt;
</code>

But the same could be done with cfinvoke. 

<code>
&lt;cfinvoke component="president" method="init" id="42" returnVariable="foo"&gt;
</code>

I think you will find it comes down to a style issue.