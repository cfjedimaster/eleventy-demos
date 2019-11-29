---
layout: post
title: "Ratings added to CFLib"
date: "2008-12-30T11:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/30/Ratings-added-to-CFLib
guid: 3168
---

This morning I pushed up ratings to CFLib. CFLib used to have ratings some time ago, so this is actually an old feature coming back. I used the same jQuery plugin that <a href="http://www.slidesix.com">SlideSix</a> uses (<a href="http://php.scripts.psu.edu/rja171/widgets/rating.php">http://php.scripts.psu.edu/rja171/widgets/rating.php</a>). To be honest, I really don't like this plugin. Turning off the cancel was a pain in the rear. I would have used the <a href="http://labs.adobe.com/technologies/spry/articles/rating_overview/index.html">Spry rating widget</a> instead, but I really wanted to give jQuery ratings a try. At the end of the day though it works, so I'll leave it be. One nice thing about it though - I can pass it a rating value of X.2 and it rounds it down to X starts. Pass it X.5 and it correctly shows a half star.

Later this week I'll be adding a right hand list of the top rated UDFs.

Oh, and in case folks are curious, I did <b>not</b> add any protection from multiple voting. I originally used code that stored your rankings in a session variable. I turned that off during testing and didn't bother re-enabling it. I figure it someone is so bored they want to cheat their UDF up, more power to em. ;)