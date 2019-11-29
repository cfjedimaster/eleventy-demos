---
layout: post
title: "Friday Puzzler - Twitter style (with an actual prize this time!)"
date: "2009-09-11T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/11/Friday-Puzzler-Twitter-style-with-an-actual-prize-this-time
guid: 3521
---

It's been a few weeks since my last Friday Puzzler, but during a meeting yesterday an idea came up that I thought was too good to pass up. To sweeten the pot a bit, I'm going to give the winner a $20 Amazon gift certificate to the winner. Your post must be by noon CST. The winner will be chosen by me and will most likely be 100% arbitrary and unfair. Whiners automatically get to use PHP for the rest of their lives. 

The puzzler is rather simple. Write a UDF that takes an arbitrary string. The UDF will parse each line for length and ensure it is less than or equal to 140 characters long. Any line longer than 140 characters should be truncated and added as a new line after the line that was too long. 

The end result is a string containing N lines that should be 100% Twitter safe.

Oh - and to make it fun? Each line of your UDF must also be less than 140 characters long. (If you have to create multiple UDFs as helpers to the main UDF, that is fine as well.)

OK, get at it!