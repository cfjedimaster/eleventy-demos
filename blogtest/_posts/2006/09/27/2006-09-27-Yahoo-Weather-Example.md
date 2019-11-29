---
layout: post
title: "Yahoo Weather API ColdFusion Example"
date: "2006-09-27T18:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/09/27/Yahoo-Weather-Example
guid: 1561
---

Yet another example, this time I'm playing with the <a href="http://developer.yahoo.com/weather/">Yahoo Weather</a> service. Unlike the other ones I blogged about - this service doesn't require a appid so you can use it pretty quickly. It also has a pretty intensive result set. Check the <a href="http://developer.yahoo.com/weather/">API</a> for a full set of what it returns, but my code barely scratches the surface of what is available. (One thing in particular that is kind of nice - the result of a zip code search returns you a longitude and latitude for your zip. That can be useful for completely non-weather related reasons.)
<!--more-->
The API lets you specify either a zip or a "Location ID", which is a Yahoo specific ID for your location. You can also specify if you want Fahrenheit or Celsius results. Switching to Celsius will make all the other units also switch to the metric system. But the cool thing about the Yahoo Weather API is that it returns you plain English names for the units. Anyway, enough talking, let me show you the code:

<code>
&lt;!--- Your Zip ---&gt;
&lt;cfset zip = "70508"&gt;

&lt;!--- Base URL for Yahoo's Weather Service ---&gt;
&lt;cfset base = "http://xml.weather.yahoo.com/forecastrss?p="&gt;

&lt;!--- Ok, now get it ---&gt;
&lt;cfhttp url="#base##zip#" result="response"&gt;

&lt;!--- parse the xml ---&gt;
&lt;cfset xmlResult = xmlParse(response.fileContent)&gt;

&lt;!--- When the report was built. ---&gt;
&lt;cfset lastUpdated = xmlResult.rss.channel.lastBuildDate.xmlText&gt;

&lt;!--- Nice description of the weather. ---&gt;
&lt;cfset description = xmlResult.rss.channel.description.xmlText&gt;

&lt;!--- Link for more information. ---&gt;
&lt;cfset link = xmlResult.rss.channel.link.xmlText&gt;

&lt;!--- units ---&gt;
&lt;cfset speed = xmlResult.rss.channel["yweather:units"].xmlAttributes.speed&gt;
&lt;cfset temp = xmlResult.rss.channel["yweather:units"].xmlAttributes.temperature&gt;
&lt;cfset distance = xmlResult.rss.channel["yweather:units"].xmlAttributes.distance&gt;
&lt;cfset pressure = xmlResult.rss.channel["yweather:units"].xmlAttributes.pressure&gt;

&lt;!--- Wind Stuff ---&gt;
&lt;cfset windChill = xmlResult.rss.channel["yweather:wind"].xmlAttributes.chill&gt;
&lt;cfset windDirection = xmlResult.rss.channel["yweather:wind"].xmlAttributes.direction&gt;
&lt;cfset windSpeed = xmlResult.rss.channel["yweather:wind"].xmlAttributes.speed&gt;

&lt;!--- Sunrise/set ---&gt;
&lt;cfset sunrise = xmlResult.rss.channel["yweather:astronomy"].xmlAttributes.sunrise&gt;
&lt;cfset sunset = xmlResult.rss.channel["yweather:astronomy"].xmlAttributes.sunset&gt;

&lt;!--- Current Info ---&gt;
&lt;cfset temperature = xmlResult.rss.channel.item["yweather:condition"].xmlAttributes.temp&gt;
&lt;cfset condition = xmlResult.rss.channel.item["yweather:condition"].xmlAttributes.text&gt;

&lt;!--- forecast ---&gt;
&lt;cfset numForecast = arrayLen(xmlResult.rss.channel.item["yweather:forecast"])&gt;
&lt;cfset forecast = arrayNew(1)&gt;
&lt;cfloop index="x" from="1" to="#numForecast#"&gt;
	&lt;cfset day = structNew()&gt;
	&lt;cfset day.date = xmlResult.rss.channel.item["yweather:forecast"][x].xmlAttributes.date&gt;
	&lt;cfset day.dow = xmlResult.rss.channel.item["yweather:forecast"][x].xmlAttributes.day&gt;
	&lt;cfset day.high = xmlResult.rss.channel.item["yweather:forecast"][x].xmlAttributes.high&gt;
	&lt;cfset day.low = xmlResult.rss.channel.item["yweather:forecast"][x].xmlAttributes.low&gt;
	&lt;cfset day.condition = xmlResult.rss.channel.item["yweather:forecast"][x].xmlAttributes.text&gt;
	&lt;cfset arrayAppend(forecast, day)&gt;
&lt;/cfloop&gt;

&lt;cfoutput&gt;
&lt;h2&gt;#description#&lt;/h2&gt;

&lt;p&gt;
Reported at: #lastUpdated#&lt;br /&gt;
Currently: #condition# / #temperature# #temp#&lt;br&gt;
Wind Chill: #windChill#&lt;br /&gt;
Wind Speed: #windSpeed# #speed#&lt;br /&gt;
Sunrise: #sunrise#&lt;br /&gt;
Sunset: #sunset#&lt;br /&gt;
&lt;/p&gt;

&lt;cfloop index="x" from="1" to="#arrayLen(forecast)#"&gt;
&lt;p&gt;
Forecast for #forecast[x].dow# #forecast[x].date#&lt;br /&gt;
Temperature: #forecast[x].low#/#forecast[x].high# #temp#&lt;br /&gt;
Conditions: #forecast[x].condition#&lt;br/&gt;
&lt;/p&gt;
&lt;/cfloop&gt;

&lt;p&gt;
For more information: &lt;a href="#link#"&gt;#link#&lt;/a&gt;
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

I'm actually not going to say a lot about this as 99% of the code is me just taking stuff out of the XML response. One thing you may notice is that this service returns an RSS feed. I'm not quite sure why it does that as the other services I've used have not. But - XML is XML I suppose. 

As I mentioned, I'm not using everything returned, but I'm using enough to provide a nice weather report. What is cool about this is the possible integration options. You could - for example - write code to check the forecast every day. If the weather is fair and warm, send out a notice that it may be a good day to play golf. Vampires will be happy to see a handy sunrise/sunset report as well. My point is - while I used a simple report, you could actually do some more complex calculations based on the weather report. (Since we all know weather reports are never wrong. Right?) 

By the way - I am planning on wrapping up my code into a Yahoo API. This code will provide you with a nice set of CFCs so you can easily add Yahoo services to your web site. My gut feeling is that this will be done sometime after my vacation.

Enjoy!