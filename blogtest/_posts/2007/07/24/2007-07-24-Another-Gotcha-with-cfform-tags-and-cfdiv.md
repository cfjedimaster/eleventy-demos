---
layout: post
title: "Another \"Gotcha\" with cfform tags and cfdiv"
date: "2007-07-24T13:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/24/Another-Gotcha-with-cfform-tags-and-cfdiv
guid: 2215
---

Here is another "Gotcha" you want to watch out for. Some of this applies to ColdFusion 7 and earlier while obviously the cfdiv reference is for ColdFusion 8 only.

A friend pinged me a few days asking why her cfdiv tag wasn't working. Turns out she had written something like this:

<code>
&lt;cfdiv source="foo.cfm" /&gt;
</code>

When viewing the result, she noticed that the contents of foo.cfm were not being loaded in the browser. Turns out she had forgotten that cfdiv, like most of the cfform based tags, will automatically pass any unknown variable over into the HTML.

This is a feature, not a bug. And I mean that. Consider the simple cfinput tag. If tomorrow Microsoft decided to add a new attribute to the HTML input tag tag, how would you use it with cfinput? All you need to do is add it to your cfinput tag like so:

<code>
&lt;cfinput type="text" name="username" spam="true"&gt;
</code>

ColdFusion will ignore the spam attribute except when it actually renders the input tag. Then it will simply be passed into the HTML. 

One way to see if you are falling victim to this is to simply view source. If you did that on cfdiv code above, you would see:

<code>
&lt;div id="cf_div1185294152796" source="foo.cfm"&gt;&lt;/div&gt;
</code>

A mistake I tend to make with suggestions is:

<code>
&lt;cfinput name="foo" autusuggest="..." &gt;
</code>

Notice the typo?