---
layout: post
title: "This weeks winner for the \"Bug you will never run into a million years\" award"
date: "2011-06-24T18:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/24/This-weeks-winner-for-the-Bug-you-will-never-run-into-a-million-years-award
guid: 4282
---

Here's a weird one for ya. I don't think I've used arrayResize() once in my life. It allows you to dynamically expand an array to a new size and is - apparently - more performant than just increasing the size of an array one by one. The docs specifically mention 500 elements as an example, so I think for most of us this is a non-issue. But of course, on the day I decide to use it I run into an odd little bug. When you use CFWDDX to convert a WDDX string into an array, all (*) the array functions work <i>except</i> arrayResize. Here's an example:
<!--more-->
<p/>

<code>
&lt;cfset source = []&gt;
&lt;cfwddx action="cfml2wddx" input="#source#" output="packet"&gt;
&lt;cfwddx action="wddx2cfml" input="#packet#" output="mirrorUniverseSource"&gt;
&lt;cfdump var="#mirrorUniverseSource#"&gt;
&lt;cfoutput&gt;
isArray? #isArray(mirrorUniverseSource)#&lt;br/&gt;
len? #arrayLen(mirrorUniverseSource)#&lt;br/&gt;
&lt;/cfoutput&gt;

&lt;cfset arrayResize(mirrorUniverseSource,10)&gt;
</code>

<p/>

I've got a simple array that I convert into a WDDX string and back into an array. I can dump it - and ColdFusion recognizes it as an array. I can also isArray and arrayLen it just fine. (The * above is in regards to me saying I tested <i>all</i> the array functions. I did not. To be clear, I just tested those two.) But if you try to arrayResize it you get:

<p/>

<b>Error casting an object of type java.util.Vector cannot be cast to coldfusion.runtime.Array to an incompatible type.</b>

<p/>

Yep. There ya go. I filed a <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=86957">bug report</a> for it but frankly, I don't think it's that big of a deal. If you want a quick fix, you can do this with the "bad" array:

<p/>

<code>
&lt;cfset a = serializeJSON(mirrorUniverseSource)&gt;
&lt;cfset mirrorUniverseSource = deserializeJSON(a)&gt;
</code>

<p/>



<img src="https://static.raymondcamden.com/images/mirror_spock.jpg" />