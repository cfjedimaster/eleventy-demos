---
layout: post
title: "YouTube API CFC"
date: "2007-08-21T23:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/21/YouTube-API-CFC
guid: 2296
---

Yesterday one of my clients (<a href="http://www.roundpeg.com">roundpeg</a>) asked for a ColdFusion interface to the <a href="http://www.youtube.com/dev_docs">YouTube API</a>. This turned out to be rather simple since they made use of a REST API. From this work I was able to build a CFC to work with all the functions defined in the API. This lets you get video information, profile information, search for videos etc. Best of all - roundpeg, Inc was cool with me releasing the code. You can download the CFC below. 

Now the bad news is that YouTube will eventually be switching to a GData based API. I am <b>not</b> a fan of Google's APIs so frankly I can't see this as being a good thing - but I'll worry about that when the API is updated.

Here are some sample calls:

<code>
&lt;cfset devid = "changethis"&gt;

&lt;cfset yt = createObject("component", "youtube").init(devid)&gt;

&lt;!--- get videos by user ---&gt;
&lt;cfdump var="#yt.getVideosByUser('joerinehart')#" label="Videos by user."&gt;

&lt;!--- get music videos tagged Lush ---&gt;
&lt;cfdump var="#yt.getVideosByCategoryAndTag(10,'Lush')#" label="Lush music videos." top="10"&gt;
</code>

p.s. Note that you need to get a <a href="http://www.youtube.com/my_profile_dev">developer profile</a> and key before you use the code.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fyoutube%{% endraw %}2Ezip'>Download attached file.</a></p>