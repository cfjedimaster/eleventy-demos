---
layout: post
title: "ColdFusion Contest - Final Entries"
date: "2005-10-24T13:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/24/ColdFusion-Contest-Final-Entries
guid: 866
---

So, this contest has taken <i>way</i> longer than I thought it would, but that just speaks to how many responses I got, which I think is a good thing. If you haven't looked at the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/12/ColdFusion-Contest-Entry-Examined--Part-5">previous entries</a>, I suggest that you do so. I'm going to quickly link to and point out the final two entries, and tonight I will pick a winner. (Along with releasing Starfish Version 0 hopefully.)

The <a href="http://ray.camdenfamily.com/demos/contest1/entry6">first entry</a> works pretty well, and has an interesting feature. If it catches you fibbing about your number, it will call you a lier. Nice. One thing I noticed about this sample is an odd use of "this" in the code. Here is a sample that I've mashed together:

<code>
&lt;cfset request.this.title = "Guess The Number"&gt;
&lt;cfset session.this.guessrange = 100&gt;
</code>

I've pinged the writer to see why he uses scope.this.var and hopefully he will respond. That being said, I do have a problem with this. ColdFusion will let you automatically create a structure without using structNew(). Consider this code block:

<code>
&lt;cfset z.y = "foo"&gt;
&lt;cfdump var="#z#"&gt;
</code>

This works, but is dangerous. If for some reason you added &lt;cfset z = 1&gt; before the cfset above, the code will not work and will throw this error: <b>You have attempted to dereference a scalar variable of type class java.lang.String as a structure with members.</b> Simply adding the structNew() fixes the problem:

<code>
&lt;cfset z = 1&gt;
&lt;cfset z = structNew()&gt;
&lt;cfset z.y = "foo"&gt;
&lt;cfdump var="#z#"&gt;
</code>

So in general, I'd probably always recommend <b>against</b> relying on ColdFusion to automatically create a structure for you as the author did above. 

The last entry gets bonus points for providing both a <a href="http://ray.camdenfamily.com/demos/contest1/entry7/gameCFCVer.cfm">CFC version</a> as well as a <a href="http://ray.camdenfamily.com/demos/contest1/entry7/game.cfm">basic</a> version. I didn't have much to say about this one so for now I'm just providing the links so folks can play with it.

So that's it! Tonight I will announce a winner (which I'm sure no one will disagree with, ahem) so check back again.