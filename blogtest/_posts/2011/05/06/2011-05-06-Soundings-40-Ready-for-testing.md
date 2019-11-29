---
layout: post
title: "Soundings 4.0 - Ready for testing"
date: "2011-05-06T14:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/05/06/Soundings-40-Ready-for-testing
guid: 4223
---

Soundings, available at <a href="http://soundings.riaforge.org">http://soundings.riaforge.org</a>, is a ColdFusion-based open source survey application. I'm proud to announce the 4.0 release is ready for testing. Grab the latest bits from SVN and be sure to read the readme.txt file for notes on the database change you will need to make. While I fixed a few small issues, Soundings 4 comes down to main big features.
<!--more-->
The first is conditional branching. A question can now specify two actions to take when completed:

1) Go to another question if the answer is X. This option is only available for questions with firm answers, like true/false or multiple choice.
2) Go to another question always.

Why is number 2 helpful? If you create a branch for question 1 where one answer takes you to 3 and the default behavior takes you to 2 otherwise, you can then set up question 2 to send you to 4. 

This requires some planning of course, but it seems to work well so far.

The other major feature is previewing. Some complex questions, like Matrix style questions, are hard to visualize. I've now added a "Live Preview" that renders the question <i>while you edit it</i> to give you immediate feedback on the design. Watch a vide of this here: <a href="http://www.screencast.com/t/XNOHhKbk">Preview</a>

Please send any bug reports here. That way I can keep them separate from the released product. 

I want to thank <a href="http://www.co.tulare.ca.us/">Tulare County</a>. They funded these updates and I greatly appreciate their support!