---
layout: post
title: "ColdFusion 8, DIV, \"Loading\" graphic issue"
date: "2008-06-10T16:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/10/ColdFusion-8-DIV-Loading-graphic-issue
guid: 2873
---

Here is something interesting I just ran into. One of my open bugs at <a href="http://www.broadchoice.com">work</a> involve adding a "Loading" graphic to an ajax container. The code in question uses CFDIV and hits up a CFC to load the data. 

I thought about it this for a second and thought to myself, "Self - doesn't CF8 automatically do loading graphics?"

I whipped up a quick test to confirm this:

<code>
&lt;cfdiv bind="url:test3.cfm" /&gt;
</code>

and test3.cfm just did:

<code>
&lt;cfset sleep(5000)&gt;
test 3
</code>

When I ran this I plainly saw a loading message and graphic. So why wasn't it working in our product? I noticed that the code used cfc:, not url:, so I quickly modified my test:

<code>
cfc:&lt;br&gt;
&lt;cfdiv bind="cfc:test.getslow()" /&gt;

&lt;p&gt;
url:&lt;br&gt;
&lt;cfdiv bind="url:test3.cfm" /&gt;
</code>

The CFC method getslow did the same thing test3.cfm did. When I ran this I saw:

<img src="https://static.raymondcamden.com/images/badloader.jpg">

As you can see, the CFC based one has no form of loading message while the URL one does. I could switch to a URL based CFC call, but this is rather odd. I can't see why one form of remote call would get a message and another would not.