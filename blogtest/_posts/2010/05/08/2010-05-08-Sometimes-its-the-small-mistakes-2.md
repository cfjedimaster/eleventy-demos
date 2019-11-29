---
layout: post
title: "Sometimes it's the small mistakes... (2)"
date: "2010-05-08T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/05/08/Sometimes-its-the-small-mistakes-2
guid: 3810
---

For a few days now the <a href="http://groups.adobe.com">Adobe Groups</a> site has been suffering with an odd issue. It would run as fast as normal, never throwing any odd error, and then would come to a screaming halt. Requests for the CF Admin worked fine but any request for the actual site returned a 503 after a long delay. I assumed it was a load issue and contacted the absolute master of ColdFusion and High Availability, <a href="http://www.go2ria.com/">Mike Brunt</a>. From time to time I get pinged for side work, jobs, etc. Any time that request is for something involving load, performance testing, or stability, I always recommend Mike. He is both an expert and an all around good guy, so please consider his services if you have a need! Mike's direction is directly responsible for what I found last night, so I cannot thank him enough. (And let me add that we are still digging into this so there may be more to this then what I blog today.)

I was using the excellent Server Monitor that ships with ColdFusion to watch both machines in my cluster. I noticed a set of requests that were <i>extremely</i> long lived. Groups being a Model-Glue site, most of the requests simply showed up as index.cfm. However, do not forget you can double click on a request to get more information. Here is an example - and as a quick aside - this is one of the "bad" requests before I pushed my fix. (And note I blurred the path and the URL variable.)

<img src="https://static.raymondcamden.com/images/reqshot.png" title="Request" />

Notice that in the detail, I've got my URL parameters. When I ran the same URL on the site I noticed it was completely unresponsive. I did a quick database export/import to my local machine (and once again, I love how easy MySQL makes that), and noticed that on my local environment, I got a visible error. So the question was - why did production hang for the url and development not?

I began to dig into the part of the request that was throwing an error. It made use of CFFEED to parse a RSS url. I looked at the data and entered the URL manually. Bam. I was prompted to authenticate. Ok, so we don't support authenticated RSS feeds. But we do support handling errors. So what's the problem? On a whim I decided to try a poor man's load test. This is a dumb test, don't repeat it, but I was just curious. I hit reload on my dev machine about 30-40 times very quickly. My CPU spiked and I ended up with a 503. 

Wow.

This is when I discovered a critical flaw. My code to handle RSS feeds performed a cache based on URL. That way if N people wanted the same feed, they would share the same cache. RSS feeds don't change very often so there is certainly no need to refetch them for every request. However - while I checked to see if a URL was valid, I didn't handle a non-RSS feed properly. At a high level, if the RSS feed was bad, I did handle the error. But I didn't have a granular catch of the error at that level. So I added some quick logic to notice these errors, and here's the big change - I cached that as well. If URL X is invalid, there is no need to keep rerunning a HTTP request to grab the data. It is certainly possible that X will become valid again - and our cache will handle that fine since we only cache for 30 minutes. 

So to summarize my mistake here - I had the forethought of caching the HTTP results when the results were good, but not when they were bad. This meant I was still issuing a large number of HTTP requests when I didn't really need to. The error never really got to me since I had error handling at a higher level. 

I hope this makes sense, and if not, let me know. And as always, I hope my painful mistakes help others. ;)