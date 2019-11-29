---
layout: post
title: "Dynamic arguments and attributes in ColdFusion"
date: "2007-05-14T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/14/Dynamic-arguments-and-attributes-in-ColdFusion
guid: 2030
---

One of the announced features for ColdFusion 8 is support for dynamically passing attributes to ColdFusion tags. This will be a godsend for tags like CFMAIL. A reader asked me (and by the way, folks, don't ask me about Scorpio, in general I can't answer) if this support carried over to cfmodule and custom tags.
<!--more-->
This is actually something that has been supported in ColdFusion for quite some time. I don't have the exact version it was added to ColdFusion, but custom tags have had support for 'attributeCollection' for a while. Consider this simple custom tag:

<code>
&lt;cfdump var="#attributes#" label="In the tag"&gt;
</code>

If you first run it like so:

<code>
&lt;cf_customtag name="ray" age="34"&gt;
</code>

You will see a struct with 2 keys, name and age. However, you can get the same result like so:

<code>
&lt;cfset s = structNew()&gt;
&lt;cfset s.name = "ray"&gt;
&lt;cfset s.age = 34&gt;
&lt;cf_customtag attributeCollection="#s#"&gt;
</code>

At the same time, ColdFusion UDFs support an argumentCollection value. Consider this example:

<code>
&lt;cffunction name="mirrorargs"&gt;
	&lt;cfreturn arguments&gt;
&lt;/cffunction&gt;

&lt;cfset result = mirrorargs(name='ray',age=34)&gt;
&lt;cfdump var="#result#"&gt;
</code>

This returns a structure much like the custom tag example. Now imagine we call it like so:

<code>
&lt;cfset s = structNew()&gt;
&lt;cfset s.name = "ray"&gt;
&lt;cfset s.age = 34&gt;
&lt;cfset result=mirrorargs(argumentCollection=s)&gt;
&lt;cfdump var="#result#" label="Result using argumentcollection"&gt;
</code>

This will return the same structure as well. (Although to be clear - the case of the structs keys is different, but you should not be relying on struct key case anyway.)