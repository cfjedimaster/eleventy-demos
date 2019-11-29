---
layout: post
title: "Ask a Jedi: Executing Code in OnRequestEnd after an Abort"
date: "2005-10-27T11:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/27/Ask-a-Jedi-Executing-Code-in-OnRequestEnd-after-an-Abort
guid: 874
---

A reader asks:

<blockquote>
Why isn't application.cfc's OnRequestEnd guaranteed to be called like the "Global" class in .NET? I need to ensure a stateful var struct is wddx encoded into a client var at the end of a request. But it seems cfabort, cfthrow & cflocation all fail to save the data. The coldfusion documentation only mentions this happening with OnRequestEnd.cfm. What can I do?
</blockquote>

So as you have found, any cfabort, cflocation, or cfthrow, will cause an immidiate end to the request. Code in both onRequest, after your cfinclude, or in onRequestEnd, will not run. 

There isn't much you can do about that. Folks would argue that this makes sense, especially in the case of cfabort. Abort should abort. Period. That being said, there are some alternatives.

If your use of cfabort is meant to simply stop running more lines of code in the current page, but you still want the request as a whole to continue, don't use cfabort. Instead use a flag of some sort to let the rest of the code know not to run. This is actually what I normally do in forms. I'll have a showForm flag that will get set to false. I can then check for that and hide the form and print out a thank you message instead. Basically what I am saying is - rewrite your code a bit. 

How about cfthrow? Well, like cfabort, cfthrow should stop everything. You could, if you wanted, in onRequest, wrap the cfinclude in try/catch. That works - but I'd urge against it as typically try/catch (imho) should be used to wrap small, atomic actions that can cause an error - not an entire request. 

As for cflocation - you will have to rethink your approach. You may be able to use a flag again. You can write a custom tag that simply sets a flag. That flag could be checked in onRequest, or onRequestEnd, and a cflocation run from there.

Anyone else have thoughts on it?