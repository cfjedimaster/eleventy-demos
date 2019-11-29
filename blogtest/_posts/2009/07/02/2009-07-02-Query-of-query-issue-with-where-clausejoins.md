---
layout: post
title: "Query of query issue with where clause/joins"
date: "2009-07-02T17:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/02/Query-of-query-issue-with-where-clausejoins
guid: 3418
---

A user reported this to me earlier in the week. I was sure he was wrong until I confirmed it myself. Imagine you have 2 queries you want to join using a query of query. Here is a quick sample.
<!--more-->
<p>
<code>
&lt;cfquery name="q" datasource="blogdev" maxrows="5"&gt;
select	id, title,posted
from	tblblogentries
order by posted desc
&lt;/cfquery&gt;
&lt;cfquery name="q2" datasource="blogdev" maxrows="5"&gt;
select	id, title,posted
from	tblblogentries
order by posted asc
&lt;/cfquery&gt;
</code>
<p>
Admittedly, this is kind of a dumb example, but I wanted to keep it simple. q is a query sorted by posted, descending, and q2 is the reverse of that. To join with query of queries, you must use a where clause, you can't use join. Here is the QofQ I used:
<p>
<code>
&lt;cfquery name="z" dbtype="query"&gt;
select	q.posted, q.id, q.title, q2.id as qid
from	q,q2
where q.id = q2.id
order by q.id asc
&lt;/cfquery&gt;
</code>
<p>
Note that I gave the new query the name z. Everything should be kosher, right? Well watch what happens when I dump q before and after the query of query.
<p>
<img src="https://static.raymondcamden.com/images//Picture 169.png">
<p>
What the heck, right? The error goes away if you make a duplicate of q and use that in the query of query.