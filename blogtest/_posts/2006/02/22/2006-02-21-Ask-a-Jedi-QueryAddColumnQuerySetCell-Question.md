---
layout: post
title: "Ask a Jedi: QueryAddColumn/QuerySetCell Question"
date: "2006-02-22T06:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/22/Ask-a-Jedi-QueryAddColumnQuerySetCell-Question
guid: 1117
---

A reader asks:

<blockquote>
Is there any benefit to use the queryAddColumn/querySetCell functions instead of using just one SQL statement?
</blockquote>

As far as I know - no. One of the general tips I would pass on to people is - if you ever find yourself doing post processing on a query, either in the output, or in the data itself, you should go back to your original SQL and see if you can change it there instead. Here are a few examples....
<!--more-->
<ul>
<li>You run a query to get the title and body from a table. When you output, however, you use left(body, 500) to create an abstract from the body. It would be better to do the left() in the original sql. This reduces the amount of data being transferred and the amount of work ColdFusion is doing. As a proud member of the Lazy Organization, less work is good(tm).
<li>You perform a query to get people's gender and age. When displaying this query, you do some logic to see if they are male and over 50, or female and over 45, and if so, you flag the row. This too can be done in the original SQL using a CASE statement I believe. (I always have to look up my reference guide for using CASE.)
</ul>

The point is - if you aren't just dumping the query straight to output, you may want to look at the logic you are doing and see if it can be moved to SQL. Now - this is <i>definitely</i> one of those tips where I do not always practice what I preach, but it is a good tip to watch out for. 

I'd say I probably only use querySetCell() when I'm building a test query by hand. That by itself is pretty useful. You don't always have a database available, so queryNew(), querySetCell(), and queryAddColumn() are a good way to create some quick sample data for testing purposes.