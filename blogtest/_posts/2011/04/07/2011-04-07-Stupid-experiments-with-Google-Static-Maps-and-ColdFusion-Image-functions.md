---
layout: post
title: "Stupid experiments with Google Static Maps and ColdFusion Image functions"
date: "2011-04-07T19:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/07/Stupid-experiments-with-Google-Static-Maps-and-ColdFusion-Image-functions
guid: 4189
---

I've blogged before about the Google Static Map API (see <a href="http://www.raymondcamden.com/index.cfm/2010/2/4/Googles-Static-Map-API">this entry</a> from last year), but recently an interesting question came in about the color of Google Maps. The reader wanted to know if it was possible to create black and white maps. Both the JavaScript-enabled maps as well as the static maps allow for some deep color styling. (See the docs <a href="http://code.google.com/apis/maps/documentation/staticmaps/#StyledMaps">here</a> for how to style static maps.) But hue and saturation are greek to me. I was curious to see how easy ColdFusion could possibly make this. Here's what I came up with. Probably not useful to anyone but fun.
<!--more-->
<p>

First - begin with a simple map:

<p>

<code>
&lt;cfset loc = "Lafayette, Louisiana"&gt;
&lt;cfset zoom = 13&gt;
&lt;cfset size="400x400"&gt;
&lt;cfset mapurl = "http://maps.google.com/maps/api/staticmap?center=#urlEncodedFormat(loc)#&zoom=#zoom#&sensor=false&size=#size#"&gt;

&lt;cfoutput&gt;
&lt;img src="#mapurl#"&gt;
&lt;/cfoutput&gt;
&lt;p/&gt;
</code>

<p>

This creates:

<p>

<img src="http://maps.google.com/maps/api/staticmap?center=Lafayette{% raw %}%2C%{% endraw %}20Louisiana&zoom=13&sensor=false&size=400x400">

<p>

So - how can we make this black and white? Don't forget that ColdFusion's imageNew function allows you to initialize an image with a URL. So we can take map URL and turn it into a ColdFusion image object:

<p>

<code>
&lt;cfset mymap = imageNew(mapurl)&gt;
</code>

<p>

Which means we can then do this...

<p>

<code>
&lt;cfset imageGrayScale(mymap)&gt;
&lt;cfimage action="writeToBrowser" source="#mymap#"&gt;
</code>

<p>

And get...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/gmap.png" />

<p>

Not exactly art - but if you want to get fancy, you can download <a href="http://imageutils.riaforge.org/">imageUtils</a> from RIAForge and do stuff like - oh - add a drop shadow:

<p>

<code>
&lt;cfset mymap = imageNew(mapurl)&gt;
&lt;cfset imageUtils = createObject("component","imageutils.imageUtils")&gt;
&lt;cfset mymap2 = imageUtils.makeShadow(mymap,5,5)&gt;
&lt;cfimage action="writeToBrowser" source="#mymap2#"&gt;
</code>

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/mapshad.png" />

<p>

Or even more silly...

<p>

<code>
&lt;cfset mymap = imageNew(mapurl)&gt;
&lt;cfset mymap3 = imageUtils.reflectImage(mymap, "Bottom")&gt;
&lt;cfimage action="writeToBrowser" source="#mymap3#"&gt;
</code>

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/mapref.png" />

<p>

Here's the entire template below with the path to my desktop obfuscated a bit...

<p>

<code>
&lt;cfset loc = "Lafayette, Louisiana"&gt;
&lt;cfset zoom = 13&gt;
&lt;cfset size="400x400"&gt;
&lt;cfset mapurl = "http://maps.google.com/maps/api/staticmap?center=#urlEncodedFormat(loc)#&zoom=#zoom#&sensor=false&size=#size#"&gt;

&lt;cfoutput&gt;
&lt;img src="#mapurl#"&gt;
&lt;/cfoutput&gt;
&lt;p/&gt;

&lt;cfset mymap = imageNew(mapurl)&gt;
&lt;cfset imageGrayScale(mymap)&gt;
&lt;cfimage action="writeToBrowser" source="#mymap#"&gt;
&lt;cfimage action="write" source="#mymap#" destination="c:\users\notraymond\desktop\gmap.png" overwrite="true"&gt;
&lt;p/&gt;

&lt;cfset mymap = imageNew(mapurl)&gt;
&lt;cfset imageUtils = createObject("component","imageutils.imageUtils")&gt;
&lt;cfset mymap2 = imageUtils.makeShadow(mymap,5,5)&gt;
&lt;cfimage action="writeToBrowser" source="#mymap2#"&gt;
&lt;cfimage action="write" source="#mymap2#" destination="c:\users\notraymond\desktop\mapshad.png" overwrite="true"&gt;
&lt;p/&gt;

&lt;cfset mymap = imageNew(mapurl)&gt;
&lt;cfset mymap3 = imageUtils.reflectImage(mymap, "Bottom")&gt;
&lt;cfimage action="writeToBrowser" source="#mymap3#"&gt;
&lt;cfimage action="write" source="#mymap3#" destination="c:\users\notraymond\desktop\mapref.png" overwrite="true"&gt;
</code>