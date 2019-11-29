---
layout: post
title: "Add \"Search Export\" to ColdFusion Builder 3"
date: "2014-06-26T11:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/06/26/Add-Search-Export-to-ColdFusion-Builder-3
guid: 5254
---

<p>
Recently, a commenter on <a href="http://forta.com/blog/index.cfm/2012/11/25/When-Using-ColdFusion-No-Longer-Makes-Sense#c4CF5F811-5056-A012-71453858BE5A529F">another blog</a> mentioned that one of the things they missed from Dreamweaver is the ability to do a search and then export the results. I didn't even know DW had this and it <i>does</i> sound rather useful!
</p>
<!--more-->
<p>
In case you're curious, here is an example. I searched my test directory for cfqueryparam. In the results panel is a simple button you can click to export the results.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Adobe_Dreamweaver_CC_2014.png" />
</p>

<p>
The export goes to an XML file. It is a bit verbose, but you could probably import this into an Excel file. (Although I just tried and Excel on the Mac doesn't seem to have the ability to do it. Maybe I'm just missing it.) Any way - as the user no longer wants to use DW since he is a ColdFusion developer, he wasn't happy with this particular feature not being in ColdFusion Builder.
</p>

<p>
I did a quick search and was able to find an Eclipse plugin that has similar functionality: <a href="http://marketplace.eclipse.org/content/eclipse-search-csv-export#.U6shU41dXQG">Search CSV Export</a>. As the name says, it lets you export search results into CSV content. (Which, by the way, should be easier to work with in Excel than that XML data from DW.) I quickly added the plugin and confirmed it works great. Here is an example:
</p>

<p>
<img src="https://static.raymondcamden.com/images/ss6.png" />
</p>

<p>
The change wasn't immediately obvious (hence me adding a big arrow to the screen shot), but once clicked, you get the ability to save it as a new CSV file.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_6_26_14__9_22_AM.png" />
</p>

<p>
I apologize if that screen shot is a bit too hard to read. Basically the report includes the project, path (based on Project name), location (real file path), line number, the text before and after, and the match. 
</p>