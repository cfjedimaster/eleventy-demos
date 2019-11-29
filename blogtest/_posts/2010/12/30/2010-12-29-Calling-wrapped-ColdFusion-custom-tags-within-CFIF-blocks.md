---
layout: post
title: "Calling wrapped ColdFusion custom tags within CFIF blocks"
date: "2010-12-30T10:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/12/30/Calling-wrapped-ColdFusion-custom-tags-within-CFIF-blocks
guid: 4067
---

That isn't the best title in the world but hopefully an example will help. Yesterday Simon Free encountered an interesting problem with wrapped custom tags. For folks who don't know what I mean, a wrapped custom tag is simply a custom tag that wraps something. So for example, consider the following code.
<!--more-->
<p>
<code>
&lt;cf_bold&gt;This is overkill.&lt;/cf_bold&gt;
</code>

<p>

The bold custom tag is running both at the beginning and end of the string. ColdFusion tells you in what 'mode' it is being run. Here is what bold.cfm looks like:

<p>

<code>
&lt;cfif thisTag.executionMode is "start"&gt;
	&lt;b&gt;
&lt;cfelse&gt;
	&lt;/b&gt;
&lt;/cfif&gt;
</code>

<p>

The ThisTag scope is a special scope you can use within custom tags. In my tag above I use the built in exectionMode variable to tell how the tag is running. Now let's thrown a wrench in the works. Consider a more advanced "fancy" bold tag. It may look like this:

<p>

<code>
&lt;cfif thisTag.executionMode is "start"&gt;
	&lt;span style="font-size:20px;color:red"&gt;
	&lt;cf_bold&gt;
&lt;cfelse&gt;
	&lt;/cf_bold&gt;
	&lt;/span&gt;
&lt;/cfif&gt;
</code>

<p>

As you can see, I've wrapped a call to my bold tag and added some special CSS as well. However, when I run this I get:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip5.png" />

<p>

ColdFusion doesn't like the opening and closing of the tags in different parts of the CFIF. So how can you solve this? It's a bit of a hack, but you can simply create a way to override the tag's execution mode. Consider this new version of bold.cfm:

<p>

<code>
&lt;cfparam name="attributes.executionMode" default="#thisTag.executionMode#"&gt;

&lt;cfif attributes.executionMode is "start"&gt;
	&lt;b&gt;
&lt;cfelse&gt;
	&lt;/b&gt;
&lt;/cfif&gt;
</code>

<p>

All I've done here is switch to using an attribute called executionMode. It defaults to the thisTag version which means I can still use my simple wraps. But what about fancybold.cfm? I just changed it to this:

<p>

<code>
&lt;cfif thisTag.executionMode is "start"&gt;
	&lt;span style="font-size:20px;color:red"&gt;
	&lt;cf_bold executionMode="start"&gt;
&lt;cfelse&gt;
	&lt;cf_bold executionMode="end"&gt;
	&lt;/span&gt;
&lt;/cfif&gt;
</code>

<p>

As you can see, I now specify how the bold tag is run. A bit icky, but then again, it's hidden away in the custom tag. To the outside world it's still pretty easy:

<p>

<code>
&lt;cf_fancybold&gt;This is overkill.&lt;/cf_fancybold&gt;
</code>