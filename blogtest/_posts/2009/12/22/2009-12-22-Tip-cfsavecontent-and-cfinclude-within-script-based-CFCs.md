---
layout: post
title: "Tip: cfsavecontent and cfinclude within script based CFCs"
date: "2009-12-22T22:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/22/Tip-cfsavecontent-and-cfinclude-within-script-based-CFCs
guid: 3662
---

Ok, so I know that I've said (many times) that including layout in a CFC is <i>generally</i> a bad idea. I still think it is. But like most rules there are always exceptions. Normally this wouldn't be a big deal, but HTML and JavaScript within a script based component is - well - it's ugly. Here is an example:

<code>
case "textbox": {
	return s & '&lt;input type="text" name="#arguments.name#" value="#currentValue#"&gt;';
}
</code>

This simple example works, but more complex HTML gets messier. I could have switched the component over to tags. It's not like that would be the end of the world! But then I remember - you can use savecontent within script based cfcs. So instead of the inline HTML you see above, I now use:

<code>
case "event date": {
	savecontent variable="s" {
		include "render/eventdate.cfm";
	}
	return s;
}
</code>

Woot. I wish I had remembered this when I began the project, but I'm guessing I'll be getting used to ColdFusion 9 syntax until right around the release of ColdFusion 10.