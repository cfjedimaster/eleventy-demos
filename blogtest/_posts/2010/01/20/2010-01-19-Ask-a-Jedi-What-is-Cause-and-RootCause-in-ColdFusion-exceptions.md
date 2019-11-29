---
layout: post
title: "Ask a Jedi: What is Cause and RootCause in ColdFusion exceptions?"
date: "2010-01-20T07:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/01/20/Ask-a-Jedi-What-is-Cause-and-RootCause-in-ColdFusion-exceptions
guid: 3688
---

A week or so ago a reader asked me about an odd change he saw when dumping exceptions in ColdFusion. In a "normal" error, he saw the following keys in the Exception object: Detail, ErrNumber, Message, StackTrack, TagContext, Type. These were all expected (although there can be more based on your error). Then he noticed that if an error occurred within Application.cfc, something else was added. To test this, I added the following:
<!--more-->
<p>

<code> 
&lt;cffunction name="onRequestStart" returnType="boolean" output="false"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	&lt;cfif structKeyExists(url, "x") &gt;
		&lt;cfthrow message="I made a boo boo." detail="method level detail"&gt;
	&lt;/cfif&gt;

	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

<p>

To test, I simply requested a file and added x=1 to my URL. When this error occurs, both a RootCause and a Cause key exist in the object. 

<p>

<img src="https://static.raymondcamden.com/images/errorstruct.png" />

<p>

While RootCause is documented, Cause was not. I bugged some folks at Adobe about this and Chandan Kumar of Adobe told me the following:

1) First, Cause is a copy of RootCause. You don't have to look at them both for information about the error.

2) Cause is actually the <i>real</i> data. It comes right from the Throwable object in Java. RootCause is actually created as the copy. Now while it may be that Cause is the real object and RootCause is the copy, I will say that since RootCause is <b>documented</b>, you should continue to use that.