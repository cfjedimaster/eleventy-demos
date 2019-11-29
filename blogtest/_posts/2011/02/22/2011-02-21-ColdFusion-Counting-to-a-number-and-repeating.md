---
layout: post
title: "ColdFusion: Counting to a number and repeating"
date: "2011-02-22T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/22/ColdFusion-Counting-to-a-number-and-repeating
guid: 4133
---

Ok, this is something I've done a thousand times before, but last night when I tried to get it working, it took me a few hours to get it right. I'm sure the first comment on this entry will be a comment showing how much of a bonehead I was, but darnit, I <b>had</b> to get this working or give up programming forever. So what's the problem? Given a set of records, I want to number them from 1 to 5 so that after 5 I go back to 1 again. Or, given 12 records, I want to see: 1,2,3,4,5,1,2,3,4,5,1,2. Simple, right?
<!--more-->
<p>

So, I began with a simple script that I could use for testing:

<p>

<code>
&lt;cfset records = 12&gt;
&lt;cfset toCount = 5&gt;

&lt;cfloop index="x" from="1" to="#records#"&gt;
	
	&lt;cfoutput&gt;
	Record: #x#&lt;br/&gt;	
	&lt;br/&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

<p>

Records simply represent how many iterations I'll be simulating and "toCount" represents the number I'll be counting "up" to and repeating. I then thought about the problem and came up with a formula I wrote out like this:

<p>

<blockquote>
Take your current number, and subtract from that the whole number of sets (sets being what you are counting up). 
</blockquote>

<p>

So given 12, for example, I have 2 whole sets of 5, for a value of 10. 12-10 is 2. So here is my first take at this:

<p>

<code>
&lt;cfset records = 12&gt;
&lt;cfset toCount = 5&gt;

&lt;cfloop index="x" from="1" to="#records#"&gt;
	
	&lt;cfset answer = x - (toCount * (x \ toCount))&gt;
	&lt;cfoutput&gt;
	Record: #x#&lt;br/&gt;	
	Answer: &lt;b&gt;#answer#&lt;/b&gt;&lt;br/&gt;
	&lt;br/&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

<p>

And the result:<br/>
<img src="https://static.raymondcamden.com/images/ScreenClip28.png" />

<p>

What the hey? Every time I hit a multiple of 5 I end up with 0. Ok, that makes sense I guess. So what can I do? Just reduce my current row by one. Yeah, that's it:

<p>

<code>
&lt;cfset records = 12&gt;
&lt;cfset toCount = 5&gt;

&lt;cfloop index="x" from="1" to="#records#"&gt;
	
	&lt;cfset answer = x - (toCount * ((x-1) \ toCount))&gt;
	&lt;cfoutput&gt;
	Record: #x#&lt;br/&gt;	
	Answer: &lt;b&gt;#answer#&lt;/b&gt;&lt;br/&gt;
	&lt;br/&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

<p>

And the result...<br/>
<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip29.png" />

<p>

So - please - someone tell me there is a much simpler way of doing this?