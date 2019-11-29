---
layout: post
title: "Ask a Jedi: Executing Dynamic ColdFusion"
date: "2006-01-23T15:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/23/Ask-a-Jedi-Executing-Dynamic-ColdFusion
guid: 1049
---

So a reader asks a question I've seen a few times before:

<blockquote>
Is there any way, short of writing out to a file and then using cfinclude, to create dynamic functions? That is, to use ColdFusion to create functions at runtime, and then call them from code?
</blockquote>

As I said, I've seen questions like this before, and I have to ask - why? I can't imagine a situation where something like this would even be necessary. I have seen the need for something close to this. So for example, a preference may be stored in the db as 

application.title & "'s World"

And at runtime, we want to execute that value. That can be done with a simple evaluate. (Yes, I know, evaluate is the tool of the devil.) But that is a simple variable substitution. I can't imagine a case where you would want to dynamically build business logic.

That being said - I think most developers can see a case where the <i>parameters</i> of your business logic are dynamic. So for example - you may have a business rule where if a person purchases 100 dollars or more, they get a free CD. Obviously the "100" mark is something that should be dynamic and configurable. Even the implementation of the business rule could be tired to db. (You can imagine a 'Enable High Purchase Discount' type setting.) But does it make sense for an entire rule to be created on the fly?

Again - everything in me screams, "No!", but I'd love to be proven wrong. Has anyone found a good need for this? 

So I suppose I should answer the question. As far as I know, you need to do what you said - save the data out to a flat file. That's what I did for <a href="http://www.cflib.org">CFLib</a> before I disabled the feature. BlueDragon has a render method that allows for this. (I discovered this when I had to rename one of the methods in BlogCFC.)