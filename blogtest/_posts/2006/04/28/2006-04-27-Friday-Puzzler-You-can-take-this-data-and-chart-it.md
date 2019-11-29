---
layout: post
title: "Friday Puzzler: You can take this data and chart it!"
date: "2006-04-28T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/28/Friday-Puzzler-You-can-take-this-data-and-chart-it
guid: 1236
---

One of the (many) things I like about ColdFusion is its built-in support for charting. I especially like the improvements in the last version. Not just the ability to apply custom charting, but the simple improvement to the default colors. There <i>is</i> a reason I don't pick out my own clothes!

For today's puzzler though, we are going to take a trip back in time. Imagine for a moment that you don't have Flash based charts or even HTML for that matter. Imagine you have a set of data and you want to generate a simple bar chart. You are only allowed to use preformatted text since it is going to an old fashion line printer.

Your mission, if you choose to accept it, is to create a textbased bar chart based on the data from the code at the end of this entry. You can use * for bar markers, or any character. You don't have to do labels, but it's extra credit if you do. (You will win 5% more than the nothing I'm giving away.)

As always, remember the rules: Don't spend more than five minutes and don't expect a prize. It's just for fun. 

<code>
&lt;!--- Sales of widgets over the last 12 months ---&gt;
&lt;cfset sales = arrayNew(1)&gt;
&lt;cfloop index="x" from="1" to="12"&gt;
	&lt;cfset sales[x] = randRange(0,100)&gt;
&lt;/cfloop&gt;
</code>

p.s. Still coughing, but I think I'm slowly getting over whatever bug got me this week. What really bugs me is sinus issues always tends to make beer takes like crap.