---
layout: post
title: "BlogCFC Questions"
date: "2006-01-18T12:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/18/BlogCFC-Questions
guid: 1037
---

This is just a reminder - but every now and then I get an Ask a Jedi question concerning BlogCFC. BlogCFC has it's own <a href="http://ray.camdenfamily.com/forums/forums.cfm?conferenceid=CBD210FD-AB88-8875-EBDE545BF7B67269">forum</a> set up for support questions. You can also just send me email directly. The question this time was:

<blockquote>
How do you ping MXNA in BlogCFC?
</blockquote>

Ping support is pretty simple in BlogCFC. In your ini file, there is a property called pingurls. This is a list of URLs to ping. (Duh.) We also support a few 'special' URLs: @technorati, @weblogs, and @icerocket. These all ping their respective services. 

To finally answer your question - when you submit your feed to MXNA, they respond with a specific URL. All you do then is paste the URL into the ini file. Here is my URL, minus the ID:

http://weblogs.macromedia.com/mxna/ping.cfm?id=xxx