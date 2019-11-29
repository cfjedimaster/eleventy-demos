---
layout: post
title: "Interesting display bug with CF8 HTML Grid"
date: "2007-12-03T15:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/03/Interesting-display-bug-with-CF8-HTML-Grid
guid: 2511
---

Just a quick note to point out a small display bug with CF8's HTML grid. If - and only if - you use an inline query to populate the grid instead of pointing to a URL, your data may not display correctly. Specifically, I had data with a \ in it (a file path), and on display the \ was removed. I hacked around the issue by just changing my paths to use /, which still leaves the data quite readable. Again - this error only occurs if you pass the data directly to the grid instead of using a binding.