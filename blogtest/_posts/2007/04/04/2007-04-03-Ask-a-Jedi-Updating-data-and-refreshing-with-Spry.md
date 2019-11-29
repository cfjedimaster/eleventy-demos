---
layout: post
title: "Ask a Jedi: Updating data and refreshing with Spry"
date: "2007-04-04T10:04:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/04/04/Ask-a-Jedi-Updating-data-and-refreshing-with-Spry
guid: 1941
---

Mark from NZ had an interesting question about Spry:

<blockquote>
I have a question regarding Spry, I have a simple dataset, one of the columns is a simple publish button, if on it displays a green image if off red etc. I was wondering if I can create an ajax call whenever the image is clicked it updates the database and dataset to show my changes. At the moment, when it is clicked it browses away from the page performs the update then a cflocation to take you back to show the changes which is a bit cumbersome. 
</blockquote>

Absolutely! First off - Spry can do calls back to the server for any number of purposes. Sending data back as a FORM post is relatively simple. First start off by reading:

<a href="http://ray.camdenfamily.com/index.cfm/2007/1/29/Doing--form-Post-in-Spry-2">Doing form posts in Spry</a>

This will cover how you can send you data updates back to the server. How do you then refresh the current dataset? The Spry Dataset object has a loadData() method that - well - loads the data. One typical use case is to tweak the URL and reload the data:

<code>
dsData.url = "/index.cfm?event=xml.starbuckisntdead";
dsData.loadData();
</code>

loadData() by itself should be all you need, but if you run into IE caching issues than you could do the old random number in the URL trick.