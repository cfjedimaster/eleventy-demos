---
layout: post
title: "Don't forget that CFCONTENT tag when working with Spry"
date: "2007-08-06T13:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/06/Dont-forget-that-CFCONTENT-tag-when-working-with-Spry
guid: 2255
---

Just a reminder - a friend of mine went through an hour of banding his head against the wall when a Spry example worked fine in IE6 and Firefox, but not the lovely IE7. Turned out that IE7 was being more demanding on the content type. He had forgotten to add:

<code>
&lt;cfcontent type="text/xml"&gt;
</code>

IE7 decided that since the content type wasn't set right, it would just plain ignore the result. Awesome.

As a tip - this friend was using Model-Glue. When I do Ajax stuff in Model-Glue, I normally route all my events to an event handler just for XML events. This event works a lot like a normal "template" event, except this time the template is for XML. It basically does:

<code>
&lt;cfset content = viewState.getValue("content"&gt;
&lt;cfcontent type="text/xml" reset="true"&gt;&lt;cfoutput&gt;#content#&lt;/cfoutput&gt;
</code>