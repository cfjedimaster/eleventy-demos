---
layout: post
title: "Simple auto-reload ColdFusion 8 Ajax Demo"
date: "2008-10-03T15:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/03/Simple-autoreload-ColdFusion-8-Ajax-Demo
guid: 3041
---

A user on my forums <a href="http://www.raymondcamden.com/forums/messages.cfm?threadid=C3300F90-19B9-E658-9D17FD71521D69BA&">asked</a> about creating a region on his web page that would auto reload, like what he saw on <a href="http://www.att.com">att.com</a>. I used to have an auto-reloading item on <a href="http://www.coldfusionbloggers.org">coldfusionbloggers.org</a>, and I thought I had blogged on it, but wasn't able to find it. Forgive the dupe if you remember an earlier entry about this. Anyway, here is a real simple example.
<!--more-->
First, I'm to start with a page that uses cfdiv to load the content I want to reload.

<code>
&lt;html&gt;

&lt;head&gt;	
&lt;/head&gt;

&lt;body&gt;
&lt;h2&gt;Where is Oktoberfest?&lt;/h2&gt;

&lt;p&gt;
Foo
&lt;/p&gt;

&lt;cfdiv id="ad" bind="url:ad.cfm" /&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

The file I'm using, ad.cfm, will rotate between 4 ads, or pieces of content, or whatever. In my case it is a simple counter:

<code>
&lt;cfparam name="session.counter" default="0"&gt;
&lt;cfset maxAds = 4&gt;
&lt;cfset session.counter++&gt;
&lt;cfif session.counter gt maxAds&gt;
	&lt;cfset session.counter = 1&gt;
&lt;/cfif&gt;

&lt;cfoutput&gt;
&lt;p&gt;
&lt;b&gt;This is ad #session.counter#&lt;/b&gt;
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

So to start reloading the content, I'm going to set up a interval. I'll launch this using ajaxOnLoad:

<code>
&lt;cfset ajaxOnLoad('setup')&gt;
</code>

and here is setup:

<code>
function setup() {
	setInterval(reload,5000);
}
</code>

This says, run the reload function ever 5 seconds. The reload function is pretty trivial:

<code>
function reload() {
	ColdFusion.navigate('ad.cfm','ad');
}
</code>

So all in all a very simple piece of code. I've included the entire template below. 

<code>
&lt;html&gt;

&lt;head&gt;	
&lt;script&gt;
function reload() {
	ColdFusion.navigate('ad.cfm','ad');
}

function setup() {
	setInterval(reload,5000);
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;h2&gt;Where is Oktoberfest?&lt;/h2&gt;

&lt;p&gt;
Foo
&lt;/p&gt;

&lt;cfdiv id="ad" bind="url:ad.cfm" /&gt;

&lt;/body&gt;
&lt;/html&gt;
&lt;cfset ajaxOnLoad('setup')&gt;
</code>