---
layout: post
title: "ColdFusion Sneak Peak"
date: "2007-10-02T21:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/02/ColdFusion-Sneak-Peak
guid: 2389
---

So I just sat through the ColdFusion sneak peak at MAX, and it was done <i>really</i> fast, so forgive me if I get a few details wrong. The demo involved moving from a CF-based Ajax app to an AIR application. If I saw right, he began by adding a &lt;cfairaccess& tag, and then set a property to CFGRID to mark it as available offline. He views the page in the browser and saves the result as an HTML file. He then uses the normal AIR compiling tools (from what I can tell) to generate an AIR app. It works. Ok - no big surprise there since CF generates HTML, but it is kind of nice as he is now browsing his data in the AIR app. 

He then demonstrates how he could add two buttons to set the application in online/offline mode. He showed how the old code uses ColdFusion.Ajax.submitFormat and switched it to ColdFusion.air.submitForm(). He did the trick of save as/AIR compile again and this time the result application was able to detect when the application was offline. He could send mail in offline mode - go online - and see it processed.

It was rather quick and I'm missing a few details (Adobe, consider this your invitation to add details ;) but was really interesting!