---
layout: post
title: "Spry, Dates, and how we will make you conform...."
date: "2008-03-05T16:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/03/05/Spry-Dates-and-how-we-will-make-you-conform
guid: 2692
---

<img src="https://static.raymondcamden.com/images/cfjedi/Bush030307.jpg" align="left" style="margin-right: 10px;margin-bottom:10px;"> A reader wrote me today about an interesting issue he was having with Spry. His dataset included dates, and whenever he would sort the dates, they would sort incorrectly.

My first reaction was to suggest he use <a href="http://labs.adobe.com/technologies/spry/articles/data_api/apis/dataset.html#setcolumntype">setColumnType()</a>. This is a helper function that tells Spry what column types are in use with your dataset. You need to use this for dates, numeric, and HTML data. Nine times out of ten when someone has a sorting issue, this is the problem.

Then I read his email again (sorry folks, I get a lot of email and sometimes I skim) and noticed that his <i>real</i> problem was the use of European dates. Instead of the proper MM/DD/YYYY, his dates were in the form of DD/MM/YYYY.

Now - I know the rest of the world may use this format (and the metric system), but if there is one thing my president has taught me is that we do things the American way darnit and the rest of the world just needs to catch up! (Ok, before the comments flow in - it's a joke. ;)

So what exactly went wrong? I did some Googling and found this <a href="http://www.adobe.com/cfusion/webforums/forum/messageview.cfm?forumid=72&catid=602&threadid=1340704&enterthread=y">thread</a> on the Adobe forums. A user there, c.veronesi, found that when Spry used the Java date(string) constructor, it had no idea of locale, so thought some valid European dates weren't valid, and thought others were the American version. 

The solution he came up with was to simply return two columns of data. One is the date in the proper (again, <b>kidding</b>) American format. The other was in the formatted (DD/MM/YYYY) format. He used the American version for sorting, and the display version for - well displaying.

Massimo Foti also pointed out that if you used ISO-8901 format (yyyy-mm-dd), then JavaScript has no problem understanding the proper date value.

One thing I'll add to this. Don't forget that Spry 1.6.1 added the ability to use a display function. You could use this to reformat your American or ISO-8901 date into DD/MM/YYYY format on the fly if you don't want to change your returned XML/JSON.