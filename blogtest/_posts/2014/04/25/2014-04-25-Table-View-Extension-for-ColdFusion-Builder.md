---
layout: post
title: "\"Table View\" Extension for ColdFusion Builder"
date: "2014-04-25T19:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/04/25/Table-View-Extension-for-ColdFusion-Builder
guid: 5211
---

<p>
It has been a <i>long</i> time since I wrote a ColdFusion Builder extension, but as I'm using it more and more (with the new 3.0 release), I came across a need to write one today. One of the older features that I've used quite a bit is the table view in the RDS panel. This lets you select a table, right click, and dump the data into a new tab. Sure I can do this with other tools, but having it in my IDE is nice. 
</p>
<!--more-->
<p>
Unfortunately, this feature has been plagued by a <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=2820937">bug</a> (now four years old) that prevents it from working sometimes. Screw that. CFB's extension API lets you integrate with the RDS tables. I wrote an extension that simply lets you right click on a table and select dump:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s110.png" />
</p>

<p>
It then fires up a view with a simple dump of the top 200 rows.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s211.png" />
</p>

<p>
And that's it. I'm considering making it more intelligent so that you can right click on a particular field and it shows just that field. That will take about five minutes but I'm not in the mood to do it right now. ;)
</p>

<p>
The extension is attached to this blog entry. Enjoy.
</p>

<p>
P.S. I fixed it so you can select a field and see <strong>just</strong> that one.
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive38%{% endraw %}2Ezip'>Download attached file.</a></p>