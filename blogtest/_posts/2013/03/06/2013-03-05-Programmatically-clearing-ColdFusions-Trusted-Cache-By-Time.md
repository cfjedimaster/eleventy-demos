---
layout: post
title: "Programmatically clearing ColdFusion's Trusted Cache By Time"
date: "2013-03-06T09:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/03/06/Programmatically-clearing-ColdFusions-Trusted-Cache-By-Time
guid: 4874
---

I've <a href="http://www.raymondcamden.com/search.cfm?search=trusted+cache">blogged</a> before about ColdFusion and trusted cache, with multiple entries on how you can clear that cache when updating files.
<!--more-->
In ColdFusion 10, you can now clear a directory from within the CF Admin. For more fine grain control and older versions of ColdFusion, you can use my Admin extension, <a href="http://cacheclearer.riaforge.org/">cacheClearer</a>. 

While these options work nicely, I needed something for my blog that skipped the administrator (which I've locked down on this server) and was quicker to use. Yes, even quicker then entering a folder in one form field.

I wrote up the following simple script that takes a base directory and gets all the files recursively. It then checks each file and sees when it was last updated. If it is within some threshold (for now, one hour), it adds it to a list that is then passed to the admin api.

<script src="https://gist.github.com/cfjedimaster/5099889.js"></script>

Note - both the docs for <a href="http://help.adobe.com/en_US/ColdFusion/10.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7f99.html">cfdirectory</a> and <a href="http://help.adobe.com/en_US/ColdFusion/10.0/CFMLRef/WSce19a0e5a003e2edfa09972122fa66a2e8-7ffe.html">directoryList</a> incorrectly state that one filter can be applied. As you can see in the script above that is not the case. You can pass multiple filters by delimiting them with a pipe character.

I added this to my blog admin so I can clear my cache with one button click. Hope this helps. (By the way, if one hour finds too many files, you can easily tweak the dateDiff to be minute based.)