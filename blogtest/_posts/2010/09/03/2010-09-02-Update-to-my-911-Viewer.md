---
layout: post
title: "Update to my 911 Viewer"
date: "2010-09-03T08:09:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/09/03/Update-to-my-911-Viewer
guid: 3931
---

Way back in January of this year I <a href="http://www.raymondcamden.com/2010/01/19/Proof-of-Concept-911-Viewer">blogged</a> about a little experiment I did parsing local traffic-related incidents in my home town. A local police department had posted their data in HTML and I used a combination of YQL and ColdFusion to parse it. This was done via a simple scheduled task. A second task turned street addresses into longitude and latitude pairs. Finally I made use of cfmap to display the results. All in all, I think it was pretty cool. The results matched with what I would have assumed were the busiest streets. But yesterday I discovered something cool. Apparently I left the process on and it ran for <b>six months</b>.
<!--more-->
For all that time ColdFusion was hitting and scraping the data, cleaning it and importing it into my database. I did a quick SQL to count the number of rows and found I had a bit over 8.5K. I whipped up a quick report template and I thought I'd share the results. Again - this is traffic incident data for Lafayette, LA. A larger city would probably have more. Anyway, first I began with a simple table of general stats:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-09-03 at 7.00.48 AM.png" />

Next I displayed how many incidents happened per day. No big surprises here - Sunday is the safest day to drive.

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-09-03 at 7.01.41 AM.png" />

The per hour chart is also as you expect - a sharp rise as soon as the afternoon rush hour appears. 

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-09-03 at 7.02.40 AM.png" />

Now for the big pie chart. This one displays the amount of incidents per type. My favorite is "Hazardous Situation":

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-09-03 at 7.04.16 AM.png" />

Next I reported on unique street addresses. I didn't imagine I'd see a lot on any particular address (street, yes, actual address, no), but I was pretty surprised:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-09-03 at 7.05.34 AM.png" />

What's awesome is if you <a href="http://maps.google.com/maps?f=q&source=s_q&hl=en&q=&vps=1&jsv=271c&sll=37.0625,-95.677068&sspn=42.089199,93.076172&ie=UTF8&geocode=Ff1UzQEdE8CC-g&split=0">map that top address</a> you see it is right between a school and an insurance company:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-09-03 at 7.06.59 AM.png" title="You can't make this stuff up." />

Awesome. I then wrote a quick SQL statement that tried to get just the street. It isn't perfect, but this is what I used: 


select mid(address, locate(' ', address)+1, length(address)) as thestreet, count( mid(address, locate(' ', address)+1, length(address))) as total<br/>
from data<br/>
group by  mid(address, locate(' ', address)+1, length(address))<br/>
order by  count(mid(address, locate(' ', address)+1, length(address))) desc<br/>
limit 0,10

And here is the result:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-09-03 at 7.08.37 AM.png" />

Finally, for the heck of it, I used SQL to find the average longitude and latitude of all 8600+ incidents to map out the most dangerous spot in Lafayette. Before anyone says it - yeah - I know that's not really accurate, but it was fun as heck. 

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-09-03 at 7.10.17 AM.png" />

All of this was fun - but really unnecessary. Back in January when I first built this, I contacted the police department via their web site to ask about an XML export, but I never heard back.

<b>Edit</b> Thanks to Jason Fisher for the idea and Andrew Powell for the help. I uploaded my data to <a href="http://www.spatialkey.com">SpatialKey</a> and created a few heat maps. Their service is <b>amazing</b>. The following thumbnails link to larger images (very large, so click with caution on a mobile device). I just spent a few minutes on this so I'm sure the tool could be used better than what I did, but I'm incredibly impressed by the product.

<a href="http://www.coldfusionjedi.com/images/sk/getimage1.png"><img src="https://static.raymondcamden.com/images/cfjedi/sk/getimage1_thumb.png" title="Click for huge image"></a>

<a href="http://www.coldfusionjedi.com/images/sk/getimage2.png"><img src="https://static.raymondcamden.com/images/cfjedi/sk/getimage2_thumb.png" title="Click for huge image"></a>

<a href="http://www.coldfusionjedi.com/images/sk/getimage3.png"><img src="https://static.raymondcamden.com/images/cfjedi/sk/getimage3_thumb.png" title="Click for huge image"></a>