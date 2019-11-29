---
layout: post
title: "ColdFusion custom tag for layout example"
date: "2007-09-03T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/03/ColdFusion-custom-tag-for-layout-example
guid: 2321
---

Last week or so a reader asked if I would quickly demonstrate how I use custom tags for layout. This is something I've done for many years now and is typically how I how handle ensuring a web site can easily maintain a consistent look. The idea is simple - use the fact that custom tags can "wrap" other content. How is this done? Consider this code block:
<!--more-->
<code>
&lt;cf_bold&gt;When will the fall season start?&lt;/cf_bold&gt;
</code>

The custom tag, bold, is used at the beginning and the end of the text block. The last tag is used with a slash just like you see in normal HTML tags that wrap content. 

ColdFusion provides a ThisTag scope that provides information about the custom tag. In this case, it tells us if the tag is in a start or end mode. This is done via the executionMode value. So let's look at a layout custom tag. I call this my Pretty in Pink theme:

<code>
&lt;cfif thisTag.executionMode is "start"&gt;

&lt;html&gt;

&lt;head&gt;
&lt;title&gt;Test&lt;/title&gt;
&lt;/head&gt;

&lt;body bgcolor="#d95ff3"&gt;

&lt;cfelse&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;/cfif&gt;
</code>

The file is split in half with the CFIF statement. The first half runs when thisTag.executionMode is "start", and the second half will run when it is "end" (or any value really, but that's the only other value). So to use my layout tag, I can simply do this:

<code>
&lt;cf_layout&gt;
This is a test.
&lt;/cf_layout&gt;
</code>

Now typically my layout tags perform a bit more work. For example - they typically display a title as well. Consider this modified version:

<code>
&lt;cfparam name="attributes.title" default=""&gt;

&lt;cfif thisTag.executionMode is "start"&gt;

&lt;html&gt;

&lt;head&gt;
&lt;cfoutput&gt;&lt;title&gt;#attributes.title#&lt;/title&gt;&lt;/cfoutput&gt;
&lt;/head&gt;

&lt;body bgcolor="#d95ff3"&gt;

&lt;cfoutput&gt;&lt;h1 style="color: white;"&gt;#attributes.title#&lt;/h1&gt;&lt;/cfoutput&gt;

&lt;cfelse&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;/cfif&gt;
</code>

All I've done is defined a variable, attributes.title, and then I use that in both the head area and within an H1 tag. To use this attribute, I just change my files to do this:

<code>
&lt;cf_layout title="The 1980s are Superbad!"&gt;
This is a test.
&lt;/cf_layout&gt;
</code>

So that's it. Just a quick note - this can be useful in cases even when you use CSS for everything (markup and layout). Even in 100% pure CSS sites, you still need a head block, you still need to point to the CSS file, etc. So I'd still use the layout tag to get those items into the file.