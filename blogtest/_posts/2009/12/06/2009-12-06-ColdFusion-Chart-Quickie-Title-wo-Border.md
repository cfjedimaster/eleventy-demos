---
layout: post
title: "ColdFusion Chart Quickie - Title w/o Border"
date: "2009-12-06T19:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/06/ColdFusion-Chart-Quickie-Title-wo-Border
guid: 3633
---

From a reader:

<blockquote>
How do I hide the box/border surrounding the title in a cfchart?  Can that be done with attributes or does it need to pull from an xml style file?  The showBorder="yes"/"no"...doesn't seem to have any affect?
</blockquote>

Correct - showBorder is for the chart as a whole. And like (almost) always - the chart editor comes to the rescue. Click the Title value in the chart editor opens up a sub editor with a butt load of options for the title:

<img src="https://static.raymondcamden.com/images/Picture 194.png" />

Notice the style attribute on the right? That handles the border around the title. You can set it to a variety of different styles or just select "None" to get rid of it. The generated XML is:

<code>
&lt;title&gt;
&lt;decoration style="None"/&gt;Poop
&lt;/title&gt;
</code>

You can also play with the other styles and tweak the color too if you want.

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 264.png" />