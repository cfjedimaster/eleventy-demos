---
layout: post
title: "Ask a Jedi: CFC and Array Results"
date: "2005-12-06T11:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/06/Ask-a-Jedi-CFC-and-Array-Results
guid: 954
---

This good question came in today:

<blockquote>
On this page (<a href="http://www.macromedia.com/support/documentation/en/coldfusion/mx7/releasenotes.html#changes">link</a>) are the release notes for ColdFusion MX 7.  In there, there is a statement that says "CFCs can now return arrays of CFC instances." under the section of 'ColdFusion Components (CFCs)'.  Now how do I accomplish this?  Yes, I know I can create return array that contains an instance of cfc's in each index, but we could do that with MX 6.  So what is different about this in MX 7 and how do we invoke this feature?  And, can you think of any good situations where this can be used?
</blockquote>

The note is a bit unclear. You have always been able to return an array of components, however, your return type had to be set to array (or any of course). However - you can now be more precise and set a return type of:

cfctype[]

So consider this example:

<code>
&lt;cfcomponent&gt;

	&lt;cffunction name="test" access="remote" returntype="apple"&gt;
		&lt;cfreturn createObject("component", "apple")&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="testarray" access="remote" returntype="apple[]"&gt;
		&lt;cfset var result = arrayNew(1)&gt;
		&lt;cfset result[1] = createObject("component", "apple")&gt;
		&lt;cfset result[2] = createObject("component", "apple")&gt;
		&lt;cfreturn result&gt;
	&lt;/cffunction&gt;
		
&lt;/cfcomponent&gt;
</code>

The first method returns just one apple. The second method returns an array of apples. Unfortunately, you can't do this will built-in types. In other words, the following is <b>not</b> supported: returnType="numeric[]". 

So why would you use it? I don't know. It's entirely up to your business logic. If it makes sense to return an array of components, then use it. I'd recommend using foo[] over array since foo[] is more specific.