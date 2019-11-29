---
layout: post
title: "Flex Chart Gotcha"
date: "2007-02-16T15:02:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2007/02/16/Flex-Chart-Gotcha
guid: 1843
---

Ok, so Flex 2 charts rock. But - I ran into an issue yesterday that drove me mad. All I wanted was a simple bar chart. Yet nothing I tried would work right. Turns out that if you want a bar chart with one series of data (like sales of one product over the last few months) it won't work. You have to use a Column Chart. Silly me thinking that a bar chart was a bar chart! Turns out that BarChart is only used for <i>multiple</i> bars. Lesson learned. (And to be honest, I didn't really read the docs well - I skimmed.)