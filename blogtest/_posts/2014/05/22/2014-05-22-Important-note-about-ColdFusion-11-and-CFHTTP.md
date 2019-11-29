---
layout: post
title: "Important note about ColdFusion 11 and CFHTTP"
date: "2014-05-22T12:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/05/22/Important-note-about-ColdFusion-11-and-CFHTTP
guid: 5229
---

<p>
As a quick aside before I begin, multiple people were involved in this research. I thank them all at the end, but I wanted to be sure folks know this was definitely something I got a <strong>lot</strong> of help on.
</p>

<p>
Earlier this week a user reported an odd issue to me. He was using CFHTTP to hit the <a href="https://developers.google.com/places/documentation/">Google Places API</a> and noticed that code he had in ColdFusion 10 worked, but in ColdFusion 11 the same code returned a 404 error. I was able to quickly confirm the issue and began my investigation.
</p>
<!--more-->
<p>
The first thing I noticed was that the URL in question also worked fine in the browser. I seemed to remember an API a few years ago that blocked the default user agent used with CFHTTP so the first thing I attempted was a simple change to that value. I got my own user agent and supplied it to the tag, but it didn't help.
</p>

<p>
Next - I was curious if there was some particular change to the headers being sent by CFHTTP between versions. To test this, I wrote a new CFM that dumped the headers: <code>&lt;cfdump var="#getHTTPRequestData()#"&gt;</code>
</p>

<p>
When I did so, I noticed two changes. First, ColdFusion 11 was sending Accept-Encoding with gzip, deflate. Secondly, the host value recorded was localhost:80 compared to localhost on ColdFusion 10. I assumed the second change wasn't relevant. My CF11 box was localhost:8511 and since I was hitting localhost/test.cfm, I figured it was just noting the different port. As to the first change, I added that header to the ColdFusion 10 server test and after confirming the headers matched, switched back to hitting Google and was not able to replicate the bug.
</p>

<p>
So - here is where things get interesting. Turns out, the change with the port number <i>was</i> important. Rupesh from the ColdFusion team confirmed that the HttpClient library used in ColdFusion 11 <i>always</i> adds the port to the URL, even when you don't put it there. While a host of foo should be the exact same as foo:80, Google, for whatever reasons, doesn't like the port and returns a 404. (Dan Switzer made the argument, though, that for OAuth 1 calls every part of the URL is significant, and the port <i>would</i> make a difference there.)
</p>

<p>
So - Rupesh has filed a bug report with Apache in regards to HttpClient, which is good, and he has stated that they will try to make a workaround for this in ColdFusion itself. To be clear, <strong>you do not need to worry about this</strong> for - I'd guess - a majority of your cfhttp calls. But you definitely want to be aware of it.
</p>

<p>
Luckily, there is a fix. A super easy fix. I only found this after I wrote a fix in Java, and kicked myself for missing this email from David Boyer. Just add a Host header and everything works: <code>&lt;cfhttpparam name="Host" value="maps.googleapis.com" type="header"&gt;</code>
</p>

<p>
Thanks to David Boyer, Dan Switzer, Mark Kruger, Rupesh, Wil Genovese, and anyone else I forgot.
</p>