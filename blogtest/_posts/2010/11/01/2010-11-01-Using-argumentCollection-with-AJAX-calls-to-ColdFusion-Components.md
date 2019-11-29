---
layout: post
title: "Using argumentCollection with AJAX calls to ColdFusion Components"
date: "2010-11-01T23:11:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/11/01/Using-argumentCollection-with-AJAX-calls-to-ColdFusion-Components
guid: 3993
---

Wow, this is a cool tip. I've had this in my queue to write about for a few weeks now but I was delayed due to MAX. Credit for this goes to <a href="http://www.stephenduncanjr.com/">Stephen Duncan Jr</a> - I'm just passing it along - and to be honest - it kinda seems obvious now - but it's certainly not something I've thought of before. I've said it before - but I'll say it again. <b>I love my readers.</b> 

<p/>
<!--more-->
Back in March I <a href="http://www.raymondcamden.com/index.cfm/2010/3/23/Using-jQuery-to-post-an-array-to-a-ColdFusion-Component">blogged</a> about an interesting problem I ran into with jQuery and CFCs. This wasn't a jQuery specific issue, but as I use jQuery most of the time I ran into it there. I won't repeat the entire previous blog entry, but the basic problem was that there didn't seem to be a good way to post arrays of data to a back end CFC. jQuery <i>does</i> serialize the array, but it does it in a way that makes CFCs sad. My solution was to encode the array into JSON and update my CFC to accept either "real" arrays or JSON-encoded arrays. It worked... but I hated modifying my CFC.

<p/>

Fast forward a few months and a reader, Stephen Duncan JR, pointed out something interesting. If you read <a href="http://www.coldfusionjedi.com/index.cfm/2010/3/23/Using-jQuery-to-post-an-array-to-a-ColdFusion-Component#c50A94F70-B29E-4674-016EAA5DCF698706">his comment</a>, you will see he did something a bit different. Instead of simply passing data=json version of array, he passed a JSON-encoded version of a structure containing name-value pairs. He used the argumentCollection feature of CFCs.

<p/>

If this is the first time you've heard of argumentCollection, don't be surprised. It is documented but not used very often. It's based on an even older feature, attributeCollection, that is used in custom tags. argumentCollection allows you to pass a structure of names and values. ColdFusion will treat this as if they were <i>real</i> arguments and values. So consider a structure <b>data</b> that contains:

<p/>

name=ray<br/>
age=37<br/>
coolness=epic

<p/>

If you pass argumentCollection=data to a CFC method (or any UDF), then ColdFusion acts as if you had passed arguments name, age, and coolness. As I said above, this isn't new at all, but I've never seen it used with an AJAX post like this. What's nice then is that on the server side, you can have a "proper" method without any if/else statement to see if the result was JSON. As a quick example, here is an updated version of the front end code based on the previous example. I went ahead and added <a href="http://code.google.com/p/jquery-json/">jquery-json</a> to the template to further simplify things.

<p/>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jquery.json.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {
	var mydata = {% raw %}{data:[1,2,3,4,5,"Camden,Raymond"]}{% endraw %};

	$.post("test.cfc", {% raw %}{method:"handleArray",argumentCollection:$.toJSON(mydata), returnFormat:"plain"}{% endraw %}, function(res) {
		alert($.trim(res));
	})

});

&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

And as I said before, the back end CFC is now nice and simple:

<p>

<code>
&lt;cfcomponent&gt;

&lt;cffunction name="handleArray" access="remote" returnType="numeric"&gt;
	&lt;cfargument name="data" type="array" required="true"&gt;
	&lt;cfreturn arrayLen(arguments.data)&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>