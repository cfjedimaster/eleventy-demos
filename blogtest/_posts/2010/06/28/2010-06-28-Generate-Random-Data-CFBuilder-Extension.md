---
layout: post
title: "Generate Random Data CFBuilder Extension"
date: "2010-06-28T14:06:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/06/28/Generate-Random-Data-CFBuilder-Extension
guid: 3861
---

I just released (at RIAForge naturally: <a href="http://randomdatagenerator.riaforge.org/">http://randomdatagenerator.riaforge.org/</a>) a new ColdFusion Builder Extension: Generate Random Data. The idea behind the extension is simple. Many times I have need of a ColdFusion query, but don't have the actual data itself. I may be building a service component, or perhaps writing a simple test for a blog entry. I typically do something like so:

<p/>
<!--more-->
<code>
&lt;cfset q = queryNew("id,name")&gt;
&lt;cfloop index="x" from="1" to="10"&gt;
  &lt;cfset queryAddRow(q)&gt;
  &lt;cfset querySetCell(q, "id", x)&gt;
  &lt;cfset querySetCell(q, "name", "Random X")&gt;
&lt;/cfloop&gt;
</code>

<p>

And while this "works", I had a hunch ColdFusion Builder would allow me to do it even quicker. With that idea in mind, I quickly whipped up the following extension. Click the image below to watch a quick video:

<p>

<a href="http://www.raymondcamden.com/images/genrandomdata.swf"><img src="https://static.raymondcamden.com/images/cfjedi/genrandomdata.png" title="Gen Random Data" border="0"  /></a>

<p>

The extension makes use of both jQuery and the jQuery Validation library. Right now it's pretty simple. You can generate queries with random names, random numbers, random values from a list, and random booleans. If folks have ideas on how to extend this, just file an enhancement request at the RIAForge project. 

<p>

So.... useful?