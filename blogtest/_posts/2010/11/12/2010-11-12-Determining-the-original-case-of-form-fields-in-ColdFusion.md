---
layout: post
title: "Determining the original case of form fields in ColdFusion"
date: "2010-11-12T22:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/11/12/Determining-the-original-case-of-form-fields-in-ColdFusion
guid: 4012
---

This question came over Twitter today so I thought I'd address it in a blog. User @brooksfolk asked if there was a way to get the original form field names sent to a ColdFusion file. When you look at form.fieldnames, or just cfdump the Form scope, the values are always uppercased. Consider the following simple form.
<!--more-->
<p>

<code>
&lt;form method="post"&gt;
&lt;input type="text" name="naMe"&gt;&lt;br/&gt;
&lt;input type="text" name="AGE"&gt;&lt;br/&gt;
&lt;input type="text" name="foo"&gt;&lt;br/&gt;
&lt;input type="submit"&gt;
&lt;/form&gt;

&lt;cfdump var="#form#"&gt;
</code>

<p>

As you can see, each of my three fields uses a different mixture of upper and lower case names. But when I view the dump, I see this:

<p>

<img src="https://static.raymondcamden.com/images/screen43.png" />

<p>

As you can see, everything is now uppercase. I had a hunch though that <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7c11.html">getHTTPRequestData</a> might have the "real" data and indeed it does. Here is what a dump of that function shows:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/screen44.png" />

<p>

Woot - as you can see - both the original form field names and values (which are blank in this case since I didn't bother to type anything in) are in the content key. If I actually type some values in, I get a more realistic version: naMe=cat+man&AGE=moo&foo=mooooo. This looks easy enough to parse. Here is what I came up with:

<p>

<code>
&lt;cfset content = getHTTPRequestData().content&gt;
&lt;cfset formMoreGooder = {}&gt;
&lt;cfloop index="pair" list="#content#" delimiters="&"&gt;
	&lt;cfset name = listFirst(pair, "=")&gt;
	&lt;cfset value = urlDecode(listLast(pair, "="))&gt;
	&lt;cfset formMoreGooder[name] = value&gt;
&lt;/cfloop&gt;
</code>

<p>

Basically I just treat the data as 2 sets of lists. Each pair is delimited by an ampersand and then each pair itself is split by the equal sign. The values are url encoded but luckily ColdFusion provides a way to reverse that. And here is the result...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/screen46.png" />
<p>

Hope this is helpful to someone.