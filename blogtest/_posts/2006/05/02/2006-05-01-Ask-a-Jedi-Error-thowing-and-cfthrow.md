---
layout: post
title: "Ask a Jedi: Error thowing and cfthrow"
date: "2006-05-02T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/02/Ask-a-Jedi-Error-thowing-and-cfthrow
guid: 1243
---

Mike asks, 

<blockquote>
Is there an order you have to error catching?  I want to use &lt;cfthrow&gt; in my CFC for an expression if my database columns don't equal the values.  But I also have a &lt;cferror&gt; in my Application.cfm and that has a exception tied to it and that takes precedence.  How do I get my &lt;cfthrow&gt; to get thrown, or have certain errors take higher precedence?
</blockquote>

If I understand you right, you are perhaps getting confused about how cferror relates to error handling and cfthrow. This is how I would explain it. 

The cferror tag (and onError method) are used for <b>global</b> error handling of your application. I call this the "On Crap" handler (except I don't say crap). Every application should have one of these to hide errors from the user, and at minimum, it should email the details of the error to the administrator. I see far too many sites not doing this which is sad since it takes about five minutes to set up. (I've been guilty of this as well.)

So this would handle exceptions at a global level of your application. Another way of handling errors is with cftry/cfcatch. This will process a set of code (inside the cftry block) and if an exception is thrown, cfcatch can handle it. So if you want to handle the exception thrown by the CFC, you would want to wrap the call with a try/catch block:

<code>
&lt;cftry&gt;
&lt;cfset foo = someCFC.enter(4,8,15,16,23,32)&gt;
&lt;cfcatch&gt;
&lt;cfoutput&gt;An error occured entering the numbers.
&lt;/cfcatch&gt;
&lt;/cftry&gt;
</code>

The cfcatch tag can also be tuned to only catch certain exceptions. The code above would catch any exception, but you could change it to specifically look for the exception that your CFC throws. That way if something <i>else</i> goes wrong, your global error handler would handle it instead.

This is just a super high level look at exception handling. I'd check out the docs on error handling here:

<blockquote>
<a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00001130.htm#1220254">http://livedocs.macromedia.com/coldfusion/7/htmldocs/00001130.htm#1220254</a>
</blockquote>

p.s. Note, I'm having a <i>lot</i> of trouble with livedocs,  which I'm sure is due to the recent changes. So if you have trouble, maybe check your local documentation.