---
layout: post
title: "Ask a Jedi: UDFs in Custom Tags"
date: "2008-10-07T18:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/07/Ask-a-Jedi-UDFs-in-Custom-Tags
guid: 3047
---

Nathan asks:

<blockquote>
<p>
Can you define UDFs inside of CustomTags? I have some repetitive processing I need to do inside of a custom tag and was wondering if this is a valid approach? If so is the UDF local to the custom tag?
</p>
</blockquote>

Yes, you can. Here is a simple example:
<!--more-->
First we will start with the custom tag, which I've given the descriptive name of test3.cfm:

<code>
&lt;cfscript&gt;
function getNum() {
	return randRange(1,100);
}
&lt;/cfscript&gt;

&lt;cfparam name="attributes.r_result" default="result" type="variableName"&gt;

&lt;cfset result = getNum()*getNum()*getNum()&gt;

&lt;cfset caller[attributes.r_result] = result&gt;

&lt;cfexit method="exitTag"&gt;
</code>

As you can see, I have a UDF named getNum(). The custom tag uses this to create a result. Now my calling script can simply do:

<code>
&lt;cf_test3 r_result="res" /&gt;

&lt;cfoutput&gt;res=#res#&lt;/cfoutput&gt;
</code>

The UDF does <i>not</i> leak out in the calling page. Just like any other variable defined in the custom tag, it is local to the custom tag only.

In older versions of ColdFusion, I believe the original CF5, you would get an error if you called your custom tag in wrapped more, or with a / at the end of the call. This has been fixed for some time now though.

So the question is - while it works, does it make sense? I would tend to shy away from putting the UDF in the custom tag. It seems like every time I write a function that I'm sure will only be used in one place, I end up needing it a few other places as well. Outside of that though I can't think of any good technical reason not to do this if you feel like you need it.