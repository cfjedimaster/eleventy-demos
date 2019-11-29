---
layout: post
title: "Two Spry tips"
date: "2006-12-15T22:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/12/15/Two-Spry-tips
guid: 1716
---

I've got 30 minutes before my next pain pill so I'm having a bit of clarity. I thought I'd share two Spry tips that Kin and Donald (the Spry Guys) shared with me. Neither of these relate to the new 1.4 release, they are just things I missed before. I have to say, for Spry being "incomplete", it certainly has a lot in there!

Tip #1: If you want to grab a document node by id, you would typically do this in JavaScript:

<code>
var myField = document.getElementById('something');
</code>

However, Spry has supported the Prototype shortcut for a while now:

<code>
var myField = $('something');
</code>

Pretty handy shortcut.

Tip #2: When working with datasets, you may notice that Spry is smart enough to <i>not</i> make an HTTP request if you don't actually have any Spry regions on the page that make use of the dataset. Smart. But what if you want Spry to make the request anyway? Use the loadData() function on dataset:

<code>
var mydata = new Spry.Data.XMLDataSet("foo.xml","//item"); 
mydata.loadData();
</code>

Enjoy.