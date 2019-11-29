---
layout: post
title: "FeedBurner CFC"
date: "2007-08-24T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/24/FeedBurner-CFC
guid: 2302
---

I've been using FeedBurner for quite sometime now to host my RSS feeds, and when they bought Blogbeat, I was even happier since Blogbeat was a great blog-stats tool. Now I get both feed and general item stats all from one source. FeedBurner has an API to retrieve information about your stats so I decided to wrap up some of the API into a nice little CFC. FeedBurner.cfc supports getting both general feed data as well as item data. For example:

<code>
&lt;cfset fb = createObject("component", "feedburner")&gt;
&lt;cfdump var="#fb.getFeedData('RaymondCamdensColdFusionBlog')#" label="No date, will be yesterday"&gt;
</code>

This will retrieve the most current stats from the API, which will be yesterday. To get a week of data:

<code>
&lt;cfset date = dateAdd("d", -8, now())&gt;
&lt;cfset last7 = fb.getFeedData(uri='RaymondCamdensColdFusionBlog',dateBegin=date)&gt; 
&lt;cfdump var="#last7#" label="7 Days of Info"&gt;
</code>

And finally last month:

<code>
&lt;cfset date = dateAdd("m", -1, now())&gt;
&lt;cfset dateBegin = createDate(year(date), month(date), 1)&gt;
&lt;cfset dateEnd = createDate(year(date), month(date), daysInMonth(date))&gt;

&lt;cfset lastm = fb.getFeedData(uri='RaymondCamdensColdFusionBlog',dateBegin=dateBegin,dateEnd=dateEnd)&gt; 
&lt;cfdump var="#lastm#" label="Last Month"&gt;
</code>

This data then can easily be dumped into a chart:

<img src="https://static.raymondcamden.com/images/fbstats.png">

Here is a live <a href="http://www.coldfusionjedi.com/demos/fbdemo/test.cfm">demo</a>.

Along with general feed stats you can get information about individual URLs and their stats over time:

<code>
&lt;cfdump var="#fb.getItemData('RaymondCamdensColdFusionBlog')#" label="No date, will be yesterday"&gt;

&lt;cfset date = dateAdd("d", -8, now())&gt;
&lt;cfset last7 = fb.getItemData(uri='RaymondCamdensColdFusionBlog',dateBegin=date)&gt; 

&lt;cfquery name="getTop" dbtype="query"&gt;
select	sum(clickthroughs) as ctsum, sum(itemviews) as itsum, downloads, title, url
from last7
group by url, title, downloads
order by itsum desc, ctsum desc
&lt;/cfquery&gt;

&lt;cfdump var="#getTop#" top="100"&gt;
</code>

This code shows first getting data from yesterday and getting last week. I then do a query of query so I can find my top entries. If you want to see a live dump of this, please visit this <a href="http://www.coldfusionjedi.com/demos/fbdemo/test2.cfm">demo</a>.

The CFC, along with sample code, is attached below. A warning first though before you download - and a funny story. FeedBurner gives you nice control over the dates you can retrieve when fetching data. On a whim I was testing a date range of today to 1900. Yes, 1900. And the API worked. Well, technically it worked too well - I couldn't get it to retrieve as it took to long. I then switched to 1990 and yep - it fed me stats.

Now for the fun part - apparently my site had a few downloads in 1990. Back when I was a Junior in high school (and I was the coolest kid at my high school, seriously). I'm assuming this is a bug... but it's certainly an odd bug.  

Another bug is that my item stats for yesterday appear to be randomly returning no records at times. If I had to guess, I'd say they have a cluster and one machine is fetching old data. 

Anyway - I've posted to their forums on both issues. Let me know if you find this useful.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ffeedburnercfc2%{% endraw %}2Ezip'>Download attached file.</a></p>