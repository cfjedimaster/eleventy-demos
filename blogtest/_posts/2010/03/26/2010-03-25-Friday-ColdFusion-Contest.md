---
layout: post
title: "Friday ColdFusion Contest"
date: "2010-03-26T10:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/03/26/Friday-ColdFusion-Contest
guid: 3764
---

<img src="https://static.raymondcamden.com/images/cfjedi/jedi batmansmall.gif"  title="This picture has nothing to do with the blog post." align="left" style="margin-right: 5px" /> It's been a few weeks (months?) since my last Friday ColdFusion Contest, but I had an interesting idea today while on the treadmill. The news reported that the amount of lost luggage had declined in 2009 over 2010. They reported that "11 out of a 1000" people reported lost luggage. That struct me as a bit odd as normally you see a figure in the form of "N out of 100." It then occurred to me that it must just be that the percentage is less than one percent. Most folks probably wouldn't be able to grok 0.11% at 7AM. 

<p/>

Your task today - and remember - this should take no more than five minutes - is to write a UDF that accepts a percentage value and returns a string. For percentages from 1 to 100, it should be return "N out of 100". For percentages less than 1 it should return "N out of 1000", or, if you want, make it go even deeper, for example, converting 0.001 to "1 out of 10000". (And if my math is wrong, I blame the lack of coffee!) You could also handle rounding numbers, so 5.6 becomes "6 out of 100."
<p/>

As before, I'll be giving away a 20 dollar Amazon Gift Certificate. The "winner" will be 100% arbitrary and flattery will be counted. 

<p/>

Brian Rinaldi informed me that my math is wrong. Therefore, Brian Rinaldi will never win a contest again. Thanks Brian. ;) So 11 out of 1000 is really 1.1%. So that actually adds an interesting twist. Should you convert 1.1 to "1 out of 100" (ie, round down), or "11 out of 1000"? I'm not going to answer that - but will leave it up to you guys to decide how to answer ir.

<br clear="left">