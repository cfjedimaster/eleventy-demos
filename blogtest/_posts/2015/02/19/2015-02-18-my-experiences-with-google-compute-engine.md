---
layout: post
title: "My experiences with Google Compute Engine"
date: "2015-02-19T10:58:37+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2015/02/19/my-experiences-with-google-compute-engine
guid: 5709
---

A while ago I promised I'd write up my experiences working with <a href="https://cloud.google.com/compute/">Google Compute Engine</a>. As my readers know, I've been suffering with some uptime issues here (which I do <strong>not blame</strong> on the platform, just my inexperience) and I was waiting until I got that 100% nailed down, but since I'm still working my way towards a final solution, I thought I'd take some time to write up what it was like to use Google Compute Engine (GCE).

<!--more-->

I decided to use GCE based on the recommendation of a good friend and former coworker. He works at Google and actually evangelizes GCE, so I figure if something went wrong, I could bug the heck out of him. (Spoiler - I did. ;) Going into it, my only experience with services like this was EC2, and even then, I didn't have a lot of experience. I've fired up two or three EC2 instances, and when I did in the past, I was using someone else's money so I didn't have to worry too much about sizing the instance and stuff like that. My biggest concern about GCE was cost. In the past, it had seemed that Amazon didn't make it easy to figure out what a full time instance would cost. (Again, this was my impression in the past, it may be different know.) Google does a decent enough job with their <a href="https://cloud.google.com/products/calculator/">pricing calculator</a>. Heck, it <i>defaults</i> to 24 hours a day/7 days a week which is nice. The only issue I had was with bandwidth estimates. I haven't really paid attention to my bandwidth numbers since I started using Google Analytics. It would be cool if they had some way of providing a rough estimate in their calculator, like, "A blog getting 100K page views per month is roughly N gigs." I just checked my console, and for the life of me, I can't find a way to see what I "spent" last month in network traffic. It doesn't seem to be broken down in the bill, but I may be missing it. 

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/gce1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/gce1.png" alt="gce1" width="800" height="452" class="alignnone size-full wp-image-5710" /></a>

When it comes to servers, my primary experience is with Windows. While I love my Mac, I've always found Windows to be a heck of a lot easier for servers. The primary reason is that it makes it <i>so</i> much easier to see what services are being run. On my Mac, I can honestly say I have no flipping idea what's set to run on boot and how I can check/modify/etc those settings. The Windows Services control panel is - in my opinion - worth the cost of the license right there - but I'm a cheap guy so I went with Ubuntu for my instance. I also initially selected the Micro (0.6 gig) instance which was a big mistake. (One of a few I made.) 

Once the instance is started, Google makes it very easy to work with it. You can run SSH in the browser, or, if you install their <a href="https://cloud.google.com/sdk/">command line tools</a> (which I recommend, more on why in a bit), they provide a SSH utility that makes it easy to connect. My knowledge of SSH is a bit rusty, but when I used Google's tool, it made it incredibly easy. It just worked, which was quite cool.

At that point I had to get stuff installed. Google has starter packs for various technologies, including WordPress, but at the time I thought it would make sense to do it myself. (And - maybe it was still in beta when I set up a few months ago. Honestly, I'm trying to remember why I didn't go the easy route, it seems like it would make sense to do so now.) Not having done a bunch of installations from the command line, it took a bit of searching, but I'd say within an hour I had Apache, MySQL, and WordPress set up on the instance. I made sure to copy down those command lines in case I needed to run them again.

At that point - it was pretty much done. I had assigned a temporary external IP address for testing. My mistake here was in forgetting this was temporary before I set up my DNS to point to it. At the time when I did that, there was no way to "promote" a temporary IP address to static. Again, from Googling, I discovered a simple workaround that used the command line tools. Looking at my web based console now it <i>appears</i> as if they added a way to do it there, but I know that in more than one case I found myself needing to use the CLI when the web based tool didn't provide a particular option. Consider this then another recommendation to grab those tools when you first set things up.

The other mistake I made was using a tiny CPU. Unfortunately, there is no way to upgrade an instance as is. I made a new instance, then detached my disk drive from it, reattached to the new one, and "moved" my static IP address. If I remember right, this was all done via the web based console and I did it while my blog was public, but I think I got it done within five or ten minutes so it wasn't a big deal.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/gce2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/gce2.png" alt="gce2" width="800" height="405" class="alignnone size-full wp-image-5711" /></a>

Probably the only other issue I ran into (minus the MySQL stuff *sigh*) was permissions. I had to do quite a bit of tweaking to get my Wordpress blog allowing for attachments and letting me tweak PHP files where necessary. I discovered many of these issues <i>after</i> I went live, which probably means I should have tested a bit better, but, it was for my personal blog so I only had myself to blame.

The one thing I decided to skip was mail. From what I could see, the only way to use mail was to work with SendGrid. While they provide a free level of service that would probably be way more than I would need, I just didn't feel like adding another moving part to my system so I decided against it. (For folks curious, I just use <a href="http://www.formkeep.com">FormKeep</a> to handle my forms.) 

That's where I stand now. As folks know, I'm still fighting MySQL. It really bothers me that I can't seem to lick it. My blog isn't "high traffic" per se, it only gets 120K page views per month, and it seems like I shouldn't have this much trouble nailing it down, but to be clear, that's definitely not Google's fault, just my lack of experience in managing my own server.

So - what's the cost been? When you sign up, you get 300 dollars credit, but if you're like me, you may miss an important qualifier on that trial: "Sign up for free and get $300 to <u>spend over 60 days</u>." I initially thought... ok... if I average 20-40 bucks per month, that's like 6 to 7 months free. But I had missed the "over 60 days" portion. This isn't hidden at all - it's pretty damn clear - I just missed it because I'm kinda dumb sometimes. In December, my bill was 26.75. In January, it was 30.45. I think thats a good price. My previous VM was 300 a month (although I had a <strong>huge</strong> discount thanks to the fine folks at <a href="http://www.edgehosting.com/">Edge Hosting</a>) so this is quite a bit cheaper, but obviously I could use the help of a server administrator to help nail down the (hopefully) final MySQL bug. 

Obviously I'm probably not a "standard" GCE user. I'm a blogger who links to tinker, not a startup who needs to rapidly scale for demand. That being said, I'm pretty impressed by what I've used so far, and have only hit a few rough spots in my usage.

As always, I'd love to hear people's comments about their own use of GCE and what they think!