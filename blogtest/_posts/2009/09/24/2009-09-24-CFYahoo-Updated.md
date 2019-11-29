---
layout: post
title: "CFYahoo Updated"
date: "2009-09-24T14:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/24/CFYahoo-Updated
guid: 3540
---

Just a quick note that I spent some time at lunch looking at my <a href="http://cfyahoo.riaforge.org">CFYahoo</a> package. Now that Yahoo has put the <a href="http://developer.yahoo.com/coldfusion/">ColdFusion Dev Center</a> back up, I knew that I'd need to look at my CFCs. I created a backup of the current CFC package and took a look specifically at search support. It had changed quite a bit so I rewrote the CFC. Luckily Yahoo's APIs are still stupid-easy to use so this wasn't a big deal. I've decided to go ahead and update the release with new code for: Search and Weather. The other services will be upgraded over time. The package now requires ColdFusion 8. Just in case folks are curious - this is how easy it is to use the API:

<code>
&lt;cfset searchAPI = createObject("component", "org.camden.yahoo.search")&gt;

&lt;cfinvoke component="#searchAPI#" method="search" returnVariable="result"&gt;
	&lt;cfinvokeargument name="query" value="coldfusion blog"&gt;
&lt;/cfinvoke&gt;

&lt;cfdump var="#result#" label="Search for 'coldfusion blog'"&gt;
</code>

The result is a nice query you can use like any other ColdFusion query.

And here is a weather example:

<code>
&lt;cfset weatherAPI = createObject("component", "org.camden.yahoo.weather")&gt;
&lt;cfinvoke component="#weatherAPI#" method="getForecast" returnVariable="result"&gt;
	&lt;cfinvokeargument name="location" value="70508"&gt;
	&lt;cfinvokeargument name="units" value="F"&gt;
&lt;/cfinvoke&gt;

&lt;cfdump var="#result#" label="Forecast for Lafayette, LA"&gt;
</code>

And the result:

<img src="https://static.raymondcamden.com/images/Picture 187.png" />