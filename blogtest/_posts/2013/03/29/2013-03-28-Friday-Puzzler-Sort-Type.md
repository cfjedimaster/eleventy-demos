---
layout: post
title: "Friday Puzzler: Sort Type"
date: "2013-03-29T10:03:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2013/03/29/Friday-Puzzler-Sort-Type
guid: 4894
---

Today's Friday Puzzler should be one of the simpler ones I've posted. While having a random Facebook discussion (as if there are any other sort), the topic of sorting came up. I thought it might be an interesting challenge to write code that determines if a list of data is sorted and report back on what <i>type</i> of sort was being used. While there are probably more, I can think of the following sort types:
<!--more-->
<ul>
<li>case sensitive text ascending</li>
<li>case sensitive text descending</li>
<li>case insensitive text ascending</li>
<li>case insensitive text descending</li>
<li>numeric ascending</li>
<li>numeric descending</li>
</ul>

And of course, it is possible there is no sort applied at all. Your goal is to take an input and report back the sort type. To make it easier for you, I've created a script that generates an array of inputs you can use for - well, inputs. I'm also looking for folks to try their hand at this in JavaScript. So to make that easier, I used the ColdFusion toScript function (y'all know about that, right?) to output JavaScript you can cut and paste.

<script src="https://gist.github.com/cfjedimaster/5271002.js"></script>

Enjoy!