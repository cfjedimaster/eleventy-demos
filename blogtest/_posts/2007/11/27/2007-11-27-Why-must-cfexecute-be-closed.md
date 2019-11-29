---
layout: post
title: "Why must cfexecute be closed?"
date: "2007-11-27T14:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/27/Why-must-cfexecute-be-closed
guid: 2498
---

Simple question - but does anyone know why CFEXECUTE tags <i>must</i> be closed? In other words, you can't do this:

<code>
&lt;cfexecute name="parispic" variable="result"&gt;
</code>

You must either do this:

<code>
&lt;cfexecute name="parispic" variable="result" /&gt;
</code>

Or

<code>
&lt;cfexecute name="parispic" variable="result"&gt;&lt;/cfexecute&gt;
</code>

The docs say you that you should not put anything between the closing and end tags, but this is perfectly valid:

<code>
&lt;cfexecute name="parispic" variable="result"&gt;
&lt;cfset x = 1&gt;
&lt;/cfexecute&gt;
</code>

But if you try to use X, you get an error. It's almost as if the ColdFusion developers imagined some other tag that would work on the inside - but then changed their mind.