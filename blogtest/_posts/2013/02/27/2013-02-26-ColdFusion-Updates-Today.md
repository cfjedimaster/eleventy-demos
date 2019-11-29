---
layout: post
title: "ColdFusion Updates Today"
date: "2013-02-27T10:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/02/27/ColdFusion-Updates-Today
guid: 4867
---

Today we released updates for ColdFusion 9 and 10. These updates allow for Java 7 and fix an issue with Google Maps. You can find details on ColdFusion 9's update <a href="http://blogs.coldfusion.com/post.cfm/new-updates-for-coldfusion-9-9-0-1-9-0-2-and-10-java-7-now-supported">here</a> and ColdFusion 10 <a href="http://helpx.adobe.com/coldfusion/kb/coldfusion-10-update-8.html">here</a>.

This morning I applied the update on my local ColdFusion 10 box and tested a page with cfmap on it. You will get an error if you leave the Google Map API key value set in your settings (either the ColdFusion Administrator or App.cfc). If you just remove the value you should be fine.