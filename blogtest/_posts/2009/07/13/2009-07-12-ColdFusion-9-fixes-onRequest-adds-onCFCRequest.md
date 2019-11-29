---
layout: post
title: "ColdFusion 9 fixes onRequest, adds onCFCRequest"
date: "2009-07-13T08:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/13/ColdFusion-9-fixes-onRequest-adds-onCFCRequest
guid: 3435
---

The title kind of says it all. Most people have heard, or unfortunately ran into, the issue with Application.cfc and onRequest when used for Ajax or Flash Remoting calls. It just plain doesn't work. You don't get a nice error either and if you haven't heard of this bug, your going to be quite confused.

The good news is that ColdFusion 9 completely fixes this. Want to use onRequest and still work with CFCs? No problem. An Ajax/Flash Remoting/Web Service call to a CFC within a directory using onRequest will simply ignore the method! Consider this simple example using a new script based Application.cfc:
<!--more-->
<code>
component {

	this.name="FixToOnRequest";
	
	public boolean function onRequestStart(string target) {
		writeLog(file="cfcfix",text="Running onRequestStart for #arguments.target#");
		return true;
	}

	public boolean function onRequest(string target) {
		writeLog(file="cfcfix",text="Running onRequest for #arguments.target#");
		include arguments.target;
		return true;
	}

}
</code>

My APplication.cfc has 2 methods, onRequestStart and onRequest. In both, I write to a log file. I then whipped up test.cfm:

<code>
This is test.cfm.
</code>

and test.cfc:

<code>
component {

remote string function sayHello() {% raw %}{ return "Hello World"; }{% endraw %}

}
</code>

I requested both in the browser. In the case of test.cfm, I got:

<blockquote>
<p>
"Information","web-15","07/13/09","06:46:21","FIXTOONREQUEST","Running onRequestStart for /test.cfm"<br/>
"Information","web-15","07/13/09","06:46:21","FIXTOONREQUEST","Running onRequest for /test.cfm"
</p>
</blockquote>

For my CFC, I got:

<blockquote>
<p>
"Running onRequestStart for /test.cfc"
</p>
</blockquote>

Notice that onRequest didn't run at all. 

ColdFusion 9 also adds onCFCRequest. This works very much the same way as onRequest. It gives you complete control over the CFC request. If you don't actually run the method yourself, then, well, it isn't run. Much like how onRequest forces you to really include the file. 

onCFCRequest is sent three arguments: CFC Name, CFC Method, and a structure of arguments. Invoking a dynamic CFC and method is a bit tricky in an all script CFC. This is how I did it, but I'm willing to bet there is a simpler way:

<code>
	public boolean function onCFCRequest(string cfc, string method, struct args) {
		writeLog(file="cfcfix",text="Running onCFCRequest for #arguments.cfc#, method #arguments.method#, args: #structKeyList(arguments.args)#");
		var comp = createObject("component", arguments.cfc);
		var res = evaluate("comp.#arguments.method#(argumentCollection=arguments.args)");
		if(isDefined("res")) writeOutput(res);
		return true;
	}
</code>

The method creates an instance of the component first. Note that my var scope is the <b>second</b> line of the method and after a logging call - this is new to ColdFusion 9. I use evaluate to call the method on the CFC, and then use isDefined as a workaround for checking for a null response. Not the most elegant code, but it works. If I go to:

http://localhost:8501/test.cfc?method=sayhello&foo=1&zoo=2

I get this in my log:

<blockquote>
<p>
"Running onCFCRequest for test, method sayhello, args: zoo,foo"
</p>
</blockquote>

I'll be honest - even without the onRequest bug, I didn't use it very often. Now that it's fixed though I won't feel so inclined to avoid it. onCFCRequest could be very useful for logging requests to an API and seeing which methods get used more often.