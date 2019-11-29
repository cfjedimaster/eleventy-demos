---
layout: post
title: "Hiding meta information in ColdFusion 8's CFDUMP"
date: "2007-08-12T11:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/12/Hiding-meta-information-in-ColdFusion-8s-CFDUMP
guid: 2273
---

I love the new information about queries displayed in ColdFusion 8's cfdump tag (you can see the SQL, the parameters, execution time, and cache status), but if you don't want all the extra information, just use the metainfo attribute:

<code>
&lt;cfdump var="#myqueryissocool#" metainfo="false"&gt;
</code>

While not new to ColdFusion 8, don't forget you can also do "show" and "hide" to tell ColdFusion what columns to display. (This also works for structures.)