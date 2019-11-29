---
layout: post
title: "Handling this error: The tag does not allow the attribute(s) RESULT."
date: "2007-01-16T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/01/16/Handling-this-error-The-tag-does-not-allow-the-attributes-RESULT
guid: 1768
---

I've had a few people email asking me what this error means so I thought I'd whip up a quick explanation. This error occurs when trying to run code for ColdFusion 7 on a non-CF7 server. ColdFusion MX 7 added the result attribute to a few tags, including CFQUERY and CFHTTP. (I think CFFTP was the only other one - but there may be a few more.) This sorely needed attribute gives you control over the variables that these tags create by default. So for example: CFHTTP would always create a variable named CFHTTP. This would contain the result of the tag execution. The new result attribute lets you specify another name for the variable. 

Later today I'll talk about how to write code to check the current version of ColdFusion and how to ensure you are running on the right version.