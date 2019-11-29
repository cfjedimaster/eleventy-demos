---
layout: post
title: "WebCharts3D Editor in Eclipse"
date: "2009-09-14T13:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/14/WebCharts3D-Editor-in-Eclipse
guid: 3525
---

Wow, this is pretty cool. While researching ColdBox this morning I ran across a <b>very</b> cool thing - apparently the WebCharts folks created an Eclipse plugin to aid in your chart editing. More details may be found <a href="http://www.gpoint.com/website/WebCharts50/products/eclipse.jsp">here</a>. This allows you to edit charts directly in Eclipse as opposed to running the BAT/sh file at the command line.

Installation proved a bit tricky for me. On my Snow Leopard Mac, the plugin never worked. Period. On my Windows 7 laptop, it worked in ColdFusion Builder. On my Mac laptop that isn't running Snow Leopard, it didn't work with ColdFusion Builder but did work with my vanilla Eclipse install.

Once you get it working then you can create a new Chart project by using the New/Other menu. There should be a new WebCharts3D option:

<img src="https://static.raymondcamden.com/images/Picture 186.png" />

You can create the project anywhere - I just saved it in my web root. I picked the first web chart and then it loaded the preview directly in Eclipse. I had to enable the General/Properties window to allow me to edit the chart, but once I did, I was able to edit the chart to meet my stringent design requirements:

<b>First the chart preview:</b><br>
<img src="https://static.raymondcamden.com/images/cfjedi/Picture 258.png" />

<b>Properties pane:</b><br>
<img src="https://static.raymondcamden.com/images/cfjedi/Picture 338.png" />

Pretty cool I think - and hopefully the lack of support on my Mac ColdFusion Builder will be corrected in a later build.