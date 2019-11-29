---
layout: post
title: "Running Model-Glue 3 on a box with Model-Glue 2"
date: "2008-05-07T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/07/Running-ModelGlue-3-on-a-box-with-ModelGlue-2
guid: 2812
---

Just a quick tip. If your box is setup to run Model-Glue2 already, you probably have a ColdFusion mapping set up for ModelGlue that points to the V2 framework. If you want to play with V3 but not mess up your V2 sites (not to imply Joe is anything less than perfect), then consider this simple tip.

Make a new instance of the application template, then open up Application.cfc and add this:

<code>
&lt;cfset this.mappings["/ModelGlue"] = "/Users/ray/Documents/workspace/ModelGlue3/trunk/ModelGlue/"&gt;
</code>

Of course you would edit the path to point to the right folder. This will overrule the ColdFusion Admin's mapping and use a model specific to the application. Of course, this requires ColdFusion 8.