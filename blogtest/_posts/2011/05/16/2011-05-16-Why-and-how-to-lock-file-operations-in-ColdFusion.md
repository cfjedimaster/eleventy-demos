---
layout: post
title: "Why (and how) to lock file operations in ColdFusion"
date: "2011-05-16T19:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/05/16/Why-and-how-to-lock-file-operations-in-ColdFusion
guid: 4234
---

The use of locking in ColdFusion still appears to vex people. I thought it would be nice to write up a quick explanation as to why (and how) you would use locking in regards to file operations. Tomorrow (ok, maybe later in the week) I'll follow up with another blog post talking about locking in terms of data.
<!--more-->
<p>

Let's begin with a simple example. Imagine you want to keep record of how many times people visit your web page. Tools like Google Analytics being too difficult to use, you decide to simply record the number of hits in a text file. (Just as a quick tip - don't do this. Please.) Your code then may look like this:

<p>

<code>
&lt;cfset fileName = expandPath("./counter.txt")&gt;

&lt;cfif fileExists(fileName)&gt;
	&lt;cfset contents = fileRead(fileName)&gt;
	&lt;cfif not isNumeric(contents)&gt;
		&lt;cfset contents = 0&gt;
	&lt;/cfif&gt;
&lt;cfelse&gt;
	&lt;cfset contents = 0&gt;
&lt;/cfif&gt;

&lt;cfset contents++&gt;

&lt;cfset fileWrite(fileName, contents)&gt;

&lt;cfoutput&gt;
Done. There are now #contents# views.
&lt;/cfoutput&gt;
</code>

<p>

All this code does is define a file name (counter.txt) and if it exists, reads it in. If it doesn't exist (or it did and had some incorrect value), it defaults the value of contents to 0. Then we simply add one to it and write it out. Simple, right? 

<p>

Now I want to imagine what happens if 2 or more users visit your web page at the same time. Remember that ColdFusion can serve the same file up to multiple people at once. If it couldn't, it wouldn't be able to handle load very well, right? Imagine 2 users hitting this file at the <b>exact</b> same time. ColdFusion reads in the file for both users at the <b>exact</b> same time. That means for both uses, the value of contents it the same number, let's say 1. Then ColdFusion carries on - adding one and writing it out - leaving a value of 2 when it should have been three. Let's see how locking can help fix this.

<p>

<code>
&lt;cfset fileName = expandPath("./counter.txt")&gt;

&lt;cflock name="counterFileRead" type="exclusive" timeout="30"&gt;
&lt;cfif fileExists(fileName)&gt;
	&lt;cfset contents = fileRead(fileName)&gt;
	&lt;cfif not isNumeric(contents)&gt;
		&lt;cfset contents = 0&gt;
	&lt;/cfif&gt;
&lt;cfelse&gt;
	&lt;cfset contents = 0&gt;
&lt;/cfif&gt;

&lt;cfset contents++&gt;

&lt;cfset fileWrite(fileName, contents)&gt;
&lt;/cflock&gt;

&lt;cfoutput&gt;
Done. There are now #contents# views.
&lt;/cfoutput&gt;
</code>

<p>

I've added 2 lines here - an opening and closing cflock. Because I'm both reading and writing a value, I used an exclusive lock. This means that <b>for this one block of the file</b> ColdFusion will only allow one person to run it. So if we go back to our imaginary situation of two (or more) users hitting this file, they would both be able to execute the first line of code, but when they hit the lock, ColdFusion would handle making one wait while the other carries on. If our initial value was 1, then the first user would write out 2 in the file, and when the next user was allowed in, he would see 2 and write it out as 3.

<p>

The name is inconsequential, but should be something sensible. "counterFileRead" should be unique to the server. If anyone else used the same lock for some other purpose, you could have people waiting when they don't need to. If you plan on doing file read and writes of dynamic files, it would then make sense to make the lock name include the file name. Lock names can be any string, so by appending the file, I can make the template a bit more friendly if the fileName value was dynamic. 

<p>

<code>
&lt;cfset fileName = expandPath("./counter.txt")&gt;

&lt;cflock name="counterFileRead: #fileName#" type="exclusive" timeout="30"&gt;
&lt;cfif fileExists(fileName)&gt;
	&lt;cfset contents = fileRead(fileName)&gt;
	&lt;cfif not isNumeric(contents)&gt;
		&lt;cfset contents = 0&gt;
	&lt;/cfif&gt;
&lt;cfelse&gt;
	&lt;cfset contents = 0&gt;
&lt;/cfif&gt;

&lt;cfset contents++&gt;

&lt;cfset fileWrite(fileName, contents)&gt;
&lt;/cflock&gt;

&lt;cfoutput&gt;
Done. There are now #contents# views.
&lt;/cfoutput&gt;
</code>

<p>

You may ask - where would I use exclusive versus a read only lock? In my script, I'm reading and writing. Therefore I need an exclusive lock. We could modify the script a bit to not be a page view counter but simply a human counter. Ie, record every time a new person comes to visit:

<p>

<code>
&lt;cfset fileName = expandPath("./counter.txt")&gt;

&lt;cfif not isDefined("cookie.firsttime")&gt;
	&lt;cflock name="counterFileRead: #fileName#" type="exclusive" timeout="30"&gt;
	&lt;cfif fileExists(fileName)&gt;
		&lt;cfset contents = fileRead(fileName)&gt;
		&lt;cfif not isNumeric(contents)&gt;
			&lt;cfset contents = 0&gt;
		&lt;/cfif&gt;
	&lt;cfelse&gt;
		&lt;cfset contents = 0&gt;
	&lt;/cfif&gt;
	
	&lt;cfset contents++&gt;
	
	&lt;cfset fileWrite(fileName, contents)&gt;
	&lt;/cflock&gt;
	&lt;cfcookie name="firsttime" expires="never"&gt;
&lt;cfelse&gt;
	&lt;cflock name="counterFileRead: #fileName#" type="readOnly" timeout="30"&gt;
	&lt;cfif fileExists(fileName)&gt;
		&lt;cfset contents = fileRead(fileName)&gt;
		&lt;cfif not isNumeric(contents)&gt;
			&lt;cfset contents = 0&gt;
		&lt;/cfif&gt;
	&lt;cfelse&gt;
		&lt;cfset contents = 0&gt;
	&lt;/cfif&gt;
	&lt;/cflock&gt;
	
&lt;/cfif&gt;
&lt;cfoutput&gt;
Done. There are now #contents# visitors.
&lt;/cfoutput&gt;
</code>

<p>

In this version we check for the existence of a cookie. If it doesn't exist, we proceed as before. Lock, read, increment, and write. If the cookie does exist, we just read. Notice that the lock name remains the same. <b>That's crucial.</b> However we can switch to a readOnly lock for that operation as we aren't modifying the value. (To be honest, we could probably get rid of the lock completely. If the value actually changed between when we read it and stored the value, it probably wouldn't matter in the real world.)