---
layout: post
title: "Ask a Jedi: Using UDFs with an Application.cfc Framework"
date: "2005-10-16T17:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/16/Ask-a-Jedi-Using-UDFs-with-an-Applicationcfc-Framework
guid: 851
---

Talk about timing. I'm at MAX and will be presenting on Application.cfc. Today this question comes in:

<blockquote>
i include functions in my application.cfc so that i can call them from every page. i have had to comment out the  onRequest function, because it causes my flash remoting to return a null. but with that function commented out the functions i have in the application.cfc do not seem to be accessible. what is the best way to handle functions so that they can be globally called?
</blockquote>

The issue with onRequest ans Flash (as well as web service) is a known problem in CFMX7. (Well, I'm not sure it is considered a bug or not - but it is certainly an issue.) During my presentation I'll be talking about how to deal with that. There is a way a to make it work. I discuss one such method in an old posting <a href="http://ray.camdenfamily.com/index.cfm?mode=entry&entry=ED9D4058-E661-02E9-E70A41706CD89724">here</a>. <a href="http://www.corfield.org/blog">Sean Corfield</a> has a solution as well, but for the life of me I can't find it now. Ah hah! I love gmail. So I found this post from Sean from cf-talk, and I hope he doesn't mind me quoting him:

<blockquote>
Another option is to have Application.cfc's onRequestStart() method
check if targetPage ends in ".cfc" and, if so, do
structDelete(variables,"onRequest"); structDelete(this,"onRequest");
(you need both).
</blockquote>

This would allow you to keep your UDF include in onRequest and also use Flash Remoting. Yet another option is to use another scope. You could simply copy your UDFs to the request scope and set them in onRequestStart. This has the added benefit of also allowing you to use them in deeply nested custom tags as well. Yet another option is to place them in a CFC. I do this sometimes because the UDFs end up being used by my other CFCs as well. I'll have a "utils" CFC with generic functions. This is placed in the Application scope and then available to my pages. Do note that in the "old days" (CF5), Macromedia urged you to never use memory-based scopes for UDFs. I don't believe that is an issue anymore.