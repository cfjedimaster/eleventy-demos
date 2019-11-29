---
layout: post
title: "Ask a Jedi: Ajax-bound requests and onRequest"
date: "2008-03-19T12:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/19/Ask-a-Jedi-Ajaxbound-requests-and-onRequest
guid: 2717
---

So this is <i>definitely</i> something I've covered more than once, but as the questions keep coming in, I'm going to keep blogging it. My <b>real</b> hope is that Adobe listens in here as I think this is something that really needs changing in ColdFusion. Anyway, the question, from Samer:

<blockquote>
<p>
I found a wired case, if you use onRequest function in Application.cfc and use cfgrid with bind attribute, it always return empty query to the grid "Response is Empty" !!

Can you help?
</p>
</blockquote>

This is a fairly simple problem. onRequest, if it exists, breaks all flash remoting and CFC calls (remote calls I mean). Make sure you understand that. It doesn't matter what you do in onRequest - the mere existence of the method will call Flash Remoting/CFC (Remote) operations fail. Period.

As I said, this is something I <i>truly</i> wish Adobe would just fix as all it does is trip people up. 

There is a way around it. Sean Corfield has a nice little work around that involves adding the following code to your onRequestStart (not onRequest, but onRequestStart):

<code>
&lt;cfif listlast(arguments.thePage,".") is "cfc"&gt;
&lt;cfset StructDelete(this, "onRequest") /&gt;
&lt;cfset StructDelete(variables,"onRequest")/&gt;
&lt;/cfif&gt;
</code>