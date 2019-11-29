---
layout: post
title: "ColdFusion/Spry Kit Proof of Concept"
date: "2006-11-02T21:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/02/ColdFusionSpry-Kit-Proof-of-Concept
guid: 1632
---

So - in case folks are curious - I now have both a dishwasher and the Internet back at my house. I feel like I've returned to the modern world. (Yes, I'm spoiled.)

Last night instead of my normal useless browsing, I worked up a quick set of tags that will make it easier for folks to use Spry widgets. So for example, to create tabs (with the not yet officially released Spry Tab code), you can do this:

<code>
&lt;cf_tab id="demo0"&gt;

	&lt;cf_page title="Tab 1"&gt;
	Orig Ganster
	&lt;/cf_page&gt;
	
	&lt;cf_page title="Tab 2"&gt;
	Tab 2
	&lt;/cf_page&gt;
	
&lt;/cf_tab&gt;
</code>

Accordions are much more difficult:

<code>
&lt;cf_accordion id="demo1"&gt;

	&lt;cf_page title="Page One"&gt;
	This is the content for the first accordion panel.
	&lt;/cf_page&gt;
	
	&lt;cf_page title="Page Two"&gt;
	This is the second page with some dynamic content, &lt;cfoutput&gt;#timeFormat(now())#&lt;/cfoutput&gt;
	&lt;/cf_page&gt;
	
&lt;/cf_accordion&gt;
</code>

<more />

The custom tags are smart enough to know when they have been run once in the request and will not re-include the JavaScript files more than once. Before I tell you where to download this - please note that this is <b>very</b> rough code. It doesn't have documentation (bah, docs are for wimps!) or proper error handling, or even strong testing. It really is just something I was playing with. 

This all stemmed from a long talk I had with Charlie Arehart about CF and Spry and he will be working on this project as well. The project is being hosted - where else - at RIAForge: <a href="http://cfspry.riaforge.org">http://cfspry.riaforge.org</a>

I also have some ideas for how to work with Spry datasets as well - but that is still way in the planning stages.

p.s. I said the code was a bit ugly - and it is - but check out how the custom tags are written, especially page.cfm. Notice how it checks for the parent and based on this can check to see if it properly wrapped. Custom tags are cool. Don't let them CFC folks fool ya!