---
layout: post
title: "Example of M3U Support for CFMEDIAPLAYER"
date: "2012-08-27T12:08:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2012/08/27/Example-of-M3U-Support-for-CFMEDIAPLAYER
guid: 4715
---

A while ago I wrote a <a href="http://www.raymondcamden.com/index.cfm/2010/5/5/Ask-a-Jedi-Dynamic-Updates-for-CFMEDIAPLAYER#cB729CB90-0C41-C755-EECC911AF3B0524E">blog entry</a> that discussed how to add a playlist to a CFMEDIAPLAYER tag. The idea was simple. Given a query - turn it into a grid control that could then drive the content for the media player control. Misty posted a <a href="http://www.raymondcamden.com/index.cfm/2010/5/5/Ask-a-Jedi-Dynamic-Updates-for-CFMEDIAPLAYER#cD652B26E-AE66-68FC-1252D60CCED471F1">comment</a> about M3U support so I thought I'd write up a quick example.

For those who don't know, a M3U file (<a href="http://en.wikipedia.org/wiki/M3U">Wikipedia Entry</a>) is simply a text file that represents a playlist. I've normally seen this used for MP3 collections, but it can really be used for any type of media. 

Since it is just a text file, it would be trivial to update the old example to take its data from a file instead. First, let's build a simple M3U file.

<script src="https://gist.github.com/3489503.js?file=source.m3u"></script>

I'm using the same URLs from before. Note the use of #-prefixed lines as comments. I need to ensure we ignore those lines when parsing in the data. Let's look at that code:

<script src="https://gist.github.com/3489517.js?file=gistfile1.cfm"></script>

I begin by reading in the file and then splitting it into an array. Using the new ColdFusion 10 arrayFilter function, I can quickly remove the comment lines. I create a new query object and then loop through each line and add it to the data. My titles are just numerical but could be specified in some other manner. Also note that I could have skipped the filter entirely and just used arrayEach. That would have made the code a bit slimmer. 

That's it. The end result is a query object with URLs based on the M3U file. I've pasted the entire template before. 

<b>Note:</b> In ColdFusion 9, the JavaScript API for working with a media player on the page was: ColdFusion.Mediaplayer. In ColdFusion 10, the API is now: ColdFusion.MediaPlayer. Note the capital P. The docs have this wrong. (I posted a comment to the online version.) With JavaScript being case-sensitive, this is an important thing to remember. 

<script src="https://gist.github.com/3489543.js?file=gistfile1.cfm"></script>