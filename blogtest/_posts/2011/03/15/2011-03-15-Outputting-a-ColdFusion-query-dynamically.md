---
layout: post
title: "Outputting a ColdFusion query dynamically"
date: "2011-03-15T15:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/03/15/Outputting-a-ColdFusion-query-dynamically
guid: 4158
---

I've covered this topic a few times before, in various ways, but a reader wrote in today with a related question so I thought I'd write a quick "guide" to this topic. Basically - given any ColdFusion query - how would you loop over the data dynamically? Here is how I do it.
<!--more-->
<p>

First, let's start with a basic query:

<p>

<code>
&lt;cfquery name="getart" datasource="cfartgallery" maxrows="10"&gt;
select	artname, description, price, issold, artid
from	art	
&lt;/cfquery&gt;
</code>

<p>

To begin, I want to loop over every row. I can do that either with cfloop or cfoutput. cfoutput is the easiest way to do it as it automatically handles going from one to the total number of rows.

<p>

<code>
&lt;cfoutput query="getart"&gt;
stuff
&lt;/cfoutput&gt;
</code>

<p>

That gives us one iteration per query. So how do I get the data? Remember that queries can be accessed using struct notation. That syntax is:

<p>

queryname[columnname][rownumber]

<p>

So given a query called getart, a column called artid, and row 5, I can output it like so:

<p>

<code>
#getart["artid"][5]#
</code>

<p>

That works if you know the columns, but in this case, we are doing it dynamically. ColdFusion gives us easy access to the columns though. Every query contains a value called "columnlist". As you can imagine, it is a list of columns. We can loop over that list like so:

<p>

<code>
&lt;cfoutput query="getart"&gt;
	#currentrow#) 
	&lt;cfloop index="col" list="#columnlist#"&gt;
			#col#=#getart[col][currentRow]#
	&lt;/cfloop&gt;
	&lt;p/&gt;
&lt;/cfoutput&gt;
</code>

<p>

Where did currentRow come from? It's another built in variable. So what happens when we run this?

<p>

<code>
1) ARTID=1 ARTNAME=charles10b DESCRIPTION=2Pastels/Charcoal ISSOLD=1 PRICE=13002
2) ARTID=2 ARTNAME=Michael DESCRIPTION=Pastels/Charcoal ISSOLD=0 PRICE=13900

3) ARTID=3 ARTNAME=Freddy DESCRIPTION=Pastels/Charcoal ISSOLD=1 PRICE=12500

4) ARTID=4 ARTNAME=Paulo DESCRIPTION=Pastels/Charcoal ISSOLD=1 PRICE=11100

5) ARTID=5 ARTNAME=Mary DESCRIPTION=Pastels/Charcoal ISSOLD=1 PRICE=13550

6) ARTID=6 ARTNAME=Space DESCRIPTION=Mixed Media ISSOLD=1 PRICE=9800

7) ARTID=7 ARTNAME=Leaning House DESCRIPTION=Mixed Media ISSOLD=1 PRICE=7800

8) ARTID=8 ARTNAME=Dude DESCRIPTION=Mixed Media ISSOLD=1 PRICE=5600

9) ARTID=9 ARTNAME=Hang Ten DESCRIPTION=Mixed Media ISSOLD=0 PRICE=8900

10) ARTID=10 ARTNAME=Life is a Horse DESCRIPTION=Mixed Media ISSOLD=0 PRICE=10500
</code>

<p>

 Notice anything? The columns are not in the same order as the SQL. Now typically the order of columns in your SQL query shouldn't matter, but if you did want to use the same order you have yet another option: getMetaData. When called on the query like so:

<p>

<code>
&lt;cfset cols = getMetadata(getart)&gt;
</code>

<p>

You get an array of structs containing data about the columns:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip47.png" />

<p>

I can use this array to make a new list that respects the order from my query:

<p>

<code>
&lt;cfset colList = ""&gt;
&lt;cfloop from="1" to="#arrayLen(cols)#" index="x"&gt;
	&lt;cfset colList = listAppend(colList, cols[x].name)&gt;
&lt;/cfloop&gt;
</code>

<p>

Once I have that, I simply modify the code I used before to use colList instead of columnlist:

<p>

<code>
&lt;cfoutput query="getart"&gt;
	#currentrow#) 
	&lt;cfloop index="col" list="#collist#"&gt;
			#col#=#getart[col][currentRow]#
	&lt;/cfloop&gt;
	&lt;p/&gt;
&lt;/cfoutput&gt;
</code>

And that's it. I've pasted the entire test below if you want to play around with it.

<code>
&lt;cfquery name="getart" datasource="cfartgallery" maxrows="10"&gt;
select	artname, description, price, issold, artid
from	art	
&lt;/cfquery&gt;

&lt;cfoutput query="getart"&gt;
	#currentrow#) 
	&lt;cfloop index="col" list="#columnlist#"&gt;
			#col#=#getart[col][currentRow]#
	&lt;/cfloop&gt;
	&lt;p/&gt;
&lt;/cfoutput&gt;

&lt;cfset cols = getMetadata(getart)&gt;
&lt;cfset colList = ""&gt;
&lt;cfloop from="1" to="#arrayLen(cols)#" index="x"&gt;
	&lt;cfset colList = listAppend(colList, cols[x].name)&gt;
&lt;/cfloop&gt;

&lt;cfoutput query="getart"&gt;
	#currentrow#) 
	&lt;cfloop index="col" list="#collist#"&gt;
			#col#=#getart[col][currentRow]#
	&lt;/cfloop&gt;
	&lt;p/&gt;
&lt;/cfoutput&gt;
</code>