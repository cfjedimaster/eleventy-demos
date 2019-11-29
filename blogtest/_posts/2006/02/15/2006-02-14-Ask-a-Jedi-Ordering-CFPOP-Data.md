---
layout: post
title: "Ask a Jedi: Ordering CFPOP Data"
date: "2006-02-15T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/15/Ask-a-Jedi-Ordering-CFPOP-Data
guid: 1100
---

Robert writes in with a question concerning CFPOP:

<blockquote>
I have put together a little webail app  for my website and for the most part it works pretty good but.... It returns the mail messages in a seemingly random order. Is there a way to order the results?
</blockquote>

I could have sworn that I remember CFPOP returning items in order of delivery. In other words, the first message sent to the account would be the first downloaded. The documentation for cfpop does not specify an order, so I probably wouldn't depend on any order. 

That being said - don't forget that the result of cfpop is a query. Because of this, you can use query of query to sort the results. You can sort by sender, date, subject, or any other column. Here is a simple example:

<code>
&lt;cfpop server="pop.xxx.com" username="..." password="..." action="getHeaderOnly" name="qGetMessages"&gt;

&lt;cfquery name="qGetMessages" dbtype="query"&gt;
select   *
from     qGetMessages
order by date desc
&lt;/cfquery&gt;
</code>