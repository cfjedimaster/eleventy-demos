---
layout: post
title: "ColdFusion Yahoo Package Updated"
date: "2006-11-11T23:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/11/ColdFusion-Yahoo-Package-Updated
guid: 1649
---

I just checked in a new update to the <a href="http://cfyahoo.riaforge.org/">ColdFusion Yahoo Package</a>. This addition has a few small changes but the big addition is in Local Search. Yahoo's Local Search is pretty darn powerful. You can send in any basic query ("comic books"), along with address information in just about any form. The results are very detailed and include maps, ratings, telephone number, address, web site, etc. 

Here is some sample code from the zip:

<code>
&lt;cfset localAPI = createObject("component", "org.camden.yahoo.local")&gt;

&lt;cfset term = "comic book"&gt;
&lt;cfset zip = "70508"&gt;
&lt;cfinvoke component="#localAPI#" method="search" returnVariable="results"&gt;
	&lt;cfinvokeargument name="query" value="#term#"&gt;
	&lt;cfinvokeargument name="zip" value="#zip#"&gt;
&lt;/cfinvoke&gt;

&lt;cfoutput&gt;
&lt;h2&gt;Local search for #term#/#zip#&lt;/h2&gt;
&lt;/cfoutput&gt;

&lt;cfdump var="#results#"&gt;
</code>

For fun - try this search:

<code>
&lt;cfset term = "aliens"&gt;
&lt;cfinvoke component="#localAPI#" method="search" returnVariable="results"&gt;
	&lt;cfinvokeargument name="query" value="#term#"&gt;
	&lt;cfinvokeargument name="location" value="Roswell, NM"&gt;
&lt;/cfinvoke&gt;
</code>

I tried weapons of mass destruction in Iraq - but somehow I wasn't able to find any. (Sorry, couldn't resist.)