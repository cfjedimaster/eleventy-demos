---
layout: post
title: "Tracking the storm (with ColdFusion!)"
date: "2008-08-28T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/28/Tracking-the-storm-with-ColdFusion
guid: 2992
---

Ok, so yesterday I <a href="http://www.raymondcamden.com/index.cfm/2008/8/27/Death-is-a-giant-brightlycovered-slug-heading-your-way">joked</a> a bit about Gustav (which, by the way, is now <a href="http://www.nhc.noaa.gov/refresh/graphics_at2+shtml/111213.shtml?hwind120#contents">tracking</a> closer to Lafayette) and about writing some ColdFusion code to track the hurricane. Being the OCD-natured kind of boy I am, I whipped up something in ColdFusion that seems to work well. Here is what I did...
<!--more-->
I began by grabbing the feed data for Gustav:

<code>
&lt;cfset gustavXML = "http://www.nhc.noaa.gov/nhc_at2.xml"&gt;
&lt;cffeed source="#gustavXML#" query="results"&gt;
</code>

Next (and I should be clear, the full code is at the bottom and has more error checking in it) I used query of query to find the first entry with <i>Tropical Storm GUSTAV Public Advisory Number</i> in the title:

<code>
&lt;!--- find "Public Advisory" ---&gt;
&lt;cfquery name="pa" dbtype="query" maxrows="1"&gt;
select	rsslink, content, title
from	results
where	title like 'Tropical Storm GUSTAV Public Advisory Number%'
&lt;/cfquery&gt;
</code>

NOAA's RSS feed entries don't have much content in them - they mainly just link to the full text, so I retrieve the content next:

<code>
&lt;cfhttp url="#pa.rsslink#" result="result"&gt;
&lt;cfset text = result.fileContent&gt;
</code>

Ok, now comes the pain in the rear part. If the feed looks like I assume it will (and that's <b>not</b> a good assumption) then it will have this text:

<blockquote>
<p>CENTER OF TROPICAL STORM GUSTAV WAS LOCATED NEAR LATITUDE</p>
</blockquote>

So I wrote up a regex that attempts to find the longitude and latitude from the text:

<code>
&lt;!--- strip extra white space ---&gt;
&lt;cfset text = reReplace(text, "[\r\n]+", " ", "all")&gt;

&lt;cfset regex = "CENTER OF TROPICAL STORM GUSTAV WAS LOCATED NEAR LATITUDE ([[:digit:]\.]+)[[:space:]]*([NORTH{% raw %}|SOUTH|{% endraw %}EAST{% raw %}|WEST]+)...LONGITUDE ([[:digit:]\.]+)[[:space:]]*([NORTH|{% endraw %}SOUTH{% raw %}|EAST|{% endraw %}WEST]+)"&gt;

&lt;!--- now look for: THE CENTER OF TROPICAL STORM GUSTAV WAS LOCATED NEAR LATITUDE 19.1 NORTH...LONGITUDE 74.4 WEST ---&gt;
&lt;cfset match = reFind(regex, text, 1, true)&gt;
&lt;cfif arrayLen(match.pos) is 5&gt;
	&lt;cfset long = mid(text, match.pos[2], match.len[2])&gt;
	&lt;cfset longdir = mid(text, match.pos[3], match.len[3])&gt;
	&lt;cfset lat = mid(text, match.pos[4], match.len[4])&gt;
	&lt;cfset latdir = mid(text, match.pos[5], match.len[5])&gt;

	&lt;cfoutput&gt;
	Gustav Lat: #lat# #latdir#&lt;br /&gt;
	Gustav Long: #long# #longdir#&lt;br /&gt;
	&lt;/cfoutput&gt;
</code>

So there isn't anything too complex in here. You can see I'm using subexpressions to grab the values I want. I get the directions too but they aren't really necessary since the numeric values tell you all you need. Again, ignore the fact that I have a missing &lt;cfelse&gt; there - I'm just skipping over the error handling for now.

Ok, so that was the hard part. Now I need the longitude and latitude for Lafayette. I could use the Yahoo <a href="http://developer.yahoo.com/weather/">Weather API</a> for this. The weather results include longitude and latitude information. Since they use a simple REST interface (hey Google, Yahoo called, they want to talk about writing APIs that developers actually enjoy using) I could have just opened up the feed in my browser and copied the values. Instead though I made it dynamic:

<code>
&lt;cfset zip = 70508&gt;
&lt;cfoutput&gt;&lt;p/&gt;Getting #zip#&lt;br /&gt;&lt;/cfoutput&gt;
&lt;cfflush&gt;
&lt;cfhttp url="http://weather.yahooapis.com/forecastrss?p=#zip#" result="result"&gt;
&lt;cfset content = xmlParse(result.fileContent)&gt;
&lt;cfset geo = xmlSearch(content, "//geo:*")&gt;
&lt;cfloop index="g" array="#geo#"&gt;
	&lt;cfif g.xmlName is "geo:lat"&gt;
		&lt;cfset myLat = g.xmlText&gt;
	&lt;cfelseif g.xmlName is "geo:long"&gt;
		&lt;cfset myLong = g.xmlText&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

This is fairly typical XML parsing using xmlSearch. I could have used my <a href="http://cfyahoo.riaforge.org">CFYahoo</a> package but I wanted a quick and dirty script.

Ok, now all the hard work is done. Serious! All I need to do is get a function to generate the distance between two zips. Once again, CFLib comes to the rescue: <a href="http://www.cflib.org/udf/LatLonDist">LatLonDist</a>. So the last portion is rather simple:

<code>
&lt;cfset distance = latLonDist(lat,long,myLat,myLong,"sm")&gt;

&lt;cfoutput&gt;&lt;p/&gt;&lt;b&gt;Distance:&lt;/b&gt; #numberFormat(distance,"9.99")# miles&lt;/cfoutput&gt;
</code>

Surprisingly, the code actually works, and worked fine from last night till tonight. My main concern is the string parsing, but so far, so good. Now for the real fun part. I added some simple logging to the script. I'm going to use my localhost scheduler to run the script every 4 hours. I'll then write a script to parse the log and see how the distance changes between now and Tuesday, or as I call it, Get the Hell Out of Dodge Day. 

Anyway, here is the final script with error handling, logging, etc. Enjoy.

<code>
&lt;cfscript&gt;
/**
 * Calculates the distance between two latitudes and longitudes.
 * This funciton uses forumlae from Ed Williams Aviation Foundry website at http://williams.best.vwh.net/avform.htm.
 * 
 * @param lat1 	 Latitude of the first point in degrees. (Required)
 * @param lon1 	 Longitude of the first point in degrees. (Required)
 * @param lat2 	 Latitude of the second point in degrees. (Required)
 * @param lon2 	 Longitude of the second point in degrees. (Required)
 * @param units 	 Unit to return distance in. Options are: km (kilometers), sm (statute miles), nm (nautical miles), or radians.  (Required)
 * @return Returns a number or an error string. 
 * @author Tom Nunamaker (&#116;&#111;&#109;&#64;&#116;&#111;&#115;&#104;&#111;&#112;&#46;&#99;&#111;&#109;) 
 * @version 1, May 14, 2002 
 */
function LatLonDist(lat1,lon1,lat2,lon2,units) {
  // Check to make sure latitutdes and longitudes are valid
  if(lat1 GT 90 OR lat1 LT -90 OR
     lon1 GT 180 OR lon1 LT -180 OR
     lat2 GT 90 OR lat2 LT -90 OR
     lon2 GT 280 OR lon2 LT -280) {
    Return ("Incorrect parameters");
  }

  lat1 = lat1 * pi()/180;
  lon1 = lon1 * pi()/180;
  lat2 = lat2 * pi()/180;
  lon2 = lon2 * pi()/180;
  UnitConverter = 1.150779448;  //standard is statute miles
  if(units eq 'nm') {
    UnitConverter = 1.0;
  }
  
  if(units eq 'km') {
    UnitConverter = 1.852;
  }
  
  distance = 2*asin(sqr((sin((lat1-lat2)/2))^2 + cos(lat1)*cos(lat2)*(sin((lon1-lon2)/2))^2));  //radians
  
  if(units neq 'radians'){
    distance = UnitConverter * 60 * distance * 180/pi();
  }
  
  Return (distance) ;
}

&lt;/cfscript&gt;
&lt;!--- quickie log func ---&gt;
&lt;cffunction name="logit" output="false" returnType="void"&gt;
	&lt;cfargument name="str" type="string" required="true"&gt;
	&lt;cflog file="gustav" text="#arguments.str#"&gt;
&lt;/cffunction&gt;

&lt;!--- Lafayette, LA ---&gt;
&lt;cfset zip = 70508&gt;

&lt;cfset gustavXML = "http://www.nhc.noaa.gov/nhc_at2.xml"&gt;
&lt;cffeed source="#gustavXML#" query="results"&gt;

&lt;cfif not results.recordCount&gt;
	&lt;cfset logit("Error - no feed entries")&gt;
	&lt;cfoutput&gt;No feed entries.&lt;/cfoutput&gt;
	&lt;cfabort&gt;
&lt;/cfif&gt;

&lt;!--- find "Public Advisory" ---&gt;
&lt;cfquery name="pa" dbtype="query" maxrows="1"&gt;
select	rsslink, content, title
from	results
where	title like 'Tropical Storm GUSTAV Public Advisory Number%'
&lt;/cfquery&gt;

&lt;cfif not pa.recordCount&gt;
	&lt;cfset logit("Error - cound't find a matching entry")&gt;
	&lt;cfoutput&gt;Couldn't find an entry that matched my criteria.&lt;/cfoutput&gt;
	&lt;cfabort&gt;
&lt;/cfif&gt;

&lt;cfoutput&gt;
Parsing data from: &lt;b&gt;#pa.title#&lt;/b&gt;&lt;br /&gt;
&lt;/cfoutput&gt;
&lt;cfflush /&gt;
&lt;cfhttp url="#pa.rsslink#" result="result"&gt;
&lt;cfset text = result.fileContent&gt;

&lt;!--- strip extra white space ---&gt;
&lt;cfset text = reReplace(text, "[\r\n]+", " ", "all")&gt;

&lt;cfset regex = "CENTER OF TROPICAL STORM GUSTAV WAS LOCATED NEAR LATITUDE ([[:digit:]\.]+)[[:space:]]*([NORTH{% raw %}|SOUTH|{% endraw %}EAST{% raw %}|WEST]+)...LONGITUDE ([[:digit:]\.]+)[[:space:]]*([NORTH|{% endraw %}SOUTH{% raw %}|EAST|{% endraw %}WEST]+)"&gt;

&lt;!--- now look for: THE CENTER OF TROPICAL STORM GUSTAV WAS LOCATED NEAR LATITUDE 19.1 NORTH...LONGITUDE 74.4 WEST ---&gt;
&lt;cfset match = reFind(regex, text, 1, true)&gt;
&lt;cfif arrayLen(match.pos) is 5&gt;
	&lt;cfset long = mid(text, match.pos[2], match.len[2])&gt;
	&lt;cfset longdir = mid(text, match.pos[3], match.len[3])&gt;
	&lt;cfset lat = mid(text, match.pos[4], match.len[4])&gt;
	&lt;cfset latdir = mid(text, match.pos[5], match.len[5])&gt;

	&lt;cfoutput&gt;
	Gustav Lat: #lat# #latdir#&lt;br /&gt;
	Gustav Long: #long# #longdir#&lt;br /&gt;
	&lt;/cfoutput&gt;
&lt;cfelse&gt;
	&lt;cfset logit("Error - couldn't find my matches in the string")&gt;
	&lt;cfoutput&gt;Couldn't find my matches in the string.&lt;/cfoutput&gt;
	&lt;cfabort&gt;
&lt;/cfif&gt;

&lt;cfoutput&gt;&lt;p/&gt;Getting #zip#&lt;br /&gt;&lt;/cfoutput&gt;
&lt;cfflush&gt;
&lt;cfhttp url="http://weather.yahooapis.com/forecastrss?p=#zip#" result="result"&gt;
&lt;cfset content = xmlParse(result.fileContent)&gt;
&lt;cfset geo = xmlSearch(content, "//geo:*")&gt;
&lt;cfloop index="g" array="#geo#"&gt;
	&lt;cfif g.xmlName is "geo:lat"&gt;
		&lt;cfset myLat = g.xmlText&gt;
	&lt;cfelseif g.xmlName is "geo:long"&gt;
		&lt;cfset myLong = g.xmlText&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;

&lt;!--- only continue if we have our own stuff ---&gt;
&lt;cfif not isDefined("myLat") or not isDefined("myLong")&gt;
	&lt;cfset logit("Error - no geo data for #zip#")&gt;	
	&lt;cfoutput&gt;No data for #zip#&lt;/cfoutput&gt;
	&lt;cfabort /&gt;
&lt;/cfif&gt;

&lt;cfoutput&gt;
#zip# lat: #myLat#&lt;br /&gt;
#zip# long: #myLong#&lt;br /&gt;
&lt;/cfoutput&gt;

&lt;cfset distance = latLonDist(lat,long,myLat,myLong,"sm")&gt;

&lt;cfset logit("distance:#distance#")&gt;
&lt;cfoutput&gt;&lt;p/&gt;&lt;b&gt;Distance:&lt;/b&gt; #numberFormat(distance,"9.99")# miles&lt;/cfoutput&gt;
</code>