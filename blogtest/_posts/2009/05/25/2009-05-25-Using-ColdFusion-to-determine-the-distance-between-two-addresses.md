---
layout: post
title: "Using ColdFusion to determine the distance between two addresses"
date: "2009-05-25T13:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/05/25/Using-ColdFusion-to-determine-the-distance-between-two-addresses
guid: 3369
---

I'm not sure this is extremely accurate, or useful, but I've wanted to write up a quick demo on this for a while, so today was the day. The question is simple. Given two addresses, is it possible to find the distance between them? Since the answer to "Can you do X in ColdFusion" is always yes (warning, I may be a bit biased), here is the code I used to demonstrate this.
<!--more-->
First off, we need to make use of two resources. The first is the <a href="http://cfyahoo.riaforge.org/">ColdFusion Yahoo Package</a>, a collection of CFC wrappers for Yahoo web services. One of them in particular: geoCoding. The geoCoding service lets you pass in an address (or even just a zip) and it will return geographical information. The important bits are longitude and latitude. 

Once we have that, we can then calculate an <u>estimated</u> distance between the two long/lat values. I used <a href="http://www.cflib.org/udf/LatLonDist">LatLonDist</a> from CFLib. There are other ways to do this and I'll specifically call out <a href="http://www.bennadel.com/blog/1489-Finding-The-Distance-Between-Latitude-Longitude-Locations-In-ColdFusion.htm">Ben Nadel's example</a> as an alternative.

Ok, so once we have that, how can we combine the two tools? Consider the following demo:

<code>
&lt;cfset geoAPI = createObject("component", "org.camden.yahoo.geocoding")&gt;

&lt;cfset address1 = "403 Robinhood Circle, Lafayette, LA 70508"&gt;
&lt;cfset address2 = "1835 73rd Ave NE, Medina, WA 98039"&gt;

&lt;cfset geodetails1 = geoAPI.geoSearch(location=address1)&gt;
&lt;cfset geodetails2 = geoAPI.geoSearch(location=address2)&gt;

&lt;cfset distance = latLonDist(geodetails1.latitude, geodetails1.longitude, geodetails2.latitude, geodetails2.longitude,'sm')&gt;

&lt;cfoutput&gt;Distance between #address1# and #address2# is #numberFormat(distance,"9.9")# miles.&lt;/cfoutput&gt;
</code>

First off, let me be sure folks note that the UDF is <i>not</i> included in the code block above. I wanted to minimize the example as much as possible, so if you wanted to run this code as is, you would need to copy the source from CFLib first. You would also need to ensure the CFYahoo package was downloaded and available via the org mapping. Outside of that though the code is trivial. I've got my two addresses, both of which are passed to the geocoding CFC. This returns a structure that includes the longitude and latitude. Once I have them, I pass them to the UDF and ask for the result in statute miles. 

The demo addresses give me a result of 2000.1 miles. That's a bit too precise so I did a quick test on Google Maps. Using driving directions, it gave me a result of 2907 miles. I noticed the path though wasn't exactly a straight line:

<img src="https://static.raymondcamden.com/images//Picture 158.png">

Not sure if this is useful or not, but enjoy.