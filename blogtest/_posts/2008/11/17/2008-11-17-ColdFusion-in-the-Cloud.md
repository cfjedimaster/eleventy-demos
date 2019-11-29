---
layout: post
title: "ColdFusion in the Cloud"
date: "2008-11-17T17:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/17/ColdFusion-in-the-Cloud
guid: 3109
---

Kevin Hoyt is presenting at the Unconference now and has brought up an interesting subject - ColdFusion in the Cloud. (I'll be blogging while he speaks for forgive the grammar.) Says he just got permission to demo this! 

Specifically talking about Amazon EC2. Vendor is Stax - he said if you want an invite to the beta, contact him. Saying this is ALL very much beta, may not happen in production, etc etc etc. Mentions Spike Washburn, an old Allaire guy involved w/ CF. 

He goes to a web based console of his servers in the cloud. Clicks a button to create a new ColdFusion application. Hits create. And right now, he is pushing ColdFusion to an EC2 cloud instance. It is a pre-built image of CF, minus the admin for security reasons. Essentially a blank slate CF install. Basically click and publish.

So how do you write CFMs for a CF install in the cloud? You can download a copy of the image, extract it (it is a zip), do your edits, then redeploy it. 

p.s. I think this means the first big CF news came at the Unconference. Woot^2.