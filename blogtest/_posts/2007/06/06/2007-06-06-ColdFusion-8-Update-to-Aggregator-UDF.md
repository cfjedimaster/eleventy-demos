---
layout: post
title: "ColdFusion 8: Update to Aggregator UDF"
date: "2007-06-06T13:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/06/ColdFusion-8-Update-to-Aggregator-UDF
guid: 2094
---

I'm posting an update to the <a href="http://ray.camdenfamily.com/index.cfm/2007/6/5/ColdFusion-8-RSS-Aggregator-UDF">aggregator code</a> I blogged about yesterday. This update does a few things - and demonstrates a bug (I think) in CFTHREAD inside a UDF.

First off - I took the suggestion of using an array of feeds instead of a list in case your URL contains a comma. I also let you pass in one URL by itself. The code to handle this is relatively simple. I see if arguments.feeds is not an array. If it isn't, I create a new array and set the string as the first item. 

Secondly - the bug I mentioned above. If you call the UDF I wrote yesterday twice (or more), then you get an error stating that the thread named "thread_X" cannot be created twice. It was my understanding that a thread created inside a UDF was unique to the UDF. I've got a bug open with Adobe on this now. To fix this for now - I simply switched to threads named by UUID. 

Lastly, I added some basic error checking to the feed retrieval. If a feed URL is bad, or times out, then I return an empty query for that particular feed.

This will be posted to CFLib later in the week when I set up "CF8" as a supported platform. You can download the zip (which has the UDF and a few test calls) <a href="http://www.raymondcamden.com/downloads/agg.zip">here</a>.