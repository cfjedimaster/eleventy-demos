---
layout: post
title: "ColdFusion 101: Picking a random image (2)"
date: "2006-08-16T08:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/16/ColdFusion-101-Picking-a-random-image-2
guid: 1474
---

After my <a href="http://ray.camdenfamily.com/index.cfm/2006/8/15/ColdFusion-101-Picking-a-random-image-or-rotating-over-each-one">post</a> yesterday on selecting or rotating images, a reader asked if it was possible to show a random image once and not again until the other images are shown. That is certainly possible, and here is one way to do it...
<!--more-->
<code>
&lt;cfapplication name="img" sessionManagement="true"&gt;

&lt;!--- Get full path to images. ---&gt;
&lt;cfset imageDirectory = expandPath(".")&gt;

&lt;!--- Get directory ---&gt;
&lt;cfdirectory action="list" directory="#imageDirectory#" name="images" filter="*.jpg"&gt;

&lt;!--- Do we have any images? ---&gt;
&lt;cfif images.recordCount gt 0&gt;

	&lt;!--- store ID values ---&gt;
	&lt;cfif not structKeyExists(session, "totalList") or session.totalList is ""&gt;
		&lt;cfset session.totalList = valueList(images.name)&gt;
	&lt;/cfif&gt;

	&lt;!--- pick a random number ---&gt;
	&lt;cfset pickedIndex = randRange(1, listLen(session.totalList))&gt;
	
	&lt;!--- pick from list ---&gt;
	&lt;cfset image = listGetAt(session.totalList, pickedIndex)&gt;
	
	&lt;!--- remove from total list ---&gt;
	&lt;cfset session.totalList = listDeleteAt(session.totalList, pickedIndex)&gt;	
	
	&lt;!--- display it ---&gt;
	&lt;cfoutput&gt;&lt;img src="#image#"&gt;&lt;/cfoutput&gt;

&lt;/cfif&gt;
</code>

The way I handled it was to simply store the list of filenames in a session variable. This then becomes my list of data to randomly select from. Because the list gets smaller on every hit, I have to check for either the session variable not existing, or if it is empty, and if so, I fill in the values. 

Running this version will give you a random order of images, with no image repeated until they have all been shown. There is one exception to this. It is possible that if dharma.jpg, for example, was picked last, that it could then be picked first on reload. As homework, modify the code above to handle that edge case. 

p.s. As a reminder, do not forget that you can subscribe to the blog by using the Subscribe form on the right hand side. This will let you get entries via email.