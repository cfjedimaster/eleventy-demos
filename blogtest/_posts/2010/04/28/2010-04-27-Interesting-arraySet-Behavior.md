---
layout: post
title: "Interesting arraySet Behavior"
date: "2010-04-28T08:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/04/28/Interesting-arraySet-Behavior
guid: 3794
---

A reader pinged me last night with something he was convinced was a bug, but had said that Adobe shot him down and told him it was expected behavior. The behavior in question involved  <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7f15.html">arraySet</a>, a function I rarely use myself, but is useful for folks who want to quickly initialize multiple values in an array.
<!--more-->
<p>
What he noticed was that when he used arraySet with structs, each array element pointed to the same structure. Here is an example:
<p>
<code>

&lt;cfset a = []&gt;

&lt;cfset arraySet(a,1, 5, {})&gt;
&lt;cfset a[1].name = "ray"&gt;

&lt;cfdump var="#a#"&gt;
</code>
<p>

The result of this is:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-04-28 at 6.20.08 AM.png" title="That's a lot of Ray" />

<p>

As you can see, I only modified the first array element, but all five were modified. We get this result because the structure created within the arraySet function is copied by to all the array elements, but copied by reference. This is expected (although it trips people up) for structures and other complex data. It is also expected, or should be, that if you use a function for the value in arraySet that it will only be run once. So for example:

<p>

<code>
&lt;cfset arraySet(a,1, 5, createUUID())&gt;
&lt;cfdump var="#a#"&gt;
</code>

<p>

When run this returns:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-04-28 at 6.22.13 AM.png" title="Nothing says 'I Love You' like a bouquet of UUIDs" />

<p>

Again, I don't think any of this is wrong, or even unexpected, but I certainly can see forgetting this myself.