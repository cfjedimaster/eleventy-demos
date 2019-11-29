---
layout: post
title: "Building the map view for Adobe Groups"
date: "2010-06-22T19:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/06/22/Building-the-map-view-for-Adobe-Groups
guid: 3859
---

<img src="https://static.raymondcamden.com/images/cfjedi/aug-map-4.png" align="left" style="margin-right: 5px" /> Earlier this month I pushed up a new feature to the <a href="http://groups.adobe.com">Adobe Groups</a> site - a <a href="http://groups.adobe.com/index.cfm?event=page.maps">map of all the user groups</a>. (And by all I mean those who entered geographic information.) This feature makes use of the Google Map API and the new CFMAP tag in ColdFusion 9. I thought folks might want a little explanation of the code behind this feature. I don't put this out as the most efficient maps demo or the coolest, but hopefully it will help others. 

<p/>

To begin, let me talk a bit about how I handled the data portion. I knew that I would need longitude and latitude information for user group addresses. While ColdFusion's cfmap supports creating markers on addresses, if you ask Google to geocode too many of them you will get an error. (See <a href="http://www.raymondcamden.com/index.cfm/2009/12/15/Having-trouble-with-too-many-map-markers-and-CFMAP">this blog post</a> for more information.) For my solution I added three properties to my Group entity:
<br clear="left">
<!--more-->
<p/>

<code>
property name="address" ormtype="string";
property name="longitude" ormtype="string";
property name="latitude" ormtype="string";
</code>

<p/>

I then exposed a free form text field on the user group's setting pages to allow user group managers to enter any address they wanted. They could use something vague, like a zip code, or enter a full address with a specific street location. I simply suggested that UGMs first try their address on the main <a href="http://maps.google.com">Google Maps</a> site to see if they liked the result.

<p/>

Once a manager entered their address, I needed to convert this address into a longitude and latitude value. Luckily Google provides a nice API for this and you can find a <a href="http://googlegeocode.riaforge.org/">ColdFusion wrapper</a> for it on RIAForge. I made the call that even with Google providing (normally) pretty swift APIs, I'd do the geolocation in a background process. So now whenever a UGM makes a change to their address, I clear any existing longitude and latitude. I then created a simple scheduled task to handle geolocation.

<p/>

<code>
&lt;cfquery name="getaddresses"&gt;
select	name, address, id
from 	`group`
where address is not null and address != ''
and (longitude = '' or latitude = '' or longitude is null or latitude is null)
&lt;/cfquery&gt;

&lt;cfoutput&gt;#getaddresses.recordCount# address to geocode.&lt;p&gt;&lt;/cfoutput&gt;

&lt;cfloop query="getaddresses"&gt;

	&lt;cfset geocode = new googlegeocoder3()&gt;
	&lt;cfset geo = geocode.googlegeocoder3(address=address)&gt;
	&lt;cfif geo.status is "OK"&gt;
		&lt;cfquery&gt;
		update	`group`
		set	longitude = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#geo.longitude#"&gt;,
			latitude = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#geo.latitude#"&gt;
		where id = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#id#"&gt;
		&lt;/cfquery&gt;
		&lt;cfoutput&gt;Set geo info for #name# at #address#&lt;br/&gt;&lt;/cfoutput&gt;
	&lt;cfelse&gt;
		&lt;!--- possibly set a flag to not try again ---&gt;
		&lt;cfoutput&gt;&lt;font color='red'&gt;Bad geo info for #name# at #address#&lt;/font&gt;&lt;br/&gt;&lt;/cfoutput&gt;
	&lt;/cfif&gt;

&lt;/cfloop&gt;

Done.
</code>

<p/>

I don't think I need to go over the code above - as you can see it's rather simple. I also did <i>not</i> make use of HQL for the queries. I certainly could have but for the first draft, this worked fine. The end result is that every 30 minutes, I look for groups that need geocoding and try to do that operation.

<p/>

Ok - so now I should be done. I can just get a list of groups that have longitude and latitude information and dump them into a cfmap tag, right? Well that's what I thought at first. I then discovered that some user groups dared to share a room with other groups in the area. When Google is asked to put two or more markers in the exact same spot, only the last one will render. Barnacles. I decided to try something else. I created a structure keyed by a location. Each group will place their marker HTML into a value specified by the key. Now if two groups meet in one place, both of their sets of information will be placed on the one marker. Here is a portion of the code from the view. Assume longlatdata is an array of ORM entities for groups where they all contain a geocode information.

<p/>

<code>
&lt;cfset longlat = {}&gt;
&lt;cfloop index="g" array="#longlatdata#"&gt;
		&lt;cfset lat = g.getLatitude()&gt;
		&lt;cfset lon = g.getLongitude()&gt;
		&lt;cfset key = lat & " " & lon&gt;
		&lt;cfif not structKeyExists(longlat, key)&gt;
			&lt;cfset longlat[key] = ""&gt;
		&lt;/cfif&gt;
		&lt;cfset str = "&lt;img src=""#g.getAvatar()#"" align=""left"" width=""75"" height=""75"" style=""margin-right:5px""&gt; &lt;a href=""/group/#g.getId()#""&gt;" & g.getName() & "&lt;/a&gt;&lt;br/&gt;" & g.getAddress() & "&lt;br clear=""left""/&gt;&lt;br/&gt;"&gt;
		&lt;cfset longlat[key] &= str&gt;
&lt;/cfloop&gt;

&lt;cfmap centeraddress="St. Louis, MO, USA" name="ugmMap" showcentermarker="false" zoomlevel="4" width="900" height="500" type="hybrid"&gt;
	&lt;cfloop item="loc" collection="#longlat#"&gt;
		&lt;cfset lat = listFirst(loc, " ")&gt;
		&lt;cfset lon = listLast(loc, " ")&gt;
		&lt;cfmapitem latitude="#lat#" longitude="#lon#" markerwindowcontent="#longlat[loc]#"&gt;
	&lt;/cfloop&gt;
&lt;/cfmap&gt;
</code>

<p/>

Again - I assume this is all pretty simple but let me know if anything needs further explanation. The choice of St. Louis to center the map was totally arbitrary. So, any comments? Right now I'm a bit worried about handling more and more groups with addresses. Luckily there is an <a href="http://code.google.com/p/gmaps-utility-library-dev/">open source MarkerManager</a> to handle large sets of markers. I plan on looking at that next.