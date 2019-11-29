---
layout: post
title: "Best of ColdFusion 10: HTML Email Utility"
date: "2012-05-24T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/05/24/Best-of-ColdFusion-10-HTML-Email-Utility
guid: 4628
---

Welcome to the first installment of my reviews of entries in the <a href="http://www.raymondcamden.com/index.cfm/2012/2/29/Best-of-Adobe-ColdFusion-10-Beta-Contest">Best of ColdFusion 10</a> contest. If you attended cfObjective last week, then you know this ended up as a good news/bad news type situation. The number of entries were relatively low - 4. The quality of the entries though were high. Personally - I do these contests because I love to see what people build. It's fun. So no matter how many people find the time to participate, I consider it a net win for all of us. With that out of the way, let's look at our first entry, the HTML Email Utility by some dude named <a href="http://www.bennadel.com/">Ben Nadel</a>.
<!--more-->
If you've ever worked in HTML email, then you are well aware of the serious limitations imposed on you in regards to styling your content. HTML email is so limited it makes IE6 look like a sexy browser. One of the most critical things you can't do in HTML email is supply a style sheet. So instead of having a nice block of CSS declarations, you must use inline style sheets.

Ben's utility attempts to simplify this. You provide it "good" HTML (with a style sheet) and it rewrites it to make use of inline styles. This is done using the <a href="http://jsoup.org/">jsoup</a> library I mentioned before. It makes use of ColdFusion 10's easy Java library loading to include the bits.

<script src="https://gist.github.com/2781836.js?file=gistfile1.txt"></script>

He also makes good use of closures within his processing code. Here's a random sample.

<script src="https://gist.github.com/2781853.js?file=gistfile1.txt"></script>

Overall - I think this is an incredibly practical application and something I can see using in the future. Want to try it? You can hit the Demo button below to run it on my server. You can also watch a demo video Ben created <a href="http://screencast.com/t/HaraSkHbF8">here</a> and get the code from his Github repo <a href="https://github.com/bennadel/Best-Of-ColdFusion-10">here</a>.

<a href="http://www.raymondcamden.com/demos/2012/may/24/"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>