---
layout: post
title: "Node lessons learned painfully (or why my site crashed)"
date: "2013-06-24T11:06:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2013/06/24/Node-lessons-learned-painfully-or-why-my-site-crashed
guid: 4971
---

Last week I launched <a href="http://www.javascriptcookbook.com">JavaScriptCookbook</a>. The code behind the site makes use of Express and Node.js. This is the first site I've ever built using Node and frankly - I'm really unsure of... well everything. It was fairly trivial to get the site up and running (Express is just an incredible framework), but there is still quite a bit to the ... ecosystem (not sure if that is the right word) that is a bit unclear to me.
<!--more-->
I launched the site on Thursday. After the initial announcement I got some tweets from rather important accounts that led to a big spike in traffic. According to Google Analytics the site had - at one point - 140 simultaneous users. That was awesome. But the site never crashed or slowed down. 

However - when I woke up Friday, I saw some tweets saying the site was down. I confirmed this. I hopped over to AppFog, restarted the site, and everything was kosher. I then tried to figure out what went wrong. AppFog has a command line tool and it provides access to crash logs. When I ran this though nothing came up. I saw my console messages but nothing more. I really had no idea what happened. I opened a ticket with AppFog and just carried on. 

Yesterday I was testing something with the site when I realized something crucial. If your Node app encounters a bug, its aborts. As in - it dies. This is not new to me at all. I've been playing with Node for a while. But when running a Node app as a site, well, that's pretty important to remember. I'm so used to the ColdFusion model (which applies to PHP and other platforms) of a constant server that simply parses code on a request by request basis. 

For folks curious, my bug was rather simple. The code that handled loading a page by the SES token (what you see in the URL) was not handling cases where the token didn't match anything. I didn't notice this until I deleted an entry and reloaded the page to ensure it was gone. The second I did - bam - the app died. 

I need to do a bit more research into how I can handle this in the future. There is an interesting article about a tool called <a href="http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever">Forever</a>. It attempts to keep a Node app running, well, forever. But I don't think I could use that on a hosted solution like AppFog. The other thing I want to investigate is error handling in general. In a ColdFusion app, I'd have logic to dump the exception in development and mail/log it in production. Express has ways to handle dev versus production easily enough, I just haven't actually added it to my application yet.

Finally - I must say I'm rather disappointed by the support at AppFog. Here's my support ticket still waiting for someone to even look at it after three days:

<img src="https://static.raymondcamden.com/images/Screenshot_6_24_13_9_25_AM.png" />

As a paying customer, this does not make me happy. Of course, I know I'm at the cheapest tier, but I'd hope for some type of response within a day at least.

<b>Edit:</b> Last night, I finally did get a response from AppFog. I'm not happy that it took this long, but the response made sense to me though. Basically, next time my app crashes I need to check the logs via the CLI <i>before</i> I restart it. Here is their response in full:

<blockquote>
Hi Raymond, we're still working on our diagnostic tooling. When you restart the app, it clears out the crashes and crashlogs information. If this happens again, you'll want to grab those logs before restarting the app. We would also recommend hooking your app up to our LogEntries addon: https://docs.appfog.com/add-ons/logentries
</blockquote>