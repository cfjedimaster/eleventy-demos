---
layout: post
title: "Ask a Jedi: Multiple DSNs in ColdFusion Applications"
date: "2006-03-23T13:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/23/Ask-a-Jedi-Multiple-DSNs-in-ColdFusion-Applications
guid: 1166
---

I was a bit surprised by this question as it never occurred to me it that someone would even ask it, but heck, that was the reason for the Ask a Jedi series so maybe others are wondering as well. Audra asks:

<blockquote>
Is it possible to create a ColdFusion application with 2 DSNs?
Both database
sources would have to be updated from the application.   It's not the ideal
situation, but we have two very large access databases, in which we have
considered combining similar fields/tables. However, there are so many dependent
functions and variables that the transition with have to contain many phases.
And it would be best, in this particular situation, to work with two
datasources.
</blockquote>

The answer is yes, of course. There is no correlation between ColdFusion applications and how many datasources can be used. Obviously you don't want to use too many. I'd say 90% of my applications used only one databases, and the rest used two or three. Typically these were old databases that we were not allowed to upgrade. Typically they were also very segregated databases that had content specific to only one small section of the site. But the short answer is yes, you can use as many DSNs as you want in an application.

Now - you <i>may</i> be restricted by your ISP. You probably want to check for then when shopping for a ColdFusion host. A decent one should give you at least five I'd say.