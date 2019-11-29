---
layout: post
title: "ColdFusion 9.0.1 CHF 2 Released"
date: "2011-09-16T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/09/16/ColdFusion-901-CHF-2-Released
guid: 4368
---

Subject says it all. Our second CHF for ColdFusion 9.0.1 has been released. You can find details here:

<a href="http://kb2.adobe.com/cps/918/cpsid_91836.html">http://kb2.adobe.com/cps/918/cpsid_91836.html</a>

Some good fixes here, including:

<ul>
<li>ColdFusion does not resolve the CFC's fully qualified name correctly when a relative path is used in the application mapping.
<li>ColdFusion throws "java.lang.IllegalStateException: Session is invalid" exception randomly.
<li>serializeJSON converts integer to string.
<li>serializeJSON incorrectly serializes nested objects. Also, in the case of circular references, for example, when handling bidirectional ORM relationship, repeating entities are represented as empty strings instead of empty objects.
</ul>