---
layout: post
title: "TimeTracker Updated - Dealing with long strings in Flex DataGrids"
date: "2008-03-26T13:03:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2008/03/26/TimeTracker-Updated-Dealing-with-long-strings-in-Flex-DataGrids
guid: 2729
---

I've updated TimeTracker again. This version includes the code fixes by Sid Wing (thanks!) which was part cleanup and a fix to the mx:Legend. I agree with Sid's <a href="http://www.raymondcamden.com/index.cfm/2008/3/25/Time-Tracker-AIR-Application-Updated#cE8C92552-19B9-E658-9D7D44FCBB65C571">comment</a> that the docs could certainly be clearer.

I also removed the 'Enter key submits hours' thing so folks could enter multiline task descriptions. This is where I ran into an issue with the Flex DataGrid. It refused to correctly render the text in a readable format. Thanks to Scott Stroz for pointing out the variableRowHeight attribute for Flex DataGrids.

<code>
&lt;mx:DataGrid id="todayshours" dataProvider="{% raw %}{todaysHoursData}{% endraw %}" width="100{% raw %}%" height="100%{% endraw %}" sortableColumns="true" variableRowHeight="true"&gt;
</code>

Oh my sweet little adorable Flex DataGrid, is there anything you cannot do?

I also added word wrap to the description columns as well as sorting. (Although I bet date sorting isn't quite right.)

Next up is the CSV export. After that is done I plan on releasing the code to RIAForge since there seems to be some interest.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive20%{% endraw %}2Ezip'>Download attached file.</a></p>