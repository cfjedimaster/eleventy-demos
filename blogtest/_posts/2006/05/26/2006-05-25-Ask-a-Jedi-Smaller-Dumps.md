---
layout: post
title: "Ask a Jedi: Smaller Dumps"
date: "2006-05-26T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/26/Ask-a-Jedi-Smaller-Dumps
guid: 1297
---

Ok, I swear this is the last childish entry title (for this week). A few days ago I <a href="http://ray.camdenfamily.com/index.cfm/2006/5/23/Ask-a-Jedi-Saving-a-Dump-for-Later">blogged</a> about how you can save the result of a cfdump for later use. It occurred to me that I bet many folks aren't aware of the very useful attributes of the cfdump tag. Here is a quick run down:
<!--more-->
<ul>
<li><b>Label:</b> Did you know that you can provide a label to the dump? This is useful if you are running multiple dumps on one page. I almost always use a label even if I only have one dump.
<li><b>Expand:</b> By default the result of a cfdump will create a large block of data on your screen. You can use expand=false to automatically contract the data. Did you know that you can expand and collapse individual nodes of a dump just by clicking on their names?
<li><b>Top:</b> My absolute favorite attribute. Ever dumped a query and were dismayed by the 200+ rows that suddenly showed up in your browser? The top attribute lets you dump a query and restrict it to a certain number of rows. It also works on structs by preventing you from going too deep into a nested struct. In other words, for structs the top attribute references how deep the dump will go.
</ul>