---
layout: post
title: "Building an \"auto refresh\" div with ColdFusion 8"
date: "2007-07-19T18:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/19/Building-an-auto-refresh-div-with-ColdFusion-8
guid: 2204
---

I was wondering what I could do to improve the AJAXyness (yes, it is word, because I said so) of <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a>, and I came up with a cool trick. On the right hand side of the site is a stats pod. While the number of feeds won't change, and the number of entries won't change often, the number of users will go up and down. I wanted the information to update without user action and this is what I came up with. (As a note, the code attached to the zip is now old.) 

First I took the block of code and moved it to a new file, stats.cfm. I then edited my layout page and changed the stats pod to this:

<code>
&lt;cfdiv id="statsdiv" bind="url:stats.cfm"&gt;
&lt;/cfdiv&gt;
</code>

The CFDIV is binding to a url, stats.cfm. Again, that's where I moved the stat text. So far so good. Next I added this to my body tag:

<code>
&lt;body onload="window.setTimeout('updatestats()',60000)"&gt;
</code>

And added this JavaScript function:

<code>
&lt;script&gt;
function updatestats() {
	ColdFusion.navigate('stats.cfm','statsdiv');
	window.setTimeout('updatestats()',60000);
}
&lt;/script&gt;
</code>

And that's it. Now when it loads you will get a loading grapic, as it is now for me, and I'm hoping it's just the flakey Airport wifi. (But I shouldn't complain, it's free.)

Thoughts?