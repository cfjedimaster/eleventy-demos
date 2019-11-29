---
layout: post
title: "Starfish ColdFusion Profiler Updated"
date: "2005-12-03T21:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/03/Starfish-ColdFusion-Profiler-Updated
guid: 952
---

After many (many) weeks of ignoring it, I've finally gotten around to updating my Starfish ColdFusion Profiler application. While the project is still in it's "ugly ducking" phase, I have begun to clean the code up a bit and it is well on it's way to a "1.0" release. (I'm calling this the 0.2 release, just because I can.) Updates include:

<ul>
<li>Documentation! Woohoo! It now comes with a Word doc (written with Open Office Writer) that describes how to install Starfish, and talks a bit about the usage. It is not complete - but will at least get you started.
<li>Template chart now includes the title.
<li>CFCs now have charts.
<li>CFCs now have a print/excel format. I don't know about you - but I can't seem to ever make nice looking PDFs. Does anyone have any suggestions for how to clean up the PDF?
<li>If a CFC had a complex object passed as the arg, it didn't format correctly. You will now see COMPLEX OBJECT as the argument.
<li>Query reporting now show "Stored Procedure" in the SQL pane when you click on an entry that is for a stored procedure.
<li>The number of records the query returned is displayed. Note - it is possible that the exact same query name+sql will return different number of records. Therefore I return the max number of records returned for the query.
<li>Cleaned up the 'no data' message.
<li>Added a way to refresh the data.
</ul>

As always, you can download the code from the <a href="http://www.raymondcamden.com/projects/starfish">project page</a>. I have one favor to ask - if you like these updates and have ideas, please use the <a href="http://ray.camdenfamily.com/forums/forums.cfm?conferenceid=249AB039-9046-9195-0C8FFD2086ADAC6E">forums</a>, and please use one thread per suggestion. That will make it easier to watch.