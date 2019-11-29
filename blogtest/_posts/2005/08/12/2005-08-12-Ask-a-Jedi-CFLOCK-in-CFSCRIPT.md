---
layout: post
title: "Ask a Jedi: CFLOCK in CFSCRIPT?"
date: "2005-08-12T17:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/12/Ask-a-Jedi-CFLOCK-in-CFSCRIPT
guid: 696
---

Heinz asks:

<blockquote>
I saw that you have generated substitutions to user CF-tags in CFSCRIPT [at CFLIB].

My problem:
I want to have a substitute for CFLOCK but CFLOCK has a start- and a end-tag!

Do you have a hint to solve this?
</blockquote>

So, what Heinz is talking about is a set of UDFs I built that allow you to call CF tags in CFSCRIPT. You can find an entire library of them called <a href="http://www.cflib.org/library.cfm?ID=17">CFMLLib</a>. One example is <a href="http://www.cflib.org/udf.cfm?id=629">WDDXSerialize</a>. It allows you do stuff like this:

<div class="code"><FONT COLOR=MAROON>&lt;cfscript&gt;</FONT><br>
x = arrayNew(<FONT COLOR=BLUE>1</FONT>);<br>
x[1] = now();<br>
x[2] = structNew();<br>
x[2].foo = <FONT COLOR=BLUE>"goo"</FONT>;<br>
packet = wddxSerialize(x);<br>
writeOutput(left(htmlEditFormat(packet),<FONT COLOR=BLUE>100</FONT>));<br>
<FONT COLOR=MAROON>&lt;/cfscript&gt;</FONT></div>

However, as Heinz points out, there is no way to duplicate the concept of locking, since locking involves wrapping a set of commands. So the short answer is - he is right. However, one of the best things about ColdFusion is that there is multiple ways to solve a problem.

Let's say you want to access a value in the Application scope, but others may access it as well, so you want to have a ReadOnly lock when reading it, and an exclusive lock when writing it. How about a simple UDF?

<div class="code"><FONT COLOR=MAROON>&lt;cffunction name=<FONT COLOR=BLUE>"scopeLockRead"</FONT> output=<FONT COLOR=BLUE>"false"</FONT> returnType=<FONT COLOR=BLUE>"any"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"scope"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"key"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"timeout"</FONT> type=<FONT COLOR=BLUE>"numeric"</FONT> required=<FONT COLOR=BLUE>"false"</FONT> default=<FONT COLOR=BLUE>"30"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset var ptr = <FONT COLOR=BLUE>""</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cflock scope=<FONT COLOR=BLUE>"#arguments.scope#"</FONT> type=<FONT COLOR=BLUE>"readOnly"</FONT> timeout=<FONT COLOR=BLUE>"#arguments.timeout#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset ptr = structGet(arguments.scope)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfreturn duplicate(ptr[arguments.key])&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cflock&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cffunction&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cffunction name=<FONT COLOR=BLUE>"scopeLockWrite"</FONT> output=<FONT COLOR=BLUE>"false"</FONT> returnType=<FONT COLOR=BLUE>"void"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"scope"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"key"</FONT> type=<FONT COLOR=BLUE>"string"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"value"</FONT> type=<FONT COLOR=BLUE>"any"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfargument name=<FONT COLOR=BLUE>"timeout"</FONT> type=<FONT COLOR=BLUE>"numeric"</FONT> required=<FONT COLOR=BLUE>"false"</FONT> default=<FONT COLOR=BLUE>"30"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset var ptr = <FONT COLOR=BLUE>""</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cflock scope=<FONT COLOR=BLUE>"#arguments.scope#"</FONT> type=<FONT COLOR=BLUE>"exclusive"</FONT> timeout=<FONT COLOR=BLUE>"#arguments.timeout#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset ptr = structGet(arguments.scope)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset ptr[arguments.key] = arguments.value&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cflock&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cffunction&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
<FONT COLOR=MAROON>&lt;cfscript&gt;</FONT><br>
scopeLockWrite(<FONT COLOR=BLUE>"server"</FONT>,<FONT COLOR=BLUE>"counter"</FONT>,<FONT COLOR=BLUE> 100</FONT>);<br>
writeOutput(scopeLockRead(<FONT COLOR=BLUE>"server"</FONT>,<FONT COLOR=BLUE>"counter"</FONT>));<br>
<FONT COLOR=MAROON>&lt;/cfscript&gt;</FONT></div>

This example presents two UDFs. The first, scopeLockRead, will perform a locked read on the requested scope. The second one will do an update. Now - this doesn't give you <i>exactly</i> what you want, but it may be useful. 

Another thing to consider. If your operation needs to be locked and you want to call the operation from cfscript, simply put the entire operation, including the locks, in a UDF. Don't forget that a UDF need not be a "generic utility", it could be very specific to your application. Once you have wrapped it up into a UDF, then you could easily call it from CFSCRIPT.

Anyone else have thoughts on this?