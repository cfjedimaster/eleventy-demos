---
layout: post
title: "File-based Indexes with ColdFusion - a quick tip"
date: "2013-10-15T13:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/10/15/Filebased-Indexes-with-ColdFusion-a-quick-tip
guid: 5059
---

<p>
Hopefully this saves someone else if they resort to a Google search. Using the cfindex tag to index file documents? If you leave the extensions attribute off, which you can, since it is optional, ColdFusion will index nothing. If you add extensions="*", ColdFusion will index nothing. The right fix? Use extensions=".*". (Edit: In case it isn't clear, that was .* as the value. Dot Star. Period Asterisk. You get the idea. ;)

</p>
<p>
Obvious - right?
</p>
<p>
By the way, don't forget you can use the status attribute to get a result struct showing you exactly how many items were modified in your index. This is <i>incredibly</i> useful when debugging.
</p>