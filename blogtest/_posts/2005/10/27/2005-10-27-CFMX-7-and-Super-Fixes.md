---
layout: post
title: "CFMX 7 and Super Fixes"
date: "2005-10-27T13:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/27/CFMX-7-and-Super-Fixes
guid: 875
---

So, I don't think this was in the release notes, but either CFMX7 or 7.0.1 fixes a bug where a super call can't use named arguments. In other words, this used to throw an error:

<code>
&lt;cfreturn super.someMethod(arg1=value1, arg2=value2)&gt;
</code>

As I said, this works fine now. <b>However</b>, if you try the same thing with a simple UDF copied to a structure, like the request scope, an error will occur:

<blockquote>
Cannot invoke method ran on an object of type coldfusion.runtime.RequestScope with named arguments.
Use ordered arguments instead.
</blockquote>

I've filed a bug and hopefully this will be corrected.