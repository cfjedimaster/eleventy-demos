---
layout: post
title: "User Submitted Tip: Refreshing a CFDIV bound to a CFC"
date: "2009-05-26T17:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/05/26/User-Submitted-Tip-Refreshing-a-CFDIV-bound-to-a-CFC
guid: 3371
---

I swear this is something I may have covered before, but I'm not finding it in my archives. Either way, it's a good tip and I wanted to share it. Markus Wollny was working with a CFDIV tag that was bound to a CFC:

<code>
&lt;cfdiv id="ivactid" bind="cfc:article.getCuriVactid()"&gt;&lt;/cfdiv&gt;
</code>

The problem he ran into was refreshing the data in the grid. Normally a bound CFDIV (or other UI item) would 'listen' in to a particular form field and notice when it changed. In his case, there was no form field included in the bind. 

To get around this, he simply used ColdFusion.navigate on the DIV and switched to a URL version of his CFC:

<code>
ColdFusion.navigate('article.cfc?method=getCuriVactid','ivactid')
</code>

In order for this to work the CFC has to return a string as a result, and unless the cffunction tag declares it explicitly, you will need to use a returnFormat of plain:

<code>
ColdFusion.navigate('article.cfc?method=getCuriVactid&returnFormat=plain','ivactid')
</code>

Thanks for sharing this, Markus.