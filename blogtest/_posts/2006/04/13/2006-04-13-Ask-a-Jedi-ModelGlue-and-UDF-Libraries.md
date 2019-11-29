---
layout: post
title: "Ask a Jedi: Model-Glue and UDF Libraries"
date: "2006-04-13T15:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/13/Ask-a-Jedi-ModelGlue-and-UDF-Libraries
guid: 1209
---

Once again I'm digging into my mail bag:

<blockquote>
Ray, I've recently been teaching myself and using model glue. For the most part i'm grasping it but one concept I can't quite grasp is validation. Pre  my OOP enlightenment i would have a udf library (thanks CFLIB!) and i would include a particular function as needed. How would my implement this udf library in model glue? Ex, how do i validate email and ssn's from a form?
</blockquote>

What I typically do, and I have seen others doing this as well, is to create a CFC to store your UDFs. Normally I like to create a CFC called utils. This will contain random little utilities that don't belong in their own CFC. An email checker is a good example of this. (Although don't forget that email and SSN checking is built into ColdFusion MX7.) So I'll have this utils.cfc with my functions.

Next - rememember that each controller will call an event, onRequestStart and onRequestEnd. Using onRequestStart, you can add to the event your utils library. Then in the views where you need the UDF library, simply grab it from the view state. Again, because you have it in the onRequestStart for your controller, all views will have access to it.