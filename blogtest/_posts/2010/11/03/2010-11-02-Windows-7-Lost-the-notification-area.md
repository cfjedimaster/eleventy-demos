---
layout: post
title: "Windows 7 - Lost the notification area"
date: "2010-11-03T09:11:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/11/03/Windows-7-Lost-the-notification-area
guid: 3997
---

Ok, so this is a weird one - and something Google has failed to help me with. Before yesterday my laptop Win7 machine showed every item in the notification area. I was attempting to modify what showed up but wasn't able to. The UI even talked about it a bit...

<img src="https://static.raymondcamden.com/images/screen32.png" />

I went ahead and tried editing in the Group Policy Editor: 

<img src="https://static.raymondcamden.com/images/cfjedi/screen33.png" />

Unfortunately I did something wrong and now I have <i>no</i> notification area:

<img src="https://static.raymondcamden.com/images/cfjedi/screen34.png" />

I've tried everything I can think of but nothing restores it anymore. In my group policy editor under Start Menu and Taskbar, every single setting is "Not Configured" except for "Hide the notification area" which is Disabled. (Which should block the ability to disable it - not hide it.)

Any ideas?