---
layout: post
title: "Time to check out the Playbook"
date: "2010-11-18T17:11:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2010/11/18/Time-to-check-out-the-Playbook
guid: 4020
---

At MAX this year RIM showed off their hot new tablet, <a href="http://us.blackberry.com/playbook-tablet/">Playbook</a>. The more I see of this thing the more I like. Best of all - it's got support for pushing out Adobe AIR applications to the platform. That means you can now (in theory anyway) build AIR applications for the desktop, for your mobile device, for Google TV, and for the Playbook tablet. There are some good resources out there to get your started, but most of all you want to begin with Blackberry's <a href="http://us.blackberry.com/developers/tablet/devresources.jsp">Development Resources</a> page. Before you go there you want to ensure you have Flash Builder 4.0.1. Not 4.0. I'm so used to my Adobe applications updating automatically 4 times a day I assumed my Flash Builder was up to date. It wasn't. It's a good 200+ meg download so getting that out of the way will help. You also also going to need to get the Blackberry AIR SDK, the Playbook ISO, VMWare Player, and, if you are like me and have a Windows 64 machine, a 32bit JDK. (I recommend <a href="http://www.kurlu.com/blog/2010/10/installing-blackberry-playbook-sdk-on-windows-7-64bit/">this url</a> to walk you through the 64bit issue. I mentioned this to a Blackberry representative in a meeting and there are aware of the issue.)

Once you get the tools, walk through the <a href="http://docs.blackberry.com/21877/">Getting Started</a> guide (that's a link for the Windows version, there is also a tutorial for fruit computers). It's pretty simple and gets you up and running in a few minutes flat. 

Currently you can only do pure ActionScript projects. (<b>Important Edit:</b> I misspoke here very badly. The Playbook has multiple ways to write applications. What I meant is that for <i>AIR</i>-based development it must be ActionScript-only Flex projects. One of my readers is saying I'm wrong though so I may edit this again. :) Hopefully they will add support for tag based Flex projects soon. I love ActionScript - but when it comes to layout I'm a lot more familiar with the MX tags. Of course, it would be even cooler if they also supported HTML based AIR applications. Either way though I think it's pretty darn cool. Could you imagine a tablet based version of <a href="http://cfam.riaforge.org/">CFAM</a>, the mobile version of the ColdFusion Administrator built by <a href="http://www.cfsilence.com">Todd</a> and myself? I think that would be pretty darn cool. 

One quick tip for you. I'll be honest and say I read the Getting Started guide a bit quickly. I'm not sure if this is missing or if I missed it. Before you can push an application to the simulator you need to enable debugging. That takes all of two seconds. This is also required for Android development so I shouldn't be surprised. (Although oddly they also require you to setup a password.) 

Anyone else playing with this yet?