---
layout: post
title: "Can you do Flex \"Wrappers\" like you can with ColdFusion?"
date: "2007-01-18T11:01:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2007/01/18/Can-you-do-Flex-Wrappers-like-you-can-with-ColdFusion
guid: 1777
---

Today I ran into an interesting issue. I was trying to wrap a component with a "wrapper", like how you can do with ColdFusion:

<code>
&lt;cf_layout title="Pirates are people too"&gt;
&lt;cf stuff in here&gt;
&lt;/cf_layout&gt;
</code>

My Flex code looked like so:

<code>
&lt;views:PageWrapper title="My other car is a Star Destroyer"&gt;
 &lt;views:soAndSoView /&gt;
&lt;/views:PageWrapper&gt;
</code>

I immediately ran into a runtime, not compile tile, bug:

<blockquote>
Multiple sets of visual children have been specified for this component
</blockquote>

Turns out this is a known problem with Flex, with a cool workaround. Peter Ent blogged about this almost a full year ago:

<a href="http://weblogs.macromedia.com/pent/archives/2006/03/component_templ.cfm">Component "Templates" in Flex 2.0</a>

Forgive the simple crosspost here - but I bet I won't be the only ColdFusion developer who runs into this.