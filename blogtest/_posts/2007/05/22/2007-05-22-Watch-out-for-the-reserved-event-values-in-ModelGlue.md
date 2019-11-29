---
layout: post
title: "Watch out for the reserved event values in Model-Glue"
date: "2007-05-22T17:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/22/Watch-out-for-the-reserved-event-values-in-ModelGlue
guid: 2056
---

So for the last 10 minutes or so I've been struggling with why Model-Glue was throwing an error about events. I have a controller that checks the value of "event" in the ViewState. This contains the name of the currently running event. For some reason, when I did one particular action, I got an error saying that the value of the event wasn't a simple value. 

This certainly didn't make any kind of sense. Event <i>had</i> to be a simple value - otherwise - how would Model-Glue know what to run?

Turns out I was working on event editing (event as in calendar events). I had a line of code that did this:

<code>
&lt;cfset arguments.event.setValue("event", createObject("component", "exchange.model.eventbean"))&gt;
</code>

Yeah, um, not such a good idea. In case folks are curious, read <a href="http://ray.camdenfamily.com/index.cfm/2006/6/2/ModelGlue-What-is-reserved-in-the-view-state">this blog entry</a> for a list of reserved words in Model-Glue.