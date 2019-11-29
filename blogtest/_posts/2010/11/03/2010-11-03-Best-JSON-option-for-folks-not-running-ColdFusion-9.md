---
layout: post
title: "Best JSON option for folks not running ColdFusion 9"
date: "2010-11-03T11:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/11/03/Best-JSON-option-for-folks-not-running-ColdFusion-9
guid: 3998
---

For folks who have done a lot of AJAX work in ColdFusion, the ability to natively generate JSON from a CFC request has been a godsend. However, there have been many issues with the serialization of certain values. A good example of this is values like "011" turn into "11.0", which is unacceptable. There have been changes (both good and bad) in this area since 8 was released, with the <b>very</b> latest version of ColdFusion getting it near perfect. (And I don't mean ColdFusion 901, but ColdFusion 901 <a href="http://www.raymondcamden.com/index.cfm/2010/8/31/Cumulative-Hotfix-for-901-Released">with the hot fix</a> applied.) But what about folks not using ColdFusion 9 yet?

Chris emailed me earlier this week with exactly that issue. I recommended two options:

In the past, I've made use of <a href="http://www.epiphantastic.com/cfjson/">cfjson</a> by Jehiah Czebotar and Thomas Messier. I believe more than one of my open source projects make use of it. However, it hasn't been updated since February of 2008. Because of that, I also suggested Chris take a look at <a href="http://jsonutil.riaforge.org/">jsonutil</a> by Nathan Mische. Nathan is a darn smart guy (he runs <a href="http://coldfire.riaforge.org">ColdFire</a>) and his code was a good year more fresh. I asked Chris to let me know which he used and how it worked. He ended up using using jsonutil and reported that it worked great.

Not sure how many other people out there are on ColdFusion servers prior to 8 but if you have any alternate suggestions, speak up!