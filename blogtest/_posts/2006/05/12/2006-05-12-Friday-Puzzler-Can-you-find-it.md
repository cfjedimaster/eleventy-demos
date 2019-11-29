---
layout: post
title: "Friday Puzzler: Can you find it?"
date: "2006-05-12T12:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/12/Friday-Puzzler-Can-you-find-it
guid: 1265
---

Today's puzzle is two parter. Part one is simply <i>finding</i> the puzzle. Once you find it, part two will make sense. The puzzle is on this page.

<!--
Ok, so the idea of this puzzle is to write a script that will accept either a URL or a string as input. If the input is not a URL, then assume it is HTML source code. If the input is a URL, than you suck it down with cfhttp. Bonus points if you var scope the cfhttp result. You will scan the HTML and find all html comments. You will return this as an array.

This puzzle actually has some real world uses. You could imagine a spider that checks a site for html comments that may have been left behind by a developer. While there is nothing wrong with HTML comments, a developer could potentially leave something there that wouldn't be appropriate for the site. 
-->