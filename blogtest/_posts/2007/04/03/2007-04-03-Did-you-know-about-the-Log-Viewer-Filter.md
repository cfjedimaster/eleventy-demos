---
layout: post
title: "Did you know about the Log Viewer Filter?"
date: "2007-04-03T15:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/03/Did-you-know-about-the-Log-Viewer-Filter
guid: 1940
---

Most folks use the ColdFusion Log Viewer to do simply that - view log files. But did you know that there was also a pretty good filter function built into it as well? It isn't hidden per se, in fact you can see the button right here:

<img src="http://ray.camdenfamily.com/images/l1.jpg">

(Don't you just love my art work?) But in the years I've been working with ColdFusion I've seen few people use it. Admittedly the Log Viewer in general isn't the snazziest part of ColdFusion's administrator. I'd actually recommend folks take a look at <a href="http://flogr.riaforge.org/">Flogr</a> as a replacement. But if you can't install Flogr, then the filter is an excellent way to help you work with large log files. 

Upon clicking the button Launch Filter button the following window will open:

<img src="http://ray.camdenfamily.com/images/l2.jpg">

In general the options here are pretty self-explanatory. The keywords and date filters are probably the most important options. Just yesterday a client needed me to investigate some issues that occurred last Friday. I was able to supply both a date and time range which greatly reduced the size of the log I was working with. You can also search within the results of a previous search which can be handy in helping to narrow down the exact rows you need. 

One feature I'd like to see both in the admin and in Flogr is a simple way to take the current result set and export it to a file. This could be useful either for printing or just saving for later analysis.