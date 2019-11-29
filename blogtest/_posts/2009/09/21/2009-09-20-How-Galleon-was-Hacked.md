---
layout: post
title: "How Galleon was Hacked"
date: "2009-09-21T08:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/21/How-Galleon-was-Hacked
guid: 3534
---

Ben provided some <a href="http://forta.com/blog/index.cfm/2009/9/20/Yes-I-Was-Hacked">details</a> morning on what happened to his server and I thought I'd follow that up with some precise details on how Galleon was hacked. As an open source developer whose work is used by many organizations, I take security risks with my software <i>very</i> seriously. When this hack was pointed out to me (more on that in a second), I got a quick fix up within about 20 minutes. I then followed that up with a more detailed fix later. 

I want to personally apologize to anyone who may have impacted by this, and certainly extend my deepest regrets to Ben and Michael. I tried my best to correct this quickly, but at the same time, I didn't want to spell out the details until folks had a few days to patch up. Hence my twittering and vague blog post a few days ago. 

Credit for this find goes to the engineers at <a href="http://www.getmura.com/">Mura</a>. Not only do they have a great product, they have great minds as well. They approached me personally with this before going public themselves, and I appreciate them giving me some time to fix things. 

Again - folks - I take this very, very seriously. <b>Please</b> come to me if you think you see a security problem with any of my code. I can call myself a Jedi all I want, but at the end of the day I'm imperfect and need help from my users. Ok, so enough preamble, here are the details.
<!--more-->
Galleon has two places where folks can upload files: avatars and message attachments. For both, the process was: Upload and then check the extension. Avatars were checked for image attachments and message attachments were checked against a list (defaulting to things like .txt, .pdf, etc).

So if you tried to be sneaky and upset a CFM file, ColdFusion would recognize this and then delete the file. However, all uploads were done to the proper folder for each time. So uploading a CFM for your Avatar put the file into the images/avatar folder. It would <i>then</i> check the extension and delete it. This wasn't instant, even though it may have looked liked it. There may have been 1-5 MS between the time the uploaded file was copied into the proper folder and the time it was checked. 

The attacker used a load tester. A load tester is normally used to drive a lot of HTTP traffic to your site to see how well it responds. At a basic level though it's like someone sitting there with his browser and hitting reload really, really fast. 

So if the attacker had a file named sss.cfm, he could begin the load tester driving traffic to galleoninstall/images/avatars/sss.cfm. He would then do the upload. His attack file was set up to first make copies so even though sss.cfm would be deleted, he would then be able to use the new file to perform other nefarious deeds. 

So why did I upload files under web root? Galleon was meant to be installed under your web root itself. It was also meant to be installed easily by everyone, including folks using shared hosting where you - normally - don't get access to folders out of the web root. That was my thinking about why I needed to do the uploads like that. <b>But I was wrong.</b> It was easy enough to change the upload process to make use of getTempDirectory(). This is what I do now. The file is uploading into the temporary directory, checked, and then moved to the final destination if it passes the extension test. I also went the extra step and renamed the file to a UUID. My thinking here was that no one really cares what their Avatar file names are nor do they care about attachment file names since I can force the download to use the nicer, original name when you download. 

I hope my screw up here helps others. If you thought uploading to a web root folder is ok because you "immediately" delete it, please remember that immediately on a machine isn't quite what you may think it is.