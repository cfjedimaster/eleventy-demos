---
layout: post
title: "Ask a Jedi: Another Chart Question"
date: "2008-02-15T10:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/15/Ask-a-Jedi-Another-Chart-Question
guid: 2653
---

Woohoo! I love these chart questions. I guess I'm a chart geek. Randy asks:
<p>
<blockquote>
<p>
Is there a way for the bottom labels on a cfchart to show vertically on the graph instead of horizontal.
</p>
</blockquote>
<p>

I bet folks know what I'm going to say. Once again, the built in chart editor comes in handy. This one was pretty simple - I just changed the XAxis/Style/Label/Orientation setting to Vertical. I grabbed the XML and edited it like so:
<p>

<code>
&lt;frameChart&gt;
&lt;xAxis&gt;
&lt;labelStyle orientation="Vertical"/&gt;
&lt;/xAxis&gt;
&lt;/frameChart&gt;		
</code>
<p>

Passing this to my chart resulted in the following:
<p>

<img src="https://static.raymondcamden.com/images/Picture 26.png">
<p>

And for comparison's sake, here is horizontal:
<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 33.png">
<p>

You also have options for Slanted and Parallel. Parallel looked mostly like Horizontal, but here is an example of Slanted:
<p>

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 42.png">