---
layout: post
title: "Ask a Jedi: Understanding Dereferencing Bug"
date: "2005-10-21T08:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/21/Ask-a-Jedi-Understanding-Dereferencing-Bug
guid: 862
---

Annabella asks:

<blockquote>
I am not a developer, I am a software project manager trying to test custom code for a customer. I am getting the following error:
You have attempted to dereference a scalar variable of type class java.lang.String as a structure with members

However, no one else with this code is getting the error. What could I have installed on my computer or NOT installed on my computer that is causing the error; when no one else is getting it? Thank you!
</blockquote>

The error you are getting simply means that you are treating a string variable (&lt;cfset name="Raymond"&gt;) as a structure (&lt;cfoutput&gt;#name.somekey#&lt;/cfoutput&gt;). I've always thought that error should be rewritten. 

So the odd thing is - why do you get the error when no one else does. First off - it is very, very, <i>very</i> unlikely that something installed on your computer would cause CF to break. The only way I know of that happening is if you were using some third party tool to sniff browser features, plugins, etc, and values it loaded were odd for your computer. But the <i>general</i> answer is no - it shouldn't be your computer. 

What you want to do is step through your code. Begin with the first file executed, which will either be Application.cfm or Application.cfc usually. Look for where the variable is created and consider why it would be created as a string and not a structure as you expect. Use a lot of &lt;cfabort&gt;s if you have to and simply trace the execution from line one till the error happens again.