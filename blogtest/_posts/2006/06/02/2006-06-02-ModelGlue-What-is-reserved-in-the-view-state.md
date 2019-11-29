---
layout: post
title: "Model-Glue: What is reserved in the view state?"
date: "2006-06-02T18:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/02/ModelGlue-What-is-reserved-in-the-view-state
guid: 1315
---

Someone asked me on IRC yesterday what values are reserved in the viewState for Model-Glue. Since Model-Glue doesn't have the best documentation yet (poke Joe!), I pinged him and did a bit of testing. There are currently only four values that exist by default. You should avoid using a viewState/event arg value with these names:

<ul>
<li>event: The name of the current event. This could be useful for debugging/logging.
<li>eventValue: I believe this is simply the URL variable checked for events. Model-Glue lets you configure this. I've never had a need to though.
<li>myself: A link back home. This is useful in building links back to your Model-Glue app, as you can use this value and just append the link, like so: &lt;a href="#viewState.getValue("myself")#eventNNN"&gt;
<li>self: This is the value that tripped up my friend on IRC. As far as I know it is just a pointer to the file name of the core Model-Glue file (index.cfm typically). 
</ul>