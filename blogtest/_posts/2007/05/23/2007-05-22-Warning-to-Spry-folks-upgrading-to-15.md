---
layout: post
title: "Warning to Spry folks upgrading to 1.5"
date: "2007-05-23T09:05:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/05/23/Warning-to-Spry-folks-upgrading-to-15
guid: 2058
---

One of the shortcuts that Spry borrowed from prototype was this:

<code>
var someitem = $("idofitem");
</code>

In order to avoid conflicts with folks using Spry and Prototype or other frameworks, this syntax has been changed:

<code>
var someitem = Spry.$("idofitem");
</code>

I saw this in the release notes, but Peter <a href="http://ray.camdenfamily.com/index.cfm/2007/4/7/Using-AJAX-and-Server-Side-Search-2#cB8D587BD-D34D-F5F7-3235810428D436B2">noted</a> how it had tripped him up so I thought I'd warn folks.