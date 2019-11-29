---
layout: post
title: "ColdFusion Relative Time Script UDF"
date: "2007-12-19T11:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/19/Reltive-Time-Script
guid: 2550
---

A few minutes ago a user in the ColdFusion IRC channel asked about an ActionScript relative time script. What is a relative time script? It translates something like "December 10" to "8 days ago". Turns out Google found a bunch of examples <a href="http://twitter.pbwiki.com/RelativeTimeScripts">here</a>. I took the first example, a JavaScript one, and rewrote it. This version is ColdFusion 8 only since it uses &lt;, but you could change that in about 2 nanoseconds for a cf7 and earlier version. I'll add this up to CFLib a bit later probably.

<code>
&lt;cfscript&gt;
function relativeTime(pastdate) {
	var delta = dateDiff("s", pastDate, now());

	if(delta &lt; 60) {
	    return "less than a minute ago";
	} else if(delta &lt; 120) {
	    return "about a minute ago";
	} else if(delta &lt; (45*60)) {
	    return round(delta/60) & " minutes ago";
	} else if(delta &lt; (90*60)) {
	    return "about an hour ago";
	} else if(delta &lt; (24*60*60)) {
		return round(delta/3600) & " hours ago";
	} else if(delta &lt; (48*60*60)) {
	    return "1 day ago";
	} else {
		return round(delta/86400) & " days ago";
	}
}
&lt;/cfscript&gt;


&lt;cfset pastdate = dateAdd("n", -9400, now())&gt;
&lt;cfoutput&gt;Paris had dignity #relativeTime(pastdate)#&lt;/cfoutput&gt;
</code>

I'll update the wiki too (got to represent the ColdFusion!)