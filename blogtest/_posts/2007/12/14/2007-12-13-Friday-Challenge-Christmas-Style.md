---
layout: post
title: "Friday Challenge - Christmas Style"
date: "2007-12-14T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/14/Friday-Challenge-Christmas-Style
guid: 2540
---

<img src="https://static.raymondcamden.com/images/cfjedi/12DaysChristmasHallmark.jpg" align="left" style="margin-right: 10px">
Last year I did a few Christmas style friday challenges, so I'm a bit overdue. This one is rather simple. Given a query that contains an ID, which corresponds to a day, and a gift, print out the famous "12 Days of Christmas" song dynamically. Ie, day 1 you get gift 1. Day 2 you get 1 of gift 1, and 2 of gift 2. And so on.

Bonus points if you use festive green and red fonts in your display. (Once again, this is why they don't let me design.)

Double bonus points if you make a cfpresentation out it and record MP3s to go along with it.

Here is your query that you must use with the code. (Note, it uses CF8 Array shorthand style. If you aren't on CF8, you can rewrite that as a list and use listToArray.)

<code>
&lt;cfset song = querynew("id,gift","integer,varchar")&gt;

&lt;cfset gifts = ["A partridge in a pear tree","Two turtle doves","Three French hens","Four calling birds","Five golden rings","Six geese a-laying",
		"Seven swans a-swimming","Eight maids a-milking","Nine ladies dancing","Ten lords a-leaping","Eleven pipers piping","Twelve drummers drumming"]&gt;

&lt;cfloop index="x" from="1" to="#arrayLen(gifts)#"&gt;
	&lt;cfset queryAddRow(song)&gt;
	&lt;cfset querySetCell(song, "id", x)&gt;
	&lt;cfset querySetCell(song, "gift", gifts[x])&gt;
&lt;/cfloop&gt;
</code>