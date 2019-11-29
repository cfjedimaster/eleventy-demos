---
layout: post
title: "ColdFusion CFERROR Bug"
date: "2005-07-31T19:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/07/31/ColdFusion-CFERROR-Bug
guid: 658
---

Today is bug day! This isn't a bug per se - but a change in behaviour. Like the <a href="http://ray.camdenfamily.com/index.cfm/2005/7/31/ColdFusion-Function-IsValid-Bug">last issue</a> I blogged about - I can't take credit for finding it. This issue was found by Glenda Vigoreaux of <a href="http://www.roundpeg.com">Roundpeg</a>.

So what's the problem? The cferror tag allows you to specify a file to run when an error occurs. The file is relative to the Application.cfm file. So if an error occurs in /foo/moo/goo.cfm, and your Application.cfm file in root simply says to load "error.cfm", which exists in root, then it wil load just fine.

However - if you take the exact same cferror tag and place it in an Application.cfc file - the template value is now considered relative to the page causing the error - not the Application.cfc file. You can get around this by using a mapping - but obviously it is something to look out for. You can also use an onError method as well, but if the onError does a cfinclude, you most likely need to use a mapping as well. Actually - let me test that. So a quick test shows that a cfinclude in onError will be relative to the Application.cfc file.