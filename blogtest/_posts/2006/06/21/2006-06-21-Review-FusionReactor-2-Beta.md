---
layout: post
title: "Review: Fusion-Reactor 2 (Beta)"
date: "2006-06-21T14:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/21/Review-FusionReactor-2-Beta
guid: 1348
---

I was lucky enough to be asked to play some with the Fusion-Reactor 2 beta. I asked if I could write a review and was given permission. (I did pass this review by them first, but more to ensure I didn't screw things up.) If you haven't heard of <a href="http://www.fusion-reactor.com">Fusion-Reactor</a>, here is a brief overview. Fusion-Reactor is a J2EE servlet that runs with your ColdFusion server. It gives reports on requests and helps you monitor the general health of your server. A competitor would be <a href="http://www.seefusion.com">SeeFusion</a>, and in a minor sense, my project, <a href="http://ray.camdenfamily.com/projects/starfish">Starfish</a>. I plan on reviewing SeeFusion later in the year, and to be honest, I'm sure both put Starfish to shame.
<!--more-->
I had not played much with the earlier version of Fusion-Reactor. Right when I had asked them for a review copy the beta of version 2 was coming out. So some of what I talk about may already be in the released version, and since I'm working with a beta, things may change before the final release.

To begin working with Fusion-Reactor, you run the installer. It actually sniffed the servers on my box and noticed my CFMX 6 and CFMX 7 servers, along with the Flash Data Services beta. I selected my CFMX 7 box, entered a few details like the password I wanted to use, and that was it. If it restarted ColdFusion, I didn't notice. (It must have.) Once installed you can start using the Fusion-Reactor administrator:

<a href="http://ray.camdenfamily.com/images/fr1.jpg"><img src="http://ray.camdenfamily.com/images/fr1_small.jpg"></a>

There are a lot of options here, but lets take a look at a few of them. The <b>Running Requests</b> page obviously shows all running requests. On my home server, this was normally blank. I had to find a particularly slow site on my box in order to make it actually show something, but this is to be expected on a personal development box. What is of more interest is the <b>Request History</b> page.

<a href="http://ray.camdenfamily.com/images/fr2.jpg"><img src="http://ray.camdenfamily.com/images/fr2_small.jpg"></a>

As you can see, this report lists all requests along with the time to complete and memory usage at that time. What I'd like to see them add here is a flag for long requests. Kind of like how the ColdFusion debugger will flag them. You can tell the page to refresh automatically and monitor looking for "bad" requests that are eating up time and memory. 

Clicking on a particular request gives you a lot of detail about the request, including headers and cookie information. One extremely sweet new feature is the addition of a JDBC wrapper. Essentially, you can replace a "normal" CF DSN with a driver that uses the wrapper provided by Fusion-Reactor. Once done, the wrapper will log the SQL used by queries on the page (including showing values for cfqueryparam tags). It will show the execution time, both on the back end and for ColdFusion, and how many rows returned. 

<a href="http://ray.camdenfamily.com/images/fr3.jpg"><img src="http://ray.camdenfamily.com/images/fr3_small.jpg"></a>

Another feature of this wrapper is a row limiter. So if a user writes some bad SQL that returns 100,000 rows, you could actually limit the result set to some sane number like 1000. Now to be honest, I don't think I'd use that. I'd much rather have an event like that logged so I could hunt down the programmer and read him the riot act. Band aids like these worry me in that I think they have the potential to hide a serious problem. While I guess that is good... my instincts say I'd rather ensure the problem gets fixed.

Either way -  I think this is one of my favorite features. I'm currently using it to profile <a href="http://www.blogcfc.com">BlogCFC</a> and find places where I can make improvements.

Another interesting feature is the Request Capture setting. This lets you capture an <i>entire</i> request and response. While this could fill up a hard drive pretty quickly, it could be incredibly useful for debugging. 

Fusion-Reactor supports logging of AMF requests, both "old" style and the new version in Flex 2. At the time of my review though, the layout of the reports were still in flux, but the information was being recorded. I could see my Flex 2 AMF requests and the information being requested. Pretty handy stuff!

Another significant new feature of Fusion-Reactor 2 is the Enterprise Dashboard. This lets you monitor any number of machines and get a quick and graphical look at the health of your network:

<a href="http://ray.camdenfamily.com/images/fr4.jpg"><img src="http://ray.camdenfamily.com/images/fr4_small.jpg"></a>

During my testing, I noticed that the machine in the screen shot above would slowly turn red when I ran a slow running request. As you can imagine, if you had a cluster of machines this would be a vital tool to have running. You can also configure Fusion-Reactor on what "bad" is - so you don't get false-positive responses. Fusion-Reactor also supports grouping in case you have an even larger number of machines.  And last but not least - you can have one machine monitor another. If the machine goes down, Fusion-Reactor can notify you via email. 

So while the Fusion-Reactor product has it's own administrator, you don't actually have to use it. Fusion-Reactor ships with FRAPI, an API to their own server. So for example, you could do something like this in your ColdFusion code:

<code>
&lt;cfset frapiClass = createObject("java", "com.intergral.fusionreactor.api.FRAPI")&gt;
&lt;cfset frapi = frapiClass.getInstance()&gt;
&lt;cfoutput&gt;Is FR Running?: #frapi.isFusionReactorRunning()#&lt;/cfoutput&gt;
</code>

What is neat about this is that you could tie this to ColdFusion's Enterprise Gateway system. Imagine having Fusion-Reactor send you a SMS when requests start taking too long to process? Or if a machine crashes in a cluster? All of this would be possible with FRAPI. 

Another feature of Fusion-Reactor is the Content Filter. Now I have to admit that I don't like this feature. It will look for text (with either plain text or regex) in a request and replace it with something else. So for example, you could use it to quickly replace Macromedia with Adobe. While this is cool - I don't think such a tool should be doing this. Then again, I've never had a super-urgent need to make such a text change in mere seconds. If I did - I'd use this - but would then immediately start doing the "real" work behind the scenes. 

So I've only begun to touch on the features of this application, but so far I'm pretty darn impressed. I plan on installing this on my main machine and see how the box is holding up. Once Fusion-Reactor is released I'll be sure to let you know. I'm sure there will be some additional changes between now and the release date!