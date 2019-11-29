---
layout: post
title: "Ask a Jedi: Sending emails out over time."
date: "2008-03-31T11:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/31/Ask-a-Jedi-Sending-emails-out-over-time
guid: 2741
---

A user wrote in with an interesting issue. He has to send emails out, but is limited by his host to no more than 250 emails per hour. How can he switch from "immediate" emails to a throttled limit?

While I'm not going to write the entire code out in this blog post, the problem isn't too terribly hard to solve if you use the ColdFusion Schedular. 

What I would suggest is this approach: Instead of sending emails out, take each email and add the data to a database table. You would store the from, to, subject, and body. You also want to store the time the email was created.

Then set up a scheduled task. This take will run once per hour. To be safe, you may actually want to set the task to run every 65 minutes. This task will do a cfquery to grab the emails from the database table. It will grab only 250 rows, and grab the oldest ones first. Again to be safe with your host, you may want to grab 240 instead.

As you loop over the data, you will send each email, and then delete the record from the database. 

In general this should work fine, but you obviously want to monitor the database table. If it grows faster than you can process, then you probably want to consider moving to a new host.