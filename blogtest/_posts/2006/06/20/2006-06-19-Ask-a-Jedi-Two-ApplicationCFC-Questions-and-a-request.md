---
layout: post
title: "Ask a Jedi: Two Application.CFC Questions (and a request)"
date: "2006-06-20T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/20/Ask-a-Jedi-Two-ApplicationCFC-Questions-and-a-request
guid: 1345
---

A readers asked a few questions in regards to Application.cfc. I've broken up his request and have some answers below.

<blockquote>
Rayster, a request and two questions:
First the request: Your Application.cfc is great - very useful.  But would be even more so with comments?  And even more so with some simple code to do the kinds of thing you might do in each method?  
</blockquote>

The reader is talking about my <a href="http://ray.camdenfamily.com/downloads/app.pdf">Application.cfc reference</a>. While this is a good suggestion, I actually created it to be more of a skeleton. Something you can cut and paste, or use as a CFEclipse snippet. 

<blockquote>
And first question: How do you lock the application scope in OnSessionEnd() when you are referencing it as ARGUMENTS.appScope - I want to decrement APPLICATION.currentSessions by 1.
</blockquote>

Great question. Inside the onSessionEnd, and onApplicationEnd methods, you cannot directly access the Application scope. Therefore, you need to use a named lock instead of a scoped lock. Just be sure to use a unique name, and ensure you use the same name when setting the variables as well. I'll typically put this at the top of my CFC:

<code>
&lt;cfset variables.LOCK_NAME = "myappsname"&gt;
</code>

Then when working with the variables I'll do this:

<code>
&lt;cflock name="#variables.LOCK_NAME#" type="exclusive" timeout="30"&gt;
&lt;cfset arguments.appScope.numSessions = arguments.appScope.numSessions - 1&gt;
&lt;/cflock&gt;
</code>

<blockquote>
Second question: How does the Coldfusion server even know that Im calling it "appScope" and not "applicationScope"  both seem to work?!
</blockquote>

This is not an Application.CFC question, but more a CFC or even a simple UDF question. When writing a method/udf, you can name your arguments anything you want. In the case of the onSessionEnd for example, ColdFusion passes the argument data and simply doesn't care what you call the arguments on the inside of the method. 

Sometimes you do care about the argument names. While normally you call methods/udf with "positional" arguments (ie, the first and second arguments match up with the first and second cfargument tags), you can also use named arguments when calling a method/UDF. Here is an example of how you would call a method using this format:

<code>
&lt;cfset result = foo.theMethod(projectid=url.id)&gt;
</code>

In this example, I've specified a specific argument name, projectid, and set the value to url.id. You typically only use this format with UDFs that have numerous arguments. Using this format lets you not worry about specifying each and every argument and keeping it in the precise right order.