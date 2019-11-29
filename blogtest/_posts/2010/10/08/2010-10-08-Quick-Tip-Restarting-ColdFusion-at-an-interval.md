---
layout: post
title: "Quick Tip - Restarting ColdFusion at an interval"
date: "2010-10-08T13:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/10/08/Quick-Tip-Restarting-ColdFusion-at-an-interval
guid: 3966
---

Had a few quick emails with a reader today I thought I'd share. First, let's start with this question:

<blockquote>
Is it possible to have Coldfusion server programmatically restart every X days?
</blockquote>
<!--more-->
The short answer is absolutely yes - just use your operating system's native scheduling capability. To be clear, I'm not talking about the ColdFusion Scheduler (not sure you want to use ColdFusion to restart itself), but the tools provided by the OS itself. On Unix based systems you have a CRON system that you can edit with a simple text file to set up a scheduled task. Write a quick shell script to run the command line to restart ColdFusion and you are all set. I haven't worked with CRON in a long time. I remember it being weird but once I got past the syntax it worked ok.

On the flip side, Windows has support for this too. You can use the Tool Scheduler which apparently got a little bit of an update in Windows 7:

<img src="https://static.raymondcamden.com/images/screen15.png" />

After sharing this with the reader, he replied with:

<blockquote>
Of course ideally I should really figure out why my server is going down every 3-4 days :P  
but right now pretty backed up and would rather reboot in middle of night than the random hours it's choosing now.
</blockquote>

Couldn't agree more. It is an unfortunate fact of life that band aids tend to stick around forever. So if you are using this technique to get around some server issue, you definitely want to ensure you take the time to find out why.