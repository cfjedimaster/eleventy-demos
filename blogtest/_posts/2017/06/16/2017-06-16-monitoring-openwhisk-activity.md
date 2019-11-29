---
layout: post
title: "Monitoring OpenWhisk Activity"
date: "2017-06-16T08:44:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/06/16/monitoring-openwhisk-activity
---

I've mentioned a few times already that I was going to discuss what monitoring is like with [OpenWhisk](https://www.ibm.com/cloud-computing/bluemix/openwhisk) and I thought today would be a good day to finally write down my thoughts. In general, this is an area where I think OpenWhisk could use some improvement, and I'll point out where and how, but let's go over the details first.

Broadly, there's two ways to monitor your OpenWhisk activity - via the UI or via the CLI. The UI, available at https://console.bluemix.net/openwhisk/dashboard, loads a basic status screen that looks like so:

<img src="https://static.raymondcamden.com/images/2017/6/monitor1.jpg" class="imgborder">

That's pretty big, so let's break it down a bit into each component. First and foremost, you probably want to consider filtering. 

<img src="https://static.raymondcamden.com/images/2017/6/monitor2.png" class="imgborder">

The right most option is self-explanatory, but the drop downs may be a bit confusing. The "Time Frame" drop down lets you select the most recent 50, 100, or 200 activations. The "Limit to" drop down selects an action. <b>However - the actions you see are based on the Time Frame limit.</b> This is important and really confused me at first. That means if your action isn't in the past 50 activations, you won't see it. And if it isn't the past 200, you won't see it at all. It's likely that triggers will be the most "noisy" of your activations so using that filter may be a way to resolve the problem, but if your account is "busy", you may not be able to get a report at all for your action. (However the CLI has a way around this.) 

Now let's look at the "Activity Summary":

<img src="https://static.raymondcamden.com/images/2017/6/monitor3.jpg" class="imgborder">

Note that the labels you see will be based on the data. That's... kinda obvious. What I mean is - notice how the "pathTest" bare makes it clear that the numbers at the end are averages. I didn't notice that, and if all my bars had been long, I would not have known. I would have guessed that, but I also would have thought that maybe it was the "last invocation" duration. I've filed a bug report on this to make it more obvious somehow. Speaking of labels, the red items on the left represent errors, which is sensible, but you won't always see numbers. If you mouseover and a wait a sec, a label will show up giving you the exact value.

Note that "dotweet" is a problem. I can see right away that it's something I may need to look into. It's also my most complex OpenWhisk usage. (It drives [Serverless Superman](https://www.raymondcamden.com/2017/05/19/building-the-serverless-superman/). 

Let's switch to the "Activity Log":

<img src="https://static.raymondcamden.com/images/2017/6/monitor4.jpg" class="imgborder">

This gives you a more "log" like view of your recent activity along with a snippet of the result. The activation IDs in small text are clickable, and if you click, you can see the full activation report. I've shared that before, but as a reminder, activation records include things like when the it occurred, how long it took, logs, and the result. 

The last bit is the "Activity Timeline", atime based graph at the bottom:

<img src="https://static.raymondcamden.com/images/2017/6/monitor5.png" class="imgborder">

This is pretty much the same as the "Activity Summary", but organized by time, not by action name.

Now that I've talked a bit about the UI, what about the CLI? The CLI lets you get activations by using the `activation list` or `activation poll` command. The list command supports limiting and skipping items so you can do basic paging by hand. Both support filtering by activation name, but do not currently support filtering by package (I believe). So for example, if I had an action called doIt in my homeSecurity package, and one called doIt in my skyNet package, I can't filter to just the homeSecurity/doIt actions. (And again, I believe - I could be wrong on this.) Right now activation lists are pretty bare:

<img src="https://static.raymondcamden.com/images/2017/6/monitor6.jpg" class="imgborder">

But there is an open request to add a bit more data to this, like the time it ran and if it was successful or not. As a reminder, I wrote my own [tool](https://www.raymondcamden.com/2017/05/15/my-own-openwhisk-stat-tool/) to add some of this to the CLI. It works on one action at a time but gives you a summary of the last 2000 activations.

<img src="https://static.raymondcamden.com/images/2017/5/owstats.jpg">

I also want to point out a very cool new project launched by a fellow IBMer, [Whisk Information Timeline Tool](https://github.com/kerryspchang/WITT). This project, by Kerry Chang, is open source and looks pretty freaking amazing. Definitely check it out.

 So - all in all - I really think this is an area we need to improve. It should be much quicker to get an idea of how well my action is running and 200 activations is not nearly enough history for something running on a CRON schedule. The REST-based API is helpful, and it's how I built my tool and how Kerry built hers, but it's missing the ability to get total number of activations which makes paging a bit difficult. I think one the official UI gets some improvements and the API has this feature, we'll be covered - both by people who are happy with what's available up on Bluemix and by being able to build their own tooling.