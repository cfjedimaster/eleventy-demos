---
layout: post
title: "Using ColdFusion's Autosuggest? Check your query size"
date: "2012-09-04T23:09:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2012/09/04/Using-ColdFusions-Autosuggest-Check-your-query-size
guid: 4723
---

Here's an interesting issue I ran into tonight while reviewing some code from a friend. He had a complex search form that included multiple uses of ColdFusion's autosuggest feature. If you haven't seen this yet, it is a feature of the cfinput tag that makes it pretty easy to build an autosuggest field. You can point the tag to a CFC, return an array of data, and it gets rendered as a set of suggestions to the user.
<!--more-->
While testing, I had Chrome Dev Tools turned on. I noticed the network call to the CFC was returning nearly 200k of data! That's quite a bit. I right clicked into Chrome Dev Tools and got the full URL of the Ajax call. I pasted this into a new tab and saw why the size was so big. There was a huge amount of data. 

Here's where things got interesting though. On the front end, only 10 results were displayed. I turned to the docs and found that one of the attributes for cfinput is maxResultsDisplayed. This is optional. Can you guess what it defaults to? 10. That's a perfectly reasonable result, but what it also means is that it is easy to miss a performance issue where your sending huge amounts of data over the wire but only rendering a small amount.

The fix is easy - just limit the results in your CFC. Problem solved. But again - because the front end limits what you see - you may miss the fact that you're shuttling back a lot of data.