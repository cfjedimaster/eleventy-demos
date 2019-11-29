---
layout: post
title: "CFAJAXPROXY and Extended CFCs"
date: "2009-05-11T23:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/05/11/CFAJAXPROXY-and-Extended-CFCs
guid: 3352
---

Well here is something I didn't expect. Thanks go to a <a href="http://www.raymondcamden.com/forums/messages.cfm?threadid=2E564431-D8BE-C2ED-80870BBF594376E6&#top">forum poster</a> for bringing this to my attention. When you use cfajaxproxy to proxy a CFC, and that CFC extends another CFC, you don't get access to the remote methods defined in the base CFC. Consider the following example.
<!--more-->
First, our base CFC:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="basemethod" access="remote" returnType="string" output="false"&gt;
	&lt;cfreturn "Hi from base!"&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

It has one simple method, basemethod(), defines as remote. Now for our main CFC, test.cfc:

<code>
&lt;cfcomponent output="false" extends="base"&gt;

&lt;cffunction name="double" access="remote" returnType="any" output="false"&gt;
	&lt;cfargument name="number" required="true" type="any"&gt;
	&lt;cfif isNumeric(arguments.number)&gt;
		&lt;cfreturn 2*arguments.number&gt;
	&lt;cfelse&gt;
		&lt;cfreturn 0&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

This defines a simple method, double(), that will double a value. Ok, now for the front end code:

<code>
&lt;cfajaxproxy cfc="test" jsclassname="myproxy"&gt;
&lt;script&gt;
var myCFC = new myproxy()

function doDouble() {
	result = myCFC.double(5)
	console.log(result)
}	

function doBase() {
	result = myCFC.basemethod()
	console.log(result)
}	
&lt;/script&gt;

&lt;button onclick="doDouble()"&gt;Run doDouble&lt;/button&gt;
&lt;br/&gt;
&lt;button onclick="doBase()"&gt;Run doBase&lt;/button&gt;
</code>

I begin by creating the proxy with cfajaxproxy. Then I have a JavaScript block with tests for both methods, double and basemethod. Two buttons then let me run them. Running the code shows that double(5) runs just fine, but basemethod() gives:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 156.png">

Here's the weird thing though. I took the URL from the successful double call and modified it to run my base method:

http://localhost/test.cfc?method=basemethod&returnFormat=json&argumentCollection=more junk here...

Guess what? It worked fine. So whatever code parses the CFC to create the JavaScript proxy must not go into the base CFC. Seems odd to me as it should be trivial to walk down the CFC's functions and into the extended data.