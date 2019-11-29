---
layout: post
title: "Gotta Love that Typeless ColdFusion Goodness!"
date: "2005-08-16T13:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/16/Gotta-Love-that-Typeless-ColdFusion-Goodness
guid: 702
---

So, I was looking into a possible <a href="http://www.houseoffusion.com/lists.cfm/link=i:4:215182">CFINDEX</a> bug reported on the cf-talk list. The user reported something odd when indexing a query that had duplicate keys in it. In case you don't know - when passing data to Verity to index, each record must have a unique key. This could be the primary key field for your database table. Whatever it is - it needs to be unique. I suggested the user try the status attribute. This is a neat new tool in CFMX7 that allows you to see <i>exactly</i> what happens after an index operation. It can tell you, for example, that even though you passed in 9 records, only 7 were indexed. Further investigation of the data would turn up the duplicate keys.

So, I wanted to look into the user's bug report. I created a query that contained duplicate keys. I'll show the code before I tell you what happened.

<div class="code"><FONT COLOR=MAROON>&lt;cfindex collection=<FONT COLOR=BLUE>"test1"</FONT> action=<FONT COLOR=BLUE>"purge"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfset q = queryNew(<FONT COLOR=BLUE>"products,score,key"</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"x"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"5"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset queryAddRow(q)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(q, <FONT COLOR=BLUE>"products"</FONT>, <FONT COLOR=BLUE>"Product #x#"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(q, <FONT COLOR=BLUE>"score"</FONT>, randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>))&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(q,<FONT COLOR=BLUE>"key"</FONT>,x)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
<FONT COLOR=GRAY><I>&lt;!--- the above is <FONT COLOR=BLUE>"good"</FONT> data ---&gt;</I></FONT><br>
<br>
<FONT COLOR=GRAY><I>&lt;!--- now add <FONT COLOR=BLUE>"bad"</FONT> data ---&gt;</I></FONT><br>
<FONT COLOR=MAROON>&lt;cfset queryAddRow(q)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset querySetCell(q, <FONT COLOR=BLUE>"products"</FONT>, <FONT COLOR=BLUE>"Product 5 DUPE1"</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset querySetCell(q, <FONT COLOR=BLUE>"score"</FONT>, randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>))&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset querySetCell(q,<FONT COLOR=BLUE>"key"</FONT>,<FONT COLOR=BLUE>5</FONT>)&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfdump var=<FONT COLOR=BLUE>"#q#"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfindex query=<FONT COLOR=BLUE>"q"</FONT><br>
         collection=<FONT COLOR=BLUE>"test1"</FONT><br>
         action=<FONT COLOR=BLUE>"update"</FONT><br>
         type=<FONT COLOR=BLUE>"custom"</FONT><br>
         key=<FONT COLOR=BLUE>"key"</FONT><br>
         title=<FONT COLOR=BLUE>"products"</FONT><br>
         body=<FONT COLOR=BLUE>"products,score"</FONT><br>
&nbsp;&nbsp;&nbsp; status=<FONT COLOR=BLUE>"status"</FONT><br>
         &gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
<FONT COLOR=MAROON>&lt;cfdump var=<FONT COLOR=BLUE>"#status#"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfsearch collection=<FONT COLOR=BLUE>"test1"</FONT> status=<FONT COLOR=BLUE>"search_status"</FONT> criteria=<FONT COLOR=BLUE>"*"</FONT> name=<FONT COLOR=BLUE>"results"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfdump var=<FONT COLOR=BLUE>"#results#"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfdump var=<FONT COLOR=BLUE>"#search_status#"</FONT>&gt;</FONT></div>

Don't run this code. Just look at. Looking at the title of this post, try to guess what happened. Take your time. I'll be waiting here.

Back already? If you do actually run this code, you will see that six records get inserted, not five as you may think. Why? Notice the dump of the search, specifically notice the key value: 

<img src="http://ray.camdenfamily.com/images/veritything1.jpg">

We have a value for both "5" and "5.0". For some reason, the insert done in the loop was a numeric value and the value done manually was a string. This is hard to debug since a dump of the query shows "5" for both. 

However - this is an excellent time to remind folks that when they create queries as I did, with queryNew, you can now provide metadata about the query. If I change my queryNew to this:

queryNew("products,score,key","varchar,integer,integer")

The code works as expected. In general, I try to be as anal as possible when it comes to my code. It's times like this when it actually helps!