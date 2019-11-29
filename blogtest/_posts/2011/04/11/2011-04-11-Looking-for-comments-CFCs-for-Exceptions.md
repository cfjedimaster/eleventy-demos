---
layout: post
title: "Looking for comments - CFCs for Exceptions"
date: "2011-04-11T19:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/11/Looking-for-comments-CFCs-for-Exceptions
guid: 4191
---

This question came in from a reader and it was something I really wanted my readers to weigh in on. Frankly I have no good answer here so I'm hoping others can chime in.

<blockquote>
I'm in the design phase of an object oriented web app (in ColdFusion) and I am at the point where I'm laying out the error handling for this app. Most of my error handling up to this point involves modifying the onError method in App.cfc to output a global template that displays the error message and logs/emails any necessary information for the devs. However, lately I have been thinking about creating custom CFCs for errors specific to this part of the application. This app is part of a much larger app and the idea of having customized errors to contain module specific info/behavior sounds pretty appealing.
<br/><br/>
I'm wondering if you or anyone you know of has had experience with custom error CFCs and if you would recommend them or not. Also, if you would recommend them, is there a guide from Adobe I should follow when sub-classing the exception class? Can I even sub-class that class in ColdFusion?
</blockquote>
<!--more-->
<p/>

Ok, so right off the bat - I do not believe ColdFusion allows you to "sub class" exceptions. You can use cfthrow to raise an exception. This can contain simple hard coded information like so:

<p/>

<code>
&lt;cfthrow message="some message" detail="some detail" type="my.custom.type"&gt;
</code>

<p/>

And while I'm assuming ColdFusion creates a dynamic exception behind the scenes, I'm not sure I'd call this the same as something like this:

<p/>

<code>
component extends="java.lang.exception"
</code>

<p/>

My gut tells me that on one hand you are maybe making things a bit too complex, however, I'm not so certain it is always a bad idea. Given the fact that I can throw a custom type, how would I nicely manage that in a large application that may need to create a large number of custom errors? I could see - perhaps - creating a CFC to help abstract and formalize that within your application. This could be useful to ensure that the type attribute for your custom exceptions follow a specific format. So for example, when you throw and use dot notation, you can use a catch statement to match against a higher level version of type. That sounds horribly worded, but maybe an example will help:

<p/>

<code>

&lt;cftry&gt;
	
	&lt;cfthrow message="foo" type="core.goo"&gt;
	
	&lt;cfcatch type="core.zoo"&gt;
		zoo caught
	&lt;/cfcatch&gt;
	
	&lt;cfcatch type="core"&gt;
		core caught
	&lt;/cfcatch&gt;

&lt;/cftry&gt;
</code>

<p/>

As you can see, my type is core.goo. When run, the second catch which looks for the more high level 'core' type will successfully match against the exception. Given a choice between more and less precise, ColdFusion will correctly match the more precise version:

<code>

&lt;cftry&gt;
	
	&lt;cfthrow message="foo" type="core.goo"&gt;
	
	&lt;cfcatch type="core.zoo"&gt;
		zoo caught
	&lt;/cfcatch&gt;
	
	&lt;cfcatch type="core"&gt;
		core caught
	&lt;/cfcatch&gt;

	&lt;cfcatch type="core.goo"&gt;
		goo caught
	&lt;/cfcatch&gt;
	
&lt;/cftry&gt;
</code>

<p/>

In that version, core.goo, the 3rd cfcatch block, will execute. So - given that - I could imagine an application handling prefixing all thrown exceptions with a particular type. Perhaps even doing some validation to ensure no two CFCs share the same type.

<p/>

So I'm really just talking out of my rear here. My main question is then - is my reader making this too complex? Have people had a need for something like this?