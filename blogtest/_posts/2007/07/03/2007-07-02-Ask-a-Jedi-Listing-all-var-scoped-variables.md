---
layout: post
title: "Ask a Jedi: Listing all var scoped variables"
date: "2007-07-03T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/03/Ask-a-Jedi-Listing-all-var-scoped-variables
guid: 2167
---

Dale asks about var scoped variables:

<blockquote>
I think the answer is no, but it seems strange. All
variables go into a scope somehow.

But if I declare 5 variables as var within a function, coldfusion knows that they are only for that function, but how can I get to them? Is it possible to dump all var variables for a given function? Where are they hiding, are they a struct withing some other scope.

If I dump all the scopes, variables, this, sesssion etc would they simply not exist.

I normally use &lt;cfset var local = structNew() /&gt;

Which gets around this, but really wondering where the variables live.
</blockquote>

You are correct. Var scoped variables are "special" and currently there is no way to enumerate them in ColdFusion. That is exactly why some people use a local struct as you have described above. Yes, ColdFusion does know about them, and yes, it is a bit odd that they don't have a proper scope, unlike every single other variable out there. 

Personally I don't like using a struct for my var scoped variables. It just seems like too much to type. Of course the flip side is that I'm typing more var scopes. I also kind of like seeing the var scope lines as it helps remind me what is going on inside my function.