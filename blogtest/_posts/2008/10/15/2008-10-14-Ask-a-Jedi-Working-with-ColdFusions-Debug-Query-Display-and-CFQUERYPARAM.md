---
layout: post
title: "Ask a Jedi: Working with ColdFusion's Debug Query Display and CFQUERYPARAM"
date: "2008-10-15T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/15/Ask-a-Jedi-Working-with-ColdFusions-Debug-Query-Display-and-CFQUERYPARAM
guid: 3054
---

Eric asked a question I thought others might be interested in as well:

<blockquote>
<p>
Ray, I often find it useful when a cfquery tanks to take the SQL code provided in the error, put it into my editor, and play around with the code there.  However, when using cfqueryparam, this becomes a much bigger challenge because the values are not directly in the SQL query.  I have to sort through the param structure and manually replace the values with (param 1) etc.  Is there any way to grab the query with the param values replaced?
</p>
</blockquote>
<!--more-->
If you don't know what he means, he is talking about debug displays like so....

<img src="https://static.raymondcamden.com/images/Picture 43.png">

There are multiple ways you can work with this. Obviously you can cut and paste, but for anything besides a simple query, this is going to be difficult. <a href="http://coldfire.riaforge.org">ColdFire</a> automatically replaces the ? when it displays the query:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 38.png">

Other options include additional plugins by Nathan Mische (who is running ColdFire now don't forget):

<a href="http://www.mischefamily.com/nathan/index.cfm/2007/3/15/CF-Debug-Copy-for-FireFox">CF Debug Copy for Fire</a>: This will work with ColdFusion's classic debug output and let you simply right click/copy into the correct format.

<a href="http://www.mischefamily.com/nathan/index.cfm/2007/1/4/ColdFusion-Debug-SQL-Explorer-Extension">ColdFusion Debug SQL Explorer Extension</a>: This is another option that works with an Eclipse plugin. CFEclipse users may prefer this one, but I haven't tried it myself. (My queries never have errors. Ever.)