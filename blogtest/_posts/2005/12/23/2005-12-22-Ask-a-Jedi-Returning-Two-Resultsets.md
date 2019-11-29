---
layout: post
title: "Ask a Jedi: Returning Two Resultsets"
date: "2005-12-23T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/23/Ask-a-Jedi-Returning-Two-Resultsets
guid: 990
---

A reader asks:

<blockquote>
Oh Jedi, please tell me the most effecient way to return 2 resultsets from a CFC? In a CFC I have a stored proceedure which returns 2 resultsets (2 queries). I need to send both of these back to the calling cfml page. At the moment I'm doing this by calling the CFC using dot notation and referencing the 1st resultset in the normal way and the 2nd resultset as obj.resultset because in the CF I've called it this.resultset (using the THIS scope). Thanks.
</blockquote>

Your question could actually apply to just about anything. What if you needed to return an array and a string? A query and an array? An array and a weapon of mass destruction? For any complex result like this, I'd just consider a simple structure. You could place both resultsets in a structure with appropriately named keys. If your result is complex enough, you could consider returning a CFC. So your code could look like so....

<code>
&lt;cfset result = myCFC.getComplexCrap()&gt;
&lt;cfset foo = result.getFoo()&gt;
&lt;cfset goo = result.getGoo()&gt;
</code>

What's nice about the CFC approach is that your calling code doesn't have to know about the structure of the result. If you use a struct, you have to know ("I have keys Foo and Goo"). If your struct changed, all your calling code would have to be updated as well. The CFC approach keeps such details abstracted.