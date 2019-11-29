---
layout: post
title: "Saving images from an RSS feed with ColdFusion"
date: "2011-06-06T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/06/Saving-images-from-an-RSS-feed-with-ColdFusion
guid: 4258
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2011/6/5/ColdFusion-Sample--Reading-a-RSS-Feed">blogged</a> a simple example of using ColdFusion's RSS parsing feature with the cffeed tag. One of the readers who commented on the story mentioned that he was interested in using cffeed to parse an RSS feed from the National Geographic. What made this feed a bit different is that it was specifically for pictures. He wanted to take those pictures and download them. What follows is a simple template that does just that. (I'll warn folks now though - I did not check what NG's requiresment were for copyright notices. You will want to do that if you make use of this code.)
<!--more-->
<p>

<code>
&lt;cfset rssUrl = "http://feeds.nationalgeographic.com/ng/photography/photo-of-the-day/"&gt;

&lt;cffeed action="read" source="#rssUrl#" query="entries"&gt;

&lt;cfset dir = expandPath("./ngg")&gt;
&lt;cfif not directoryExists(dir)&gt;
	&lt;cfdirectory action="create" directory="#dir#"&gt;
&lt;/cfif&gt;

&lt;cfloop query="entries"&gt;
	&lt;cfset localfile = listLast(linkhref,"/")&gt;
	&lt;cfoutput&gt;checking #localfile#... &lt;/cfoutput&gt;
	&lt;cfif not fileExists(dir & "/" & localfile)&gt;
		&lt;cfhttp method="get" getAsBinary="yes" url="#linkhref#" path="#dir#" file="#localfile#"&gt;
		downloading!&lt;br/&gt;
	&lt;cfelse&gt;
		skipped&lt;br/&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;

Done.
</code>

<p>

The first two lines of code are pretty similar to what I used yesterday. I got rid of the properties attribute since I don't need the metadata from the feed. I'm going to store the images in a subdirectory called ngg, so you can see the simple check I use there to ensure it actually exists. Now for the fun part.

<p>

As I loop through the RSS feed, I make use of the linkhref column for the image url. This is where NG stores the path to their image. I get just the filename from that and see if I have a copy already. If not, I just use cfhttp to fetch it down. And that's it. Really. Here's a quick screen shot from my local directory after running this once.

<p>



<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip108.png" />