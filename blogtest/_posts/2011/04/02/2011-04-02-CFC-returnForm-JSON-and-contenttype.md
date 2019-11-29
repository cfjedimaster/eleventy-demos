---
layout: post
title: "CFC, returnForm, JSON, and content-type"
date: "2011-04-02T13:04:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2011/04/02/CFC-returnForm-JSON-and-contenttype
guid: 4181
---

I could have sworn that in ColdFusion 9, when asking a CFC to return JSON data with returnFormat=json, that ColdFusion used a response type of application/json. However, it looks like this is not the case. Maybe this behavior changed or maybe I just assumed wrong, but I'm definitely seeing an incorrect content type. Here is a quick example and a possible fix.
<!--more-->
<p>

First, a simple CFC with two remote methods:

<p>

<code>
component {

	remote function getone() {

		return 1;
	}

	remote function gettwo() {

		return 2;
	}

}
</code>

<p>

And then a quick front end client for it:

<p>

<code>
&lt;cfajaxproxy cfc="test" jsclassname="theproxy"&gt;
&lt;script&gt;

var foo = new theproxy();
var result = foo.getone();
alert(result);
var result = foo.gettwo();
alert(result);
&lt;/script&gt;
</code>

<p>

When I check the response types in Chrome, I see...

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip70.png" />

<p>

So, in my particular case, I had a core CFC that my remote CFCs extended. I was able to add this to the constructor area and it worked fine:

<p>

<code>
&lt;cfcontent type="application/json"&gt;
</code>

<p>

It just so happened that my base CFC was tag based so that worked ok. So what about script? This code works fine:

<p>

<code>
response = getPageContext().getResponse();
response.setContentType("application/json");
</code>

<p>

But oddly, when placed in the constructor area of my CFC above, it made <i>everything</i> use that content type, ie both the CFM and the CFC. That seemed odd. I'm assuming cfajaxproxy actually <i>ran</i> the CFC when creating the proxy. This seems to be an issue with cfajaxproxy only though. I changed my front end to a simple jQuery version and it worked fine. Here is my front end now and the CFC after.

<p>

<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$.get("test.cfc?method=getone&returnformat=json",{}, function(res) {
		alert(res);
	},"json");
})
&lt;/script&gt;
</code>

<p>

<code>
component {

	response = getPageContext().getResponse();
	response.setContentType("application/json");

	remote function getone() {

		return 1;
	}

	remote function gettwo() {

		return 2;
	}

}
</code>

<p>

One last tip. This is something I learned from Mark Drew a long time ago. Don't forget that CFCs can also use the constructor area to preselect a method returnformat. So in the CFC above, I can also do:

<p>

<code>
url.returnformat="json";
</code>

<p>

What's nice then is that people calling my CFC don't have to bother specifying it.