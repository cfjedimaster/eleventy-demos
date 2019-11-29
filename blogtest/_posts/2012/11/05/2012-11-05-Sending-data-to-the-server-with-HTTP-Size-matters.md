---
layout: post
title: "Sending data to the server with HTTP? Size matters"
date: "2012-11-05T15:11:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2012/11/05/Sending-data-to-the-server-with-HTTP-Size-matters
guid: 4775
---

A few times a month I run into someone having issues with this and just a few minutes ago I helped someone out so I thought I'd write something up quickly to help make it (hopefully) a bit more Google-friendly for those having trouble.

The problem, and solution, is typically pretty simple. If you have found that your network calls to send data to the server are failing, check to see if you are doing a GET request. While according to Stack Overflow there is no <a href="http://stackoverflow.com/questions/266322/http-uri-get-limit">real limit</a> to the size of a GET request, there are practical and browser-specific limits that may impact you.

In general, if I'm building a form with a text area, I'll use a POST instead of a GET. If I'm sending a file than I'm definitely using POST. 

To be clear, this isn't an "Ajax" issue, but a HTTP thing. The person who emailed me today was actually using the HTTPService in Flex.

I'll also add - it's probably a good idea to <i>really think</i> about how much data your user is sending to your server. Are there things you can do to minimize the size? Are you handling timeouts or other errors? On the server, are you checking how much free space you have available? Have you considered using S3 to bypass artificial limits on storage?