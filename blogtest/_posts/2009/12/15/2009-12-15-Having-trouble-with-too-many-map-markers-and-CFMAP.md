---
layout: post
title: "Having trouble with too many map markers and CFMAP?"
date: "2009-12-15T21:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/15/Having-trouble-with-too-many-map-markers-and-CFMAP
guid: 3651
---

About a few months ago a user contacted me with an odd issue with CFMAP. At random times the markers on the map refused to load. Actually they returned the rather odd error that the address didn't exist. Here is an example:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 510.png" />

When I tested this myself I saw the same - even when I replaced the test addresses with ones I knew existed (like my own!). Unfortunately I wasn't able to help the user so I wished him luck and forgot about it. 

A few days ago I got another email from someone experiencing the exact same issue. This time I decided to dig a bit deeper. I opened up Firebug and took a look at the requests. I noticed something odd. When the code made a geocoding request (ie, translate address so and so to longitude and latitude x and y), the result was different for addresses that failed to work. The result code was 620. After a quick Google search I found <a href="http://code.google.com/apis/maps/documentation/reference.html#GGeoStatusCode">this list</a> of geocode status results and <b>bam</b> - I found what 620 meant:

<blockquote>
The given key has gone over the requests limit in the 24 hour period or has submitted too many requests in too short a period of time. If you're sending multiple requests in parallel or in a tight loop, use a timer or pause in your code to make sure you don't send the requests too quickly. 
</blockquote>

If you look at the code ColdFusion generates for the map you can see that all of the geocode requests are run immediately. This then makes sense why the error would occur. You can see this yourself with the following code:

<code>
&lt;cfset addresses = [
"1802 San Pedro Avenue, Victoria BC",
"1804 San Pedro Avenue, Victoria BC",
"1810 San Pedro Avenue, Victoria BC",
"1816 Feltham, Victoria BC",
"1821 San Pedro Avenue, Victoria BC",
"1823 San Pedro Avenue, Victoria BC",
"1826 Feltham, Victoria BC",
"1835 San Pedro Avenue, Victoria BC",
"1837 San Pedro Avenue, Victoria BC",
"1883 San Juan, Victoria BC",
"1888 Feltham, Victoria BC",
"1904 San Juan, Victoria BC",
"1909 San Juan, Victoria BC",
"1913 San Pedro Avenue, Victoria BC",
"1921 San Fernando Pl, Victoria BC",
"1972 San Rafael Cres, Victoria BC",
"4090 San Capri Terrace, Victoria BC",
"4098 San Capri Terrace, Victoria BC",
"4101 San Capri Terrace, Victoria BC",
"4110 Cortez Place, Victoria BC",
"4120 Gordon Head Rd, Victoria BC",
"4123 Cortez Ct, Victoria BC",
"4151 San Mateo Place, Victoria BC"
]&gt;

&lt;cfmap centeraddress="1802 San Pedro Avenue, Victoria BC" zoomlevel="15" height="600" width="800"&gt;
    &lt;cfloop index="m" array="#addresses#"&gt;
        &lt;cfmapitem address="#m#"&gt;
    &lt;/cfloop&gt;
&lt;/cfmap&gt;
</code>

Run this a few times and you will get errors on random addresses. Ok, so now that we know the bug involves geocoding, how can we fix it? Well one way would be to geocode the addresses ourselves in a separate process. I've got a CFC for that (<a href="http://googlegeocode.riaforge.org/">Google Geocode</a>) but it too will return an error if you try to geocode too many addresses at once. 

The following code runs through the addresses and caches the result in the application scope. I'd probably recommend storing the geocodes in a database instead. Also note the use of sleep(). The number there (500 ms) was a pure guess but it seemed to work fine. If you wanted to be 100% rock solid, you could use a scheduled task to geocode addresses in the background. If an address fails one time it will (probably) get geocoded the next time. 

Anyway, I hope this helps and I'm certainly glad I solved this mysery! (Note, in the code sample below I left off the array of addresses. They are the same as the code block above.)

<code>
&lt;cfif not structKeyExists(application, "longlat")&gt;
    &lt;cfset application.longlat = {}&gt;
&lt;/cfif&gt;

&lt;cfset geo = createObject("component", "googlegeocode")&gt;
&lt;cfset key = "your google maps key goes here"&gt;
&lt;cfloop index="m" array="#addresses#"&gt;
    &lt;cfif not structKeyExists(application.longlat, m)&gt;
	    &lt;cfset result = geo.geocode(key,trim(m))&gt;
	    &lt;cfset sleep(500)&gt;
		&lt;cfset application.longlat[m] = {% raw %}{longitude=result.longitude, latitude=result.latitude}{% endraw %}&gt;
    &lt;/cfif&gt;
&lt;/cfloop&gt;

&lt;cfmap centeraddress="1802 San Pedro Avenue, Victoria BC" zoomlevel="15" height="600" width="800"&gt;
    &lt;cfloop index="x" from="1" to="#arrayLen(addresses)#"&gt;
        &lt;cfset m = application.longlat[addresses[x]]&gt;
        &lt;cfmapitem address="#m#"&gt;
	&lt;cfmapitem latitude="#m.latitude#" longitude="#m.longitude#" tip="#addresses[x]#"&gt;
    &lt;/cfloop&gt;
&lt;/cfmap&gt;
</code>