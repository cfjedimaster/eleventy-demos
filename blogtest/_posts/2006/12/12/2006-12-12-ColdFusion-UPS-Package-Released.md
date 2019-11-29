---
layout: post
title: "ColdFusion UPS Package Released"
date: "2006-12-12T21:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/12/ColdFusion-UPS-Package-Released
guid: 1708
---

I'm proud to announce the release of the <a href="http://cfups.riaforge.org/">ColdFusion UPS Package</a>.  This package will serve as a simple to use interface to the UPS services. Today the service includes address verification and shipment tracking. 

Shipment tracking returns a <b>lot</b> of information. No, seriously, it returns everything you can imagine about a shipment. The API returns a pretty big struct, but it does make it easy to get the information at least. Here is an example:

<code>
&lt;cfset st = createObject("component", "org.camden.ups.shipmenttracking").init(application.key, application.username, application.password)&gt;

&lt;cfset results = st.getTrackingInformation('1Z12345E0291980793')&gt;
&lt;cfdump var="#results#"&gt;
</code>

The package is 100% free and open source, so start hacking away at it and let me know if you find any bugs. (Please use the bug tracker at the RIAForge project.) As always - if you  like it, visit my <a href="http://www.amazon.com/o/registry/2TCL1D08EZEYE">wishlist</a>. (The poor thing has nothing purchased currently - so that can't be good!)

The next service I'll hit is the services and rates API.