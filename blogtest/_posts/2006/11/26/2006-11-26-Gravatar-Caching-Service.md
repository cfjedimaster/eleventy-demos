---
layout: post
title: "Gravatar Caching Service"
date: "2006-11-26T13:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/26/Gravatar-Caching-Service
guid: 1677
---

I've enabled <a href="http://www.gravatar.com">Gravatar</a> support on a few of my applications, and while the idea of the service is great, the actual performance is pretty bad. Very bad actually. (I have it turned off here.) There are a few caching services out there, but I don't think one exists for ColdFusion. I've been sick all weekend, but instead of just sitting around feeling miserable I thought I'd code up a quick application. With that I'm happy to announce the initial release of the <a href="http://gravatarcache.riaforge.org/">Gravatar Cache Service</a> for ColdFusion.

The service is set up so that you can put it on a box and have multiple applications use it. It is XML driven so that you can define different settings for each application, or simply use a default profile for the entire box. 

In my testing the service worked very well, after the cached files were created. On an application with a "regular" audience, the caching would really improve the performance.

You can download the application now at it's <a href="http://gravatarcache.riaforge.org/">RIAForge home</a>. I've marked it as version 0 as I think it may need some testing before I consider it officially One Point Oh. No docs exist yet but the basic idea is to change any Gravatar URL to a URL that points to the index.cfm file. You pass the hashed email address but nothing else as settings are stored in the XML file. Feedback is appreciated.