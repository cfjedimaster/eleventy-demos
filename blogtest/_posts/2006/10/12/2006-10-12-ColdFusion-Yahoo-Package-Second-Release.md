---
layout: post
title: "ColdFusion Yahoo Package - Second Release"
date: "2006-10-12T22:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/10/12/ColdFusion-Yahoo-Package-Second-Release
guid: 1585
---

I've attached the second release of the ColdFusion Yahoo Package. It now includes APIs for Traffic and Weather data. Here is a few examples.

<h2>Traffic</h2>

<code>
&lt;cfset trafficAPI = createObject("component", "org.camden.yahoo.traffic")&gt;

&lt;cfinvoke component="#trafficAPI#" method="trafficSearch" returnVariable="result"&gt;
	&lt;cfinvokeargument name="zip" value="90210"&gt;
&lt;/cfinvoke&gt;

&lt;cfdump var="#result#" label="Zip search for 90210"&gt;
</code>

<h2>Weather</h2>

Weather is a tiny bit more complex. It has 2 public methods.  One to get the current weather and one to get the forecast.

<code>
&lt;cfset weatherAPI = createObject("component", "org.camden.yahoo.weather")&gt;

&lt;cfinvoke component="#weatherAPI#" method="getWeather" returnVariable="result"&gt;
	&lt;cfinvokeargument name="location" value="70508"&gt;
	&lt;cfinvokeargument name="units" value="F"&gt;
&lt;/cfinvoke&gt;

&lt;cfdump var="#result#" label="Weather for Lafayette, LA"&gt;

&lt;cfinvoke component="#weatherAPI#" method="getForecast" returnVariable="result"&gt;
	&lt;cfinvokeargument name="location" value="70508"&gt;
	&lt;cfinvokeargument name="units" value="F"&gt;
&lt;/cfinvoke&gt;

&lt;cfdump var="#result#" label="Forecast for Lafayette, LA"&gt;
</code><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fyahoo1%{% endraw %}2Ezip'>Download attached file.</a></p>