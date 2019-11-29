---
layout: post
title: "FusionReactor - Still the Best for ColdFusion"
date: "2017-04-12T08:15:00-07:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2017/04/12/fusionreactor-still-the-best-for-coldfusion
---

I don't really do a lot of ColdFusion work anymore, mainly just support for clients as my side gig, but when I do think of the platform as a whole, there's two companies that always come to mind - [Ortus](https://www.ortussolutions.com/) and [Integral](https://www.fusion-reactor.com/). I blogged about Ortus, and specifically CommandBox, a [few months ago](https://www.raymondcamden.com/2016/08/30/using-commandbox-for-lucee), but today I want to share my impressions about the latest FusionReactor. 

FusionReactor (who, by the way, help sponsor this blog!) has been around for a long time now. At a high level, their product provides server monitoring and metrics for your ColdFusion server. Adobe released something similar built into the product itself, but let it wither on the vine so to speak. (Last time I checked it was still shipping as a Flex and AIR app which tells you how much attention it's gotten in the past decade.) 

The last time I played with FR, which was probably a good five years ago, I remember it worked well, but was a bit difficult to setup. Once you got past all that, it worked fine, wonderfully actually, but the setup was definitely work. 

The [current version](https://www.fusion-reactor.com/) is light years away from that. Right off the bat, the setup process was much simpler. The web-based administrator includes a scanner that can automatically find and help you setup instances for both Adobe ColdFusion and Lucee. 

![Instance Manager](https://static.raymondcamden.com/images/2017/4/fram1.png)

In the shot above, you can see my local Adobe CF server as well as my local Lucee install. 

Each instance manager links to a dashboard for the individual server. Inside that you have an incredible amount of detail. The initial dashboard gives you a good high level look at your server. Mine isn't necessarily showing a real-life example as my local Lucee server just has a few files.

![Dashboard](https://static.raymondcamden.com/images/2017/4/fram2.png)

I won't go into detail on all the various [features](https://www.fusion-reactor.com/features), but at a high level, you've got:

* A monitor to give you real time reports (see that screen shot above).
* A [debugger](https://www.fusion-reactor.com/production-debugger) that actually works in production, letting you set up triggers that can reach out to you via email and let you diagnose a live issue, versus having to wait and try to dig through log files and the such much later. What's cool about this is that you can set it up to pause a live request, but only for a certain amount of time. That means if you *can't* respond for whatever reason you aren't bringing the live server down for long. Even better, it can be set up to pause just the first instance of an issue. So given that a request for /bad causes a problem, you can tell it to pause just that first request and let other's go through. That way if the issue is intermittent, you aren't blocking other requests from hitting the URL.
* Tied to that is the ability to auto kill requests/threads that have been hung for a certain amount of time.
* Built in support for "Users", and by that I mean recognizing sessions, or how folks actually run through your app. I find this aspect incredibly interesting because it's mixing analytics along with basic intelligence of how it relates to actual usage of the server.
* System level monitoring to cover things like network IO, disk space, etc. This lets you watch over your box as a whole, not just the application.
* Database metrics (more on that in a sec).
* And a mobile app too! I didn't get a chance to try it, but it's supported on both Android and iOS. 

So again, I don't really have a lot I can show from my personal server, but I did some quick tests with some intentionally slow code. (Just by adding `sleep()`!) Here is a dedicated "Slow" report:

![Slow crap](https://static.raymondcamden.com/images/2017/4/fram3.png)

The details you get are so deep it's almost stupid - here is just one tab for that request:

![Details](https://static.raymondcamden.com/images/2017/4/fram4.png)

Going into the profiler reports details about the slow aspect. This is one part where a ColdFusion developer may have some issue as the details refer to the Java code and not the CFML. In this case it's a bit obvious that the culprit is the sleep method as it has the exact same name as the CFML function. I tried a slightly more complex example where my CFM called two functions in a CFC. One of which had the `sleep` call. Looking at the CFM request, in the profile, I can still see it's a Java sleep call making things bad, but I can't necessarily see that it was the call to the CFC that initiated it. 

So - speaking of slow bits - the old advice that you're slowest parts are probably the database is still good advice. One of the most cumbersome things I remember about the old FusionReactor was setting up database monitoring. You had to copy over a JAR, modify the datasource, and more if I remember right. Now - it just works. Automatically. And as with the rest of the dashboard, you get a crap ton of data. Again, here is just part of the detail for one database request.

![DB Details](https://static.raymondcamden.com/images/2017/4/fram5.png)

Along with detailing a request, you also get a dashboard into requests running on the server in real time too. You can quickly see the slowest queries too. Finally, if you use bound parameters in your SQL (which, of course, you are, right?), FusionReactor will automatically show them in the SQL report. So given this:

<pre><code class="language-javascript">x = queryExecute("select * from tblusers where id = :id", {% raw %}{id:1}{% endraw %});
</code></pre>

FusionReactor reports it as:

![QP Details](https://static.raymondcamden.com/images/2017/4/fram6.png)

All in all, FusionReactor started off pretty darn good and has advanced light years since it's release. [Pricing](https://www.fusion-reactor.com/pricing/) is per month (or by the year) and ranges from 39 to 79 per month. Based on what I see, this seems more than fair, and actually cheap. And heck, if the money is too much, then this may be a perfect opportunity to consider moving to the free Lucee server instead of paying for Adobe ColdFusion. Also be sure to note that FusionReactor is for all Java servers, not just CFML servers. I whole-heartedly recommend this and encourage folks to check it out!