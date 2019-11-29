---
layout: post
title: "FusionAnalytics Released (Finally!)"
date: "2011-10-24T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/10/24/FusionAnalytics-Released-Finally
guid: 4405
---

As the subject says, Intergral has finally released <a href="http://www.fusion-analytics.com/fa/">FusionAnalytics</a>. I've blogged/tweeted/etc about this product over the past few years. I'm not quite sure when they started talking about it. It feels like it's been years. That being said - FusionAnalytics is now available to the public and after a personal presentation by Darren Pywell last week I can say the wait has been more than worth it.

For folks wondering why they would need such a product when ColdFusion ships with a Server Monitor, the biggest selling point is that FusionAnalytics (FA) provides a <i>history</i> of your server. The Server Monitor is good for real time analysis, but most of us can't sit there and watch the tool all day. FA provides an <b>incredibly</b> detailed view of the history of your application over time. The amount of data this application surfaces and aggregates is invaluable. Seriously. How many of us can say, confidently, that our ColdFusion servers are better today then they were yesterday? Or how about last month? FA can do this - and more.

It looks like most of the wait was dedicated to improving the platform itself. FA is highly extensible. As an example, Darren mentioned how they had a client ask for a report that detailed metrics per remote IP address. This wasn't in the product itself. But by using the product's API he was able to whip up a report in one hour. This new report integrated itself into the product like it was there in the first place. 

One of the concerns I had earlier with the product was that it provided so much information it may overwhelm users. I'm happy to see that reports were added that go a long way to providing a high level view of the server in a way that's very accessible. The <a href="http://www.fusion-analytics.com/fa/tapreport.cfm">TAP Report</a> (Traffic, Availability, and Performance) is a great example of this. 

<img src="https://static.raymondcamden.com/images/tapscreen1_large.png" />

I love the simple grade, the simple arrows, and the quick tips on the side for direction. Reports like this are the critical piece I think have been missing from earlier builds of FA. Even better - since the FA platform is so easy to extend I've been told more reports will be forthcoming.

From a purely technical perspective, the application is worth downloading just to see how well they make use of Adobe AIR. The AIR client is one of the best designed I've seen yet. And as I mentioned earlier, the application itself is extensible via code. I don't think I've seen an AIR client that does that yet.

Any FA users out there care to comment on what their experience has been so far? I know I tend to be biased towards ColdFusion, but do engines like this exist for PHP, Ruby, .Net? I've never seen anything like this before - but obviously I don't pay much attention to those communities.