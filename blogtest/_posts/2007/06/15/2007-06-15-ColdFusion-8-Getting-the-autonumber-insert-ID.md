---
layout: post
title: "ColdFusion 8: Getting the autonumber insert ID"
date: "2007-06-15T23:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/15/ColdFusion-8-Getting-the-autonumber-insert-ID
guid: 2127
---

I love this. So I assume most folks knew about the result attribute added to cfquery in ColdFusion 7. If not - you are missing out. It returns quite a bit of good information about your query. But best of all - it was updated in ColdFusion 8.
<!--more-->
Have you ever inserted a record into a table that used an autonumber primary key? I bet you wanted a nice way to get the value of that ID? In SQL Server it is possible with a bit of extra SQL. MySQL - I'm not so sure. But as you can imagine - any solution you pick won't be very cross platform. This is the main reason I use UUIDs in my OS apps.

The good news is that in ColdFusion 8, the result struct will contain a new key that contains the ID of the row you just inserted. The key is different for each support DB. SQL Server returns a key named IDENTITYCOL. MySQL returns GENERATED_KEY. Other database types have their own names - but lets focus on MySQL. Here is the query I used:

<code>
&lt;cfquery datasource="test" result="result"&gt;
insert into test(name)
values('George Bush')
&lt;/cfquery&gt;
</code>

Now when I dump the result, I get: 

<img src="https://static.raymondcamden.com/images//sqldump.png">

Pretty handy!