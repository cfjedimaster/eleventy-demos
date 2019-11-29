---
layout: post
title: "Ask a Jedi: Can you run a tag in \"end\" mode inside a CFIF?"
date: "2007-09-21T14:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/21/Ask-a-Jedi-Can-you-run-a-tag-in-end-mode-inside-a-CFIF
guid: 2364
---

Kyle Hayes pinged me with an interesting question today. He wanted to run a custom tag in "end" mode - but inside a CFIF block:

<code>
&lt;cfif parishilton.iq gt 50&gt;
&lt;/cf_sometag&gt;
&lt;/cfif&gt;
</code>

This of course won't work - it will throw an error. Luckily there is a way around it, and I discuss it here in this blog entry from 2004:

<a href="http://www.raymondcamden.com/index.cfm?mode=entry&entry=CBC51433-9A3C-C746-EF925673B227943D">Manually Setting Execution Mode</a>

p.s. This entry is basically a pointer to a <b>way</b> old blog post of mine. I figured since the question came up it was ok to repeat it. Good idea? Bad idea? Waste of space?