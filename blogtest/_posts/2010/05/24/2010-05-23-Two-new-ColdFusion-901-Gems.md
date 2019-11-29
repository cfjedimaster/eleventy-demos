---
layout: post
title: "Two new ColdFusion 9.0.1 Gems"
date: "2010-05-24T06:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/05/24/Two-new-ColdFusion-901-Gems
guid: 3828
---

Terry Ryan just gave his keynote at Scotch on the Rocks (and folks, I should say, my net access has been limited, so please forgive me if I'm slow to blog/tweet/respond). He showed some pretty cool demos - but at the end also gave us two new bits of information about upcoming (Second Half 2010) release of ColdFusion 9.0.1. 

The first new feature is Amazon S3 support. I didn't have time to copy down the code he showed on the slide, but I'll say it looks as as simple as can be, which is awesome since S3 is a great way to handle media files. <a href="http://groups.adobe.com">Adobe Groups</a> makes use of S3 via a CFC, but I'll soon update it to to work with the native support.

The other feature was the ability to write HQL in cfquery tags. This can be real useful complex dynamic queries. Again, I can't really share any code, but just imagine HQL within a cfquery tag and you get the idea.