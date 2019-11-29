---
layout: post
title: "Ask a Jedi: Catching type exceptions in cfargument"
date: "2009-04-13T14:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/13/Ask-a-Jedi-Catching-type-exceptions-in-cfargument
guid: 3314
---

Bob asks:

<blockquote>
<p>
I've been googling for a couple days and can't find an answer to this. I have a function in a CFC with an argument of type numeric. If the value passed to the function is not numeric, an error is thrown. How can I catch that error? I tried wrapping the cfargument tags in a try/catch block, but CF doesn't like that. I'd like to handle it in a way that I can return a default value if the proper value isn't passed in.
</p>
</blockquote>

You've got a couple things in play here, so let me address them one by one. First, you noticed that you couldn't wrap your cfargument tag in a try/catch block. That is by design. When it comes to CFC methods, there are two 'special' types of code blocks that must placed in particular order.
<!--more-->
The first is cfargument tags. The second is var statements. In both cases, you can use CFML comments anywhere. But the important thing here is to remember that cfargument tags have to be used first and you can't mix any other tags in there. Even a simple CFIF is not allowed. 

So given that he wants to use a default value when a non-numeric argument is passed, how can he handle it? First, he has to change his cfargument tag to be looser in terms of validation. His current code probably looks like so:

<code>
&lt;cfargument name="raysage" type="numeric" required="true"&gt;
</code>

By it's very nature, this line says that the argument, raysage, must be passed and must be numeric. Period. In order to change it to allow for non-numeric values, you would simply do:

<code>
&lt;cfargument name="raysage" type="any" required="true"&gt;
</code>

Then, after any other cfargument or var statement, you would do:

<code>
&lt;cfif not isNumeric(arguments.raysage)&gt;
  &lt;cfset arguments.raysage = 0&gt;
&lt;/cfif&gt;
</code>

Obviously 0 isn't too important there. Whatever default you want to use should be placed there instead.

I shared the above with Bob and he responded with:

<blockquote>
<p>
You know, something interesting to cover might be what the purpose of the type attribute is if you can't gracefully enforce it. For example, why would I set an attribute to type="numeric" if I can't do anything with that except blow it up?
</p>
</blockquote>

My response to him was that his use of the argument is probably a bit unusual. Normally people want the argument check to be strict: You MUST pass it as type So and So. Period. 

Most of the time people would not want logic like he had. That's why we had to use a bit more code to handle his specific business rule. The same would have applied if he had some other rule, like numeric, but greater than zero. Outside of type checking, anything else would be custom.