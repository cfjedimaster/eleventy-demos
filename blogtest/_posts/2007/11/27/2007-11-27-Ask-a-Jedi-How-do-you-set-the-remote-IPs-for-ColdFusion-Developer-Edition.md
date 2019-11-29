---
layout: post
title: "Ask a Jedi: How do you set the remote IPs for ColdFusion Developer Edition?"
date: "2007-11-27T16:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/27/Ask-a-Jedi-How-do-you-set-the-remote-IPs-for-ColdFusion-Developer-Edition
guid: 2499
---

Brendan asks:

<blockquote>
<p>
I have a question about the Coldfusion 8 Developer Edition Admin.  I am setting up an instance on a coworker's computer and she wants to be able to show progress to her project manager.  I remember reading that CF8 Dev. allowed up to
two additional IPs to connect to it.  Does this need to be set up in the admin somewhere?  I am having a hard time figuring out where to enter which IPs are allowed.
</p>
</blockquote>

Unfortunately this is <b>not</b> something you can control. Basically the first two remote IPs that hit the machine will be the only two allowed IPs. Now since you are talking about your coworker's computer, it wouldn't be too hard for her to simply restart ColdFusion if her manager can't access the machine. I would probably argue though - that this problem has a better solution - and that is a central development server running a licensed copy of ColdFusion. As your coworker reaches milestones, she could check in code to the central development server, leaving her own server for her continued development.