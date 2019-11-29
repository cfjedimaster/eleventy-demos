---
layout: post
title: "Interesting tidbits on ColdFusion Exceptions"
date: "2009-09-17T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/17/Interesting-tidbits-on-ColdFusion-Exceptions
guid: 3529
---

A reader posted an interesting comment to my <a href="http://www.raymondcamden.com/index.cfm/2007/12/5/The-Complete-Guide-to-Adding-Error-Handling-to-Your-ColdFusion-Application">ColdFusion Exception Handling Guide</a>. He had modified his error handling to store the errors in a database. This allowed him to look at history exception information, do trending, etc. But he ran into trouble trying to remove the stack trace from the exception object. Here is an example of that.
<!--more-->
Imagine a simple onError like so:

<code>
&lt;cffunction name="onError" returnType="void" output="false"&gt;
	&lt;cfargument name="exception" required="true"&gt;
	&lt;cfargument name="eventname" type="string" required="true"&gt;
	&lt;cfset structDelete(arguments.exception, "stacktrace")&gt;
	&lt;cfdump var="#exception#"&gt;
	&lt;cfabort&gt;
&lt;/cffunction&gt;
</code>

Doing this causes the error handler itself to barf out: <b>cannot remove properties from a java object</b>. While I knew that Exceptions were Java objects, I had always assumed that when ColdFusion got to it, it was a normal struct. When you cfdump it, you see a struct, which is very different from the normal Java object dump. However, you can see that it is not if you check the class name:

<code>
&lt;cfdump var="#exception.getClass().getName()#"&gt;
</code>

This returns <b>coldfusion.runtime.UndefinedVariableException</b> whereas a "real" structure would return <b>coldfusion.runtime.Struct</b>. Ok, so this implies that cfdump recognizes the ColdFusion exception and massages the output a bit. What happens if we try to duplicate the structure?

<code>
&lt;cfset var ex = duplicate(arguments.exception)&gt;
&lt;cfset structDelete(ex, "stacktrace")&gt;
&lt;cfdump var="#ex#"&gt;
</code>

Unfortunately this returns the exact same error: <b>cannot remove properties from a java object</b>. So we still have a Java object after the duplicate. No surprise there I guess, but if cfdump had a 'hack' for ColdFusion exceptions I thought perhaps duplicate might. 

I then tried this variation:

<code>
&lt;cfset var newEx = structNew()&gt;
&lt;cfloop item="key" collection="#arguments.exception#"&gt;
	&lt;cfset newEx[key] = duplicate(arguments.exception[key])&gt;
&lt;/cfloop&gt;

&lt;cfdump var="#newEx#"&gt;
&lt;cfdump var="#newex.getClass().getName()#"&gt;
</code>

And bam - that did it. So at the key level the values came over correctly. And just to be sure, I then did this:

<code>
&lt;cfset newEx.stackTrace = left(newEx.stackTrace, 100)&gt;
</code>

And bam - that worked perfectly.

Of course, this may be overkill. If you are inserting the values from the exception object into the database, you can simply do the left in your cfquery. So for example, this is fine: 

<code>
&lt;cfoutput&gt;#left(arguments.exception.stacktrace,10)#&lt;/cfoutput&gt;
</code>

I'm not modifying the actual Exception object, just the result of getting the string value.