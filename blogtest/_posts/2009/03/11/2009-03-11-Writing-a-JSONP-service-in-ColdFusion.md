---
layout: post
title: "Writing a JSONP service in ColdFusion"
date: "2009-03-11T14:03:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/03/11/Writing-a-JSONP-service-in-ColdFusion
guid: 3272
---

Earlier this week I blogged on JSONP (<a href="http://www.developria.com/2009/03/what-in-the-heck-is-jsonp-and.html">What in the heck is JSONP and why would you use it?</a>). If that terms means nothing to you, be sure to read that article first. I thought it might be useful to talk about how you could write a ColdFusion API to support JSONP (as a producer I mean, for other people to use your API).
<!--more-->
As we know (or hopefully now!), ColdFusion 8 made it very easy to serve JSON via Ajax. Consider the following method:

<code>
&lt;cffunction name="getPerson" access="public" returnType="struct" output="false"&gt;
	&lt;cfset var s = {}&gt;
	&lt;cfset s.name = "Raymond"&gt;
	&lt;cfset s.age = "35"&gt;
	&lt;cfset s.suaveness = randRange(50,150)&gt;
	&lt;cfreturn s&gt;
&lt;/cffunction&gt;
</code>

If I wanted to expose that structure in JSON, all I'd need to do is change access to remote and specify JSON in the URL. I'd request it like so:

http://www.visitthewishlist.com/foo.cfc?method=getPerson&returnFormat=json

The returnFormat there simply asks ColdFusion to convert the structure to JSON before sending it back to the client.

Ok, so what about JSONP? JSONP stands for JSON with Padding and that presents a problem to us. We can't just return a JSON string, we have to return a JSON string plus the padding, which is a function call. ColdFusion does support a "Don't do squat with my result, just return it" version - you just change returnFormat to plain. So given that, here is how I'd build support for JSONP:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="getPerson" access="public" returnType="struct" output="false"&gt;
	&lt;cfset var s = {}&gt;
	&lt;cfset s.name = "Raymond"&gt;
	&lt;cfset s.age = "35"&gt;
	&lt;cfset s.suaveness = randRange(50,150)&gt;
	&lt;cfreturn s&gt;
&lt;/cffunction&gt;

&lt;cffunction name="remoteGetPerson" access="remote" returnType="any" returnFormat="plain" output="false"&gt;
	&lt;cfargument name="callback" type="string" required="false"&gt;
	&lt;cfset var data = getPerson()&gt;
	
	&lt;!--- serialize ---&gt;
	&lt;cfset data = serializeJSON(data)&gt;
	
	&lt;!--- wrap ---&gt;
	&lt;cfif structKeyExists(arguments, "callback")&gt;
		&lt;cfset data = arguments.callback & "(" & data & ")"&gt;
	&lt;/cfif&gt;
	
	&lt;cfreturn data&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

I've added a new method here, remoteGetPerson. Normally this would call an application scoped CFC, but in this case my method resides in the same file. I serialize the data and then - optionally - wrap it with the callback. Arguments.callback is expected to be a function named defined in your client side code. 

Notice that I hard coded the returnFormat. In the past I've recommended against that. I've said that the caller should request a format and the CFC method should be neutral - but in this case we are specifically building in support for JSON or JSONP. I made the padding optional - well - for no good reason I guess. I noticed Yahoo supports JSONP in their requests, but allows the callback function to be optional. Since JSON is just string data, it will work fine with returnFormat=plain.

So to test this, I wrote the following incredibly interesting demo:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script src="/jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script&gt;

function runTest() {
	var surl = 'http://www.raymondcamden.com/demos/jsonp/test.cfc?method=remoteGetPerson&callback=?'
	$.getJSON(surl, function(data) {
		var res = 'Name: '+data.NAME+'&lt;br/&gt;'
		res += 'Age: '+data.AGE+'&lt;br/&gt;'
		res += 'Suaveness: '+data.SUAVENESS
		if(data.SUAVENESS &gt; 100) res+=' (Rico-worthy)'
		res+='&lt;br/&gt;'
		$("#result").html(res)
	})
}

$(document).ready(function() {
	$("#testBtn").click(runTest)
});

&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
	&lt;input type="button" value="Test" id="testBtn"&gt;
	&lt;div id="result"&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

This is a simpler version of what I wrote for InsideRIA. I've added a simple button that, when clicked, runs a call to my CFC method. Now obviously this is in the same domain so JSONP is overkill, but in theory, folks could download the code (fix the jQuery reference - yes - I know I need to switch to Google CDN!) and still be able to run it.

Two quick notes:

1) I used jQuery in the example above, but you could use any other framework of your choosing. As long as you use jQuery. Kidding. (Not really.)

2) Using Firebug to test? (Of course you are!) I was surprised to find that these Ajax requests do not show up under XHR. I had forgotten that JSONP works by injecting script blocks into your page. Just switch to Net/All or Net/HTML and you can see the requests.