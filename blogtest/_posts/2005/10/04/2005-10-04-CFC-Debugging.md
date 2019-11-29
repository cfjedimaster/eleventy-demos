---
layout: post
title: "CFC Debugging"
date: "2005-10-04T22:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/04/CFC-Debugging
guid: 829
---

ColdFusion has numerous debugging options. One of them includes a template execution report. This table includes every CFML template run as well as the total time spent on it, along with an average. Along with CFML templates, it also includes CFC method calls. One problem with this report, though, is that it considers CFC method calls with different arguments as different things to report. That's not bad at all. It may be that foo(1) is significantly slower than foo(0). However, I was looking for a report that gathered <i>all</i> the CFC calls together and gave more of a summary type report.

Luckily, ColdFusion's debugging templates are all unencrypted CFML templates. That means you can modify or add your own debugging templates. I copied the basic report (classic.cfm), and began working. The debugging data is a bit difficult to work with. For example, CFC calls don't have their own API in the debugging code. I plugged away a bit and was able to strip the data down to just the CFC and the method. I then added the report you see below:

<img src="http://ray.camdenfamily.com/images/cfcdata.jpg">

To play with this, simply download the file <a href="http://ray.camdenfamily.com/downloads/classic2.zip">here</a>. Unzip, and copy to your cfusionmx7\wwwroot\web-inf\debug folder. Then go to your CF Admin, select classic2.cfm as your template, and then hit a page with any CFC call in it. I plan on modifying it a bit later to show both a min and max report on each CFC method.