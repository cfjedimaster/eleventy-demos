---
layout: post
title: "onError, cfabort, and the Final Answer"
date: "2006-05-30T18:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/30/onError-cfabort-and-the-Final-Answer
guid: 1305
---

Sean Corfield has a <a href="http://corfield.org/blog/index.cfm/do/blog.entry/entry/onError_onRequest_and_cfabort">good blog post</a> on the oddness folks have seen in the past with the onError method and cfabort. The basic summary is: The cfabort tag will run your onError method if you have an onRequest method in your Application.cfc file. Read Sean's <a href="http://corfield.org/blog/index.cfm/do/blog.entry/entry/onError_onRequest_and_cfabort">post</a> for a more in-depth explanation of why.

p.s. I realized too late that - the mere fact I added "The Final Answer" to this blog entry means that it will, of course, change in the future.