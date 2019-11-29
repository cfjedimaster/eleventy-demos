---
layout: post
title: "Cool little CFPOD Trick"
date: "2007-08-17T07:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/17/Cool-little-CFPOD-Trick
guid: 2287
---

During my <a href="http://www.raymondcamden.com/index.cfm/2007/8/15/Ajax-Presentation-Recording-and-Files">presentation</a> on Wednesday concerning Ajax and ColdFusion 8, someone asked about degradation when JavaScript was turned off. What I had said was that I had not tested it, but I assumed that while stuff would render, anything dynamic would not work, including remote content. So for a text I showed this:

<code>
&lt;cfpod source="test2.cfm" test="Status" /&gt;
</code>

I loaded it up in the browser and confirmed that test2.cfm loaded. I then disabled JavaScript and reloaded the page. The pod rendered just fine, but was now empty. 

Now for the cool part. I changed my code to:

<code>
&lt;cfpod source="test2.cfm" title="Status"&gt;
You need to enable JavaScript.
&lt;/cfpod&gt;
</code>

I reloaded the page and there was my warning. I re-enabled JavaScript, reran the page, and test2.cfm showed up! You could, in theory, use this for simple JavaScript detection. If test2.cfm had a cflocation in it, you could then use this code to warn the user that they must enable JavaScript to continue. Not sure if that is a great idea - but it seemed like a neat trick.