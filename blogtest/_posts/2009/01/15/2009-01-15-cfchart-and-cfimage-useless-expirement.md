---
layout: post
title: "cfchart and cfimage - useless experiment"
date: "2009-01-15T21:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/15/cfchart-and-cfimage-useless-expirement
guid: 3195
---

So after my <a href="http://www.raymondcamden.com/index.cfm/2009/1/14/Ask-a-Jedi-Emailing-CFCHART">last post</a> on embedding cfchart in email, I've been playing with cfchart and image functions. The ability to create an image out of cfchart isn't new, and we've got a butt load of new image functions in ColdFusion 8, so we should be able to mix the two up right? I whipped up a quick demo using <a href="http://imageutils.riaforge.org">imageUtils</a> from RIAForge and a simple chart:

<code>
&lt;cfset imageutils = createObject("component","imageutils.imageUtils")&gt;

&lt;cfchart format="png" name="mychart" chartheight="200" chartwidth="200" showlegend="false"&gt;
	&lt;cfchartseries type="pie"&gt;
		&lt;cfchartdata item="1Q Sales" value="500" /&gt;
		&lt;cfchartdata item="2Q Sales" value="400" /&gt;
		&lt;cfchartdata item="3Q Sales" value="700" /&gt;
		&lt;cfchartdata item="4Q Sales" value="200" /&gt;
	&lt;/cfchartseries&gt;
&lt;/cfchart&gt;

&lt;cfset mychart = imageNew(mychart)&gt;
&lt;cfset myfancychart = imageutils.reflectImage(mychart,"Bottom") /&gt;
		
&lt;cfimage action="writetobrowser" source="#myfancychart#" /&gt;
</code>

Nothing too crazy here. I save the image binary into a variable and then 'load' it as an Image object using imageNew. I then use the reflectImage function to create...

<img src="https://static.raymondcamden.com/images/cfjedi//chart.png">

I then got artsy:

<img src="https://static.raymondcamden.com/images/cfjedi//chart2.png">

So yeah, this was a complete waste of time. I can't think of anything I'd use CF8's image functions for that I can't do natively with cfchart itself, but maybe something intelligent will come to me later.