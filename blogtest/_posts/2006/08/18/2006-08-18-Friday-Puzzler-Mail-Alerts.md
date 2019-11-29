---
layout: post
title: "Friday Puzzler: Mail Alerts"
date: "2006-08-18T12:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/18/Friday-Puzzler-Mail-Alerts
guid: 1480
---

This one is rather simple, but as it involves string manipulation, I thought it might be fun.

Write a simple UDF that takes a mail server, username, and password, and a keyword. This script will check all the mail on the account and return a list of messages that match the keyword. It should NOT delete the mail, but just download and parse. 

What would this be used for? Imagine an account you do not check often but want to monitor for certain keywords ("I'm going to sue you!", "You stink of elderberries!"). This code could be used on a scheduled basis to simply see if something important is in the queue.