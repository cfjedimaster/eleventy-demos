---
layout: post
title: "Ask a Jedi: Refreshing Application Variables"
date: "2005-11-28T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/28/Ask-a-Jedi-Refreshing-Application-Variables
guid: 940
---

A reader asks, 

<blockquote>
When you've used OnApplicationStart to store application variables how do you refresh it?
</blockquote>

Simple - I use a URL variable. Inside my onRequestStart, I'll have something like this:

<code>
&lt;cfif structKeyExists(url, "refreshmebabyonemoretime")&gt;
  &lt;cfset onApplicationStart()&gt;
&lt;/cfif&gt;
</code>

A few notes. The name of the URL variable is completely arbitrary. You probably want something people can't guess, but it is up to you to decide how anal/secure you want to be. 

Also - remember that when ColdFusion runs onApplicationStart by itself, it does so in a single threaded manner. When you run it, it isn't single threaded. But if you are just setting a bunch of application variables, it probably will not matter to you.

p.s. So hey, did you notice I used structKeyExists instead of isDefined? I'm slowly coming around to it. ;)