---
layout: post
title: "High Ascii strikes again (with CFMAP)"
date: "2010-09-18T13:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/09/18/High-Ascii-strikes-again-with-CFMAP
guid: 3945
---

I was diagnosing an issue with the maps feature at <a href="http://groups.adobe.com">Adobe Groups</a>. For some reason the map simply stopped working. No CF error - nothing odd in the source - but the map didn't render. The basic logic of the map is to simply loop over all the groups with geolocation data and add them as markers. To debug, I simply switched from looping over <i>all</i> the rows to looping over 50 at a time. Doing that I was able to find a range that caused the map to not display. I then slowly shrunk this down to one record and finally one string. At this point I began to wonder if some odd character was breaking the map. Nothing looked wrong, but I've seen this in the past with other applications. Here is the code I used to look for the character.

<p/>

<code>
&lt;cfset str =  g.getAddress() &gt;
&lt;cfloop index="c" from="1" to="#len(str)#"&gt;
	&lt;cfset char = mid(str, c, 1)&gt;
	&lt;cfoutput&gt;#char#=#asc(char)#&lt;br&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

<p/>

This code loops over every character and prints out the ascii code for each. Check out the result:

<p/>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-09-18 at 11.54.39 AM.png" />

<p/>

Yeah, see it? I wrapped up a call to the <a href="http://www.bennadel.com/blog/1155-Cleaning-High-Ascii-Values-For-Web-Safeness-In-ColdFusion.htm">UDF that Ben Nadel</a> wrote and it helped right away.