---
layout: post
title: "ColdFusion 8: Dumping a Query in ColdFusion 8"
date: "2007-06-04T18:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/04/ColdFusion-8-Dumping-a-Query-in-ColdFusion-8
guid: 2089
---

So a small change - but a nice one. If you dump a query in ColdFusion 8, you now get a set of additional information along with the data. You get...

<ul>
<li>Whether or not the query was cached
<li>The execution time
<li>And best of all - the SQL!
<li>Lastly - if your SQL contained any cfqueryparam tags, there will be a SQLParameters key that is an array of the values used in the cfqueryparam tags.
</ul>

<b>Edited to add last bullet point.</b>

<br clear="left"><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fqdump%{% endraw %}2Epng'>Download attached file.</a></p>