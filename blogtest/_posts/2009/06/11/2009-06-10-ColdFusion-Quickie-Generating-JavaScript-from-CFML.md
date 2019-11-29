---
layout: post
title: "ColdFusion Quickie - Generating JavaScript from CFML"
date: "2009-06-11T10:06:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2009/06/11/ColdFusion-Quickie-Generating-JavaScript-from-CFML
guid: 3391
---

Have you ever wondered how you could create JavaScript data from ColdFusion? Now before you say anything, I'm not talking about AJAX. While using AJAX to load data into the client is probably the most often used way to do this, it certainly isn't the only way. Consider the following example.
<!--more-->
<code>
&lt;cfset string= "Lindsey Lohan is a Cylon."&gt;

&lt;html&gt;

&lt;head&gt;
&lt;cfoutput&gt;
&lt;script&gt;
var data = '#string#'
alert(data)
&lt;/script&gt;
&lt;/cfoutput&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;h1&gt;Demo&lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

I've got a CFML variable, string, that I output within a script block. Because I'm working with a string, I surround the variable with single quotes. Double quotes would have worked as well. When run in the browser, the alert displays:

<img src="https://static.raymondcamden.com/images//Picture 162.png">

Woot. Nice and simple. Until someone goes and screws things up:

<code>
&lt;cfset string= "Ray's neck is hurting today."&gt;
</code>

This generates:

<code>
&lt;script&gt;
var data = 'Ray's neck is hurting today.'
alert(data)
&lt;/script&gt;
</code>

Ouch. Obviously you could just wrap the output in double quotes, but if my ColdFusion variable had both single and double quotes, I'm screwed. We could use the jsStringFormat function. 

<code>
&lt;cfset string= "Ray's neck is hurting today. He said, ""I need to take some pills."""&gt;

&lt;html&gt;

&lt;head&gt;
&lt;cfoutput&gt;
&lt;script&gt;
var data = '#jsStringFormat(string)#'
alert(data)
&lt;/script&gt;
&lt;/cfoutput&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;h1&gt;Demo&lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

Notice now my string has both single and double quotes embedded in the variable. The jsStringFormat function handles it perfect. Here is how it outputs the variable:

<code>
var data = 'Ray\'s neck is hurting today. He said, \"I need to take some pill.\"'
</code>

Again, I say woot. But that's just a string. How would you convert an entire ColdFusion query into a JavaScript variable? Or an array? Or a struct? How about a struct that contains an array that contains a query that... err you get the idea. Let's take a look at a ridiculous example:

<code>
&lt;cfset addresses = []&gt;
&lt;cfset addresses[1] = "403 Robinhood Circle, Lafayette, LA, 70508"&gt;
&lt;cfset addresses[2] = "1801 Kaliste Saloom Rd, Lafayette"&gt;
&lt;cfset addresses[3] = "400 Camellia Blvd, Lafayette, LA 70503"&gt;

&lt;!--- Set of long/lats ---&gt;
&lt;cfset longlats = []&gt;
&lt;cfset longlats[1] = {% raw %}{lat=30.09,long=-91.9}{% endraw %}&gt;
&lt;cfset longlats[2] = {% raw %}{lat=30.08,long=-91.84}{% endraw %}&gt;
</code>

The code above generates an array of addresses, then an array of structures. ColdFusion provides us nice functions to introspect both arrays and structs (how do you think CFDUMP works?) so we could do this by hand, but luckily there is an even simpler solution: toScript. At it's simplest usage example, you provide it the data and the name of a JavaScript variable to create.

<code>
&lt;cfoutput&gt;
&lt;script&gt;
var #toScript(addresses,"addressesToPlot")#
var #toScript(longlats,"locations")#
&lt;/script&gt;
&lt;/cfoutput&gt;

Which outputs:

&lt;code&gt;
&lt;script&gt;
var addressesToPlot =  new Array();
addressesToPlot[0] = "403 Robinhood Circle, Lafayette, LA, 70508";
addressesToPlot[1] = "1801 Kaliste Saloom Rd, Lafayette";
addressesToPlot[2] = "400 Camellia Blvd, Lafayette, LA 70503";

var locations =  new Array();
locations[0] = new Object();
locations[0]["lat"] = "30.09";
locations[0]["long"] = -91.9;
locations[1] = new Object();
locations[1]["lat"] = "30.08";
locations[1]["long"] = -91.84;

&lt;/script&gt;
</code>

Nice and simple, right? The docs mention that it supports strings, numbers, arrays, structs, and queries, but not CFCs. That's only partially true. You can pass a CFC to toScript, but it outputs broken code. This is what I got when I passed a CFC with two methods:

<code>
var apple = new Object();
apple["getfoo"] = apple["getentries"] = 
</code>

It looks like it got the methods but didn't know what to do with them. Either way, hope this is useful.