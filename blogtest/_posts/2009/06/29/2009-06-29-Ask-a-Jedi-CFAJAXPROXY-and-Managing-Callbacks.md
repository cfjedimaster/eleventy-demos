---
layout: post
title: "Ask a Jedi: CFAJAXPROXY and Managing Callbacks"
date: "2009-06-29T22:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/29/Ask-a-Jedi-CFAJAXPROXY-and-Managing-Callbacks
guid: 3414
---

Yaron asks:

<blockquote>
<p>
I'd like to know what your preference is for using cfajaxproxy.
In JavaScript, do you create one global proxy object and reuse it throughout your script? Or do you create a new proxy object within every function that generates a proxy call?
</p>
<p>
The reason I'm asking is I had multiple concurrent proxy calls that had their callback functions mixed up. Meaning, one functions makes 2 async calls with two separately defined callback functions. Unfortunately, one callback function received the input from another. Weird.
</p>
</blockquote>

Ah, asynchronous network calls. Life would be a heck of a lot easier if everything was synchronous. Let's dig a bit into what Yaron found in case it doesn't make sense.
<!--more-->
First, consider the following CFC that we will use for our Ajax calls:

<code>
&lt;cfcomponent output="false" extends="base"&gt;

&lt;cffunction name="goSlow" access="remote" returnType="string"&gt;
	&lt;cfargument name="name" type="string" required="true"&gt;
	&lt;cfset sleep(300 * randRange(1,4))&gt;
	&lt;cfif arguments.name is "foo"&gt;
		&lt;cfset sleep(200 * randRange(1,4))&gt;
	&lt;/cfif&gt;
	&lt;cfreturn "Returned from call #arguments.name#"&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

It has one method, goSlow, that runs a randomly slow sleep call, and makes it even longer if foo is passed as an argument. It then returns the argument passed to it.

The front end code for testing will be:

<code>
&lt;cfajaxproxy cfc="test" jsclassname="testProxy"&gt;
&lt;script&gt;
var foo = new testProxy()
var goo = new testProxy()

function handleResult(r) {
	console.log(r)
}

foo.setCallbackHandler(handleResult)
goo.setCallbackHandler(handleResult)

function runTest() {
	console.log("Running test....")
	foo.goSlow('foo')
	goo.goSlow('goo')
	console.log('Done with tests')
}
&lt;/script&gt;

&lt;input type="button" onClick="runTest()" value="Test"&gt;
</code>

This page makes use of cfajaxproxy to create a proxy calls called testProxy. I created two instances of it and assigned the same callback handler. The callback handler gets the result, but really has <b>no idea who calls it</b>. This is critical. Unless you set up some mechanism to pass in a 'caller' value, then you can't tell what you are responding too. Not only can't we tell which instance of testProxy was used, we can't even tell what method was called. 

So given that - what are some good ways to handle it? You could create a different call back handler for each instance. You can even do this inline:

<code>
foo.setCallbackHandler(handleResult)
goo.setCallbackHandler(function(r) {% raw %}{ console.log('special '+r)}{% endraw %})
</code>

This kinda surprised me. I mean I know that this type of function (an anonymous function) isn't jQuery only, but I didn't start using it till I got big into jQuery. Still though, if you want to run N different methods on the proxy CFC, do you really want N different instances? 

My guess is probably yes. Given that you may have one main "service" CFC to handle your Ajax calls, you could create different instances for different areas of concern. So for example:

<code>
var userProxy = new testProxy()
var pageProxy = new testProxy()
var cowbellProxy = new testProxy()
</code>

Each proxy in the above code sample will worry about different aspects of remote CFC service. 

Can anyone else offer some advice here?