---
layout: post
title: "Excellent ColdFusion/Ajax Demo by James Edmunds"
date: "2007-08-28T14:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/28/Excellent-ColdFusionAjax-Demo-by-James-Edmunds
guid: 2309
---

James Edmunds, a fellow Cajun ColdFusion programmer, sent me a link today to his newest demo:

<a href="http://jamesedmunds.com/poorclio/elevationdemo.cfm">Elevation Demo</a>

What you are seeing here is a mashup between ColdFusion, Microsoft Virtual Earth, and <a href="http://lidar.cr.usgs.gov/">USGS</a> to provide elevation information. As he explains in his <a href="http://jamesedmunds.com/poorclio/citation.cfm?item_id=3837">blog entry</a>, this came about due to some conversations surrounding Rita (AKA that other hurricane) and the Gulf States.

I spoke with James a bit about the technology behind the demo. It is using ColdFusion 8, but no real specific CF 8 feature. Also the Ajax framework isn't anything but Peter Cooper's small and handy xmlhttp.js. The web service in use is:

<a href="http://gisdata.usgs.net/XMLWebServices/TNM_Elevation_service.asmx">http://gisdata.usgs.net/XMLWebServices/TNM_Elevation_service.asmx</a>

<img src="https://static.raymondcamden.com/images/elevationdemo.jpg">