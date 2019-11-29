---
layout: post
title: "Two quickies - Cache Clearer Admin Extension and CFCHART Doc Typo"
date: "2009-04-03T00:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/02/Two-quickies-Cache-Clearer-Admin-Extension-and-CFCHART-Doc-Typo
guid: 3303
---

Two quick notes. First, the Cache Clearer code I released a long, long time ago (it uses the ColdFusion 8 Admin API to refresh items from the file cache) has been released as a 'formal' RIAForge project: <a href="http://cacheclearer.riaforge.org">http://cacheclearer.riaforge.org</a> I added some user submitted updates, wrote a quick readme file, and packaged it up. 

Second - a user asked me why the markerStyle "letter" would not work in a chart:

<code>
&lt;cfchart&gt;
       &lt;cfchartseries  type="line" seriesColor="##FF0099"
markerStyle="letter"&gt;
               &lt;cfchartdata item="col1" value="20"&gt;
               &lt;cfchartdata item="col2" value="30"&gt;
               &lt;cfchartdata item="col3" value="40"&gt;
               &lt;cfchartdata item="col4" value="50"&gt;
               &lt;cfchartdata item="col5" value="60"&gt;
       &lt;/cfchartseries&gt;
&lt;/cfchart&gt;
</code>

I checked the docs and nothing seemed wrong there. Running the code returned this error though: Marker style not supported: letter 

I opened up the chart editor and noticed it listed letterx, not letter, as a marker style. Sure enough - adding "x" to the marker style fixed the issue.

<img src="https://static.raymondcamden.com/images//Picture 149.png">

I bumped up markerSize on the cfchart tag to make the markers more obvious.