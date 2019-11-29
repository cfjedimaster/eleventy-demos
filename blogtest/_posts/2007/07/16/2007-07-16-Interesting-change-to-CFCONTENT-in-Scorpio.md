---
layout: post
title: "Interesting change to CFCONTENT in Scorpio"
date: "2007-07-16T22:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/16/Interesting-change-to-CFCONTENT-in-Scorpio
guid: 2197
---

I swear - every day I find something new in the ColdFusion 8 docs. Today I noticed that CFCONTENT has changed it's behavior in regards to the type attribute. In the past, if you left this attribute off, CFCONTENT would assume a text/html mime type. Now ColdFusion will "attempt" to figure out the proper file type from the mime type. The good news for that is that it means possible reducing a long set of "cfif this type, use this mine" code into one simple CFCONTENT tag. Anyone had a chance to test this out? What would be cool (and I should file an ER for this, but I think I'll get shot if I file another bug/ER for CF8) is if they would expose some of this logic to us, with perhaps a getFileType function.