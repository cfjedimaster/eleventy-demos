---
layout: post
title: "Using jQuery to post an array to a ColdFusion Component"
date: "2010-03-23T16:03:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2010/03/23/Using-jQuery-to-post-an-array-to-a-ColdFusion-Component
guid: 3761
---

A reader sent in an interesting question today. He was trying to make use of jQuery to post an array of data to a ColdFusion component. His CFC was expecting, and demanding, an array argument. Whenever he fired off the request though he received an error from ColdFusion saying the argument was not a valid array. Let's look at an example of this so it is more clear.
<!--more-->
<p/>
I'll start off with my server side component. It handles the incredibly complex task of returning the size of an array. 
<p/>
<code>
&lt;cfcomponent&gt;

&lt;cffunction name="handleArray" access="remote" returnType="numeric"&gt;
	&lt;cfargument name="data" type="array" required="true"&gt;
	&lt;cfreturn arrayLen(arguments.data)&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>
<p/>

On the client side, I'm going to use jQuery to post a static query to the CFC. This will happen immediately on document load so I don't have to bother clicking a button or anything fancy like that. (Note, in the code block below I've removed the html, head, and body tags since they are all empty. I do have a script block to load in the jQuery library though.)

<p/>

<code>
$(document).ready(function() {
	var mydata = [1,2,3,4,5,"Camden,Raymond"];
	$.post("test.cfc", {% raw %}{method:"handleArray",data:mydata, returnFormat:"plain"}{% endraw %}, function(res) {
		alert($.trim(res));
	})

})
</code>

<p/>

So, what would you expect to happen here? Well first off, it is important to remember that we are talking about an HTTP post here. You <i>cannot</i> send a complex data type of POST. It <i>must</i> be encoded somehow. jQuery does indeed encode the data - just not how you would expect it. Upon running this and examining the POST data in my Chrome dev tools, I see the following:

<p/>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-03-23 at 2.39.13 PM.png" title="POST Data" />

<p/>

Not what you expected, right? You can see why ColdFusion complained. The "Data" argument doesn't exist. Instead we have a lit of things named like Data, but not quite. You can try using toString on the array, but that doesn't correctly handle the comma in the data. So what to do?

<p/>

What I recommended was converting the array to JSON. It always surprises me when I remember that jQuery can't produce JSON on its own, but there are <a href="http://code.google.com/p/jquery-json/">plugins</a> out there that will do it it for you. Because JSON is a string format though I thought I'd write up a quick function to generate the string for me. This function makes the assumption that are array only contains simple values of numbers and strings. 

<p/>

<code>
$(document).ready(function() {
	var mydata = [1,2,3,4,5,"Camden,Raymond"];
	var myds = serialize(mydata)
	$.post("test.cfc", {% raw %}{method:"handleArray",data:mydata, returnFormat:"plain"}{% endraw %}, function(res) {
		alert($.trim(res));
	})

	function serialize(arr) {
		var s = "[";
		for(var i=0; i&lt;arr.length; i++) {
			if(typeof(arr[i]) == "string") s += '"' + arr[i] + '"'
			else s += arr[i]
			if(i+1 &lt; arr.length) s += ","
		}	
		s += "]"
		return s
	}
})
</code>

<p/>

As you can see, I wrote a serialize function to handle converting the array into a JSON-encoded array. This isn't the only change though. We still aren't sending an array to the CFC. It's a string. So I rewrote the CFC to handle it a bit better:

<p/>

<code>
&lt;cfcomponent&gt;

&lt;cffunction name="handleArray" access="remote" returnType="numeric"&gt;
	&lt;cfargument name="data" type="any" required="true"&gt;
	&lt;cfif isJSON(arguments.data)&gt;
		&lt;cfset arguments.data  = deserializeJSON(arguments.data)&gt;
	&lt;/cfif&gt;
	&lt;cfreturn arrayLen(arguments.data)&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

<p/>

I normally don't like to "muck" up my code so that it has outside knowledge like this. However, I'd probably have a remote service component in front of this component anyway and the whole issue would become moot. 

<p/>

There are probably <i>many</i> better ways of handling this. Any suggestions?