---
layout: post
title: "Model-Glue Tip: Watch those event values!"
date: "2006-07-20T08:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/20/ModelGlue-Tip-Watch-those-event-values
guid: 1414
---

So I thought I'd blog about a problem I've run into a few times now. Hopefully this will help people avoid the mistake I've made. 

I was working on a user editor and as part of the process, I get the groups value from the event scope. 

<code>
&lt;cfset var groups = arguments.event.getValue("groups")&gt;
</code>

Whenever I passed this value to my code to update the groups for a user, I kept getting an empty value groups. The first thing I checked was to see if I had named the form field right. That was ok. I then used this code to debug my event:

<code>
&lt;cfdump var="#arguments.event.getAllValues()#"&gt;
</code>

This didn't show anything different. The groups value was definitely blank. 

I then remembered why it was blank. I was slowly rolling the  "Groups" concept into the site. As part of my updates, I was adding the user's current groups to the event state in my onRequestStart controller method. Basically, I was setting groups to blank and overriding my form value. 

This is the second time I've done this and I think what I'm going to do is start writing down (in the project notes, core source code, wherever), a list of all values set by onRequestStart. Just to ensure I "stay out of the way" of those values.