---
layout: post
title: "Ask a Jedi: Arguments in a CFC/UDF"
date: "2006-02-16T12:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/16/Ask-a-Jedi-Arguments-in-a-CFCUDF
guid: 1104
---

A reader asks:

<blockquote>
Can I assign a scoped variable to a non-scoped variable and still have it be protected in a CFC (or UDF)?  Example: <cfset newvar = arguments.value>  Or should I create my own custom scope?  Or do I have to type in arguments.value every time I want to use the variable?
</blockquote>

You can, if you want, copy a variable from the arguments scope. Just be sure to use the var scope though:

<code>
&lt;cfset var localcopy = arguments.somevalue&gt;
</code>

Obviously the normal rule of copy versus pointer applies. However - I'd probably argue against this. In my opinion, if your code is working with an argument, it should continue to refer to it by the full name. Yes, it's more typing, but I think it helps keep the code logic a bit more clear. You may forget, for example, that localcopy came from arguments.somevalue. By being consistent and using arguments.whatever, you do not have that problem. (Ok, so it's not a problem per se - just something that may give you trouble down the road, like in six months when you need to debug the code again.)