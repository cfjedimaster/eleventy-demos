---
layout: post
title: "How would you replicate CFIMPERSONATE?"
date: "2008-02-21T13:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/21/How-would-you-replicate-CFIMPERSONATE
guid: 2665
---

A friend recently asked me an interesting question. He wanted to use ColdFusion to read a folder that the server didn't have access to read. In the old days, you could get around this by using cfimpersonate. As you probably guess, this tag let ColdFusion impersonate another user when executing commands. This tag was removed when MX was released. So how would you go about doing the same thing now in ColdFusion 8?