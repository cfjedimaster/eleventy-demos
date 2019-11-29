---
layout: post
title: "ColdFusion and Pagination - Six Years Later"
date: "2012-06-22T17:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/06/22/ColdFusion-and-Pagination-Six-Years-Later
guid: 4655
---

A little over six years ago I wrote a little blog post on how to do simple pagination in ColdFusion: <a href="http://www.raymondcamden.com/index.cfm/2006/4/24/ColdFusion-and-Pagination">ColdFusion and Pagination</a> The post walked you through the simple step of iterating over a 'page' (or limited set) of data and providing links to navigate the data. For whatever reason, the post has gotten a few comments lately so I thought I'd post a quick update.

First off - <a href="http://www.raymondcamden.com/index.cfm/2006/4/24/ColdFusion-and-Pagination#cF43FD781-0F4C-C996-794C984784D9EE59">Scott</a> correctly pointed out that you should try your best to paginate in the database itself. I agreed - but to be fair - this example was meant for short sets of data that a user would actually peruse. I don't expect users to click "Next Page" over a few million records. That being said - you should try to offload as much as possible to the database and reduce the work your application server has to do.

Secondly - another reader, <a href="http://www.raymondcamden.com/index.cfm/2006/4/24/ColdFusion-and-Pagination#cD155BBEA-05C6-9BDF-8E35DD12E4DA2227">Ulises</a>, asked if I could update my code to show the current page and the total number of pages. Both were rather easy. Let's look at the complete template and I'll explain how I added these features.

<script src="https://gist.github.com/2975167.js?file=gistfile1.cfm"></script>

For the most part - this template is based on the code from the <a href="http://www.raymondcamden.com/index.cfm/2006/4/24/ColdFusion-and-Pagination">previous entry</a> so I will not be covering every line. I did simplify the query a bit and used ColdFusion 10's simpler queryAddRow support. 

The critical changes are these lines:

<script src="https://gist.github.com/2975200.js?file=gistfile1.cfm"></script>

By using a simple bit of math, I can determine both what the total number of pages are as well as the current page. If I decide to change the size of a page later on the math will continue to work. And that's it. Not exactly rocket science, but the basic concept of paging over a set of data is still something folks like to see examples of, so I hope this is helpful! If you fancy seeing a demo, click the big obvious Demo button below...

<a href="http://raymondcamden.com/demos/2012/jun/22/test2.cfm"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>