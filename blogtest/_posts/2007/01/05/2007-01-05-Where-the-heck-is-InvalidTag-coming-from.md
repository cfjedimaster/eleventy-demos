---
layout: post
title: "Where the heck is InvalidTag coming from?"
date: "2007-01-05T19:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/01/05/Where-the-heck-is-InvalidTag-coming-from
guid: 1756
---

I've gotten this question many times so I thought I'd write up a quick FAQ. If you are displaying dynamic content on your ColdFusion site and see InvalidTag instead of the HTML you thought you would - it means one of two things.
<!--more-->
Either your ColdFusion Admin has <b>Enable Global Script Protection</b> turned on or your Application has scriptProtect set to true. This would be set in either the CFAPPLICATION tag or the This scope of your Application.cfc file. 

This is a feature that helps prevent cross-site scripting attacks. Personally I don't use this feature as I always htmlEditFormat user input before displaying it. For more information about this feature, see this page from the LiveDocs:

<a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00001705.htm">Settings Page</a>


So - raise your hand if you've seen this and had no idea what it was!