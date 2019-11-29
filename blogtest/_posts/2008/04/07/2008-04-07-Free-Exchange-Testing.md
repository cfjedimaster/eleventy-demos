---
layout: post
title: "Free Exchange Testing"
date: "2008-04-07T23:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/07/Free-Exchange-Testing
guid: 2758
---

Believe it or not - I think the one feature of ColdFusion 8 I haven't tested at all is the Microsoft Exchange functionality. It looked cool and all (check out Scott's <a href="http://www.adobe.com/devnet/coldfusion/articles/cfexchange.html">nice article</a> on the feature) but I had no way of testing it. Today I ran across this article:

<a href="http://webworkerdaily.com/2008/04/07/keep-in-sync-with-a-free-exchange-server/">Keep in Sync With a Free Exchange Server</a>

This describes a free Exchange service at <a href="http://www.mail2web.com/">Mail2Web</a>. I signed up and then pointed my ColdFusion code at the account and it worked like a charm. I just tested mail and contacts, but it looks like it supports everything ColdFusion's Exchange API does.