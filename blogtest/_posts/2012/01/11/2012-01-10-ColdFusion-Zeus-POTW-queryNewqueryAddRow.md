---
layout: post
title: "ColdFusion Zeus POTW: queryNew/queryAddRow"
date: "2012-01-11T11:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/01/11/ColdFusion-Zeus-POTW-queryNewqueryAddRow
guid: 4492
---

Time for another ColdFusion Zeus preview - this one being simply a modification to two functions but one I've wanted for a while. One of the nicest datatypes in ColdFusion is the query. I'd be willing to bet that the cfquery/cfoutput query="..." combo are the most important features of ColdFusion. Query variables are used in many places, not just database calls. The cfdirectory tag, for example, returns a query object. Queries are so handy, you can actually create your own on the fly using a combination of queryNew, queryAddRow, and querySetCell. As a blogger, I tend to make use of this quite a bit. It allows me to quickly create fake queries without having to setup a database and populate it with data. It's also handy for times when you may not have access to a database and need to mock something up. I once worked on a project where the DBA was out for a few days due to illness and couldn't give us access to their system. We made use of queryNew in our components and carried on. When the DBA returned, we replaced the fake queries with real ones and everything was kosher.
<!--more-->
<p>

As useful as these tags are, they can be a bit of a pain to type in. Consider for example a simple fake set of user data.

<p>

<code>
&lt;cfset users = queryNew("id,username,password", "varchar,varchar,varchar")&gt;
&lt;cfset queryAddRow(users, 4)&gt;

&lt;cfset querySetCell(users, "id", 1, 1)&gt;
&lt;cfset querySetCell(users, "username", "bob", 1)&gt;
&lt;cfset querySetCell(users, "password", "unicoron", 1)&gt;
&lt;cfset querySetCell(users, "id", 2, 2)&gt;
&lt;cfset querySetCell(users, "username", "scott", 2)&gt;
&lt;cfset querySetCell(users, "password", "ilikesoccer", 2)&gt;
&lt;cfset querySetCell(users, "id", 3, 3)&gt;
&lt;cfset querySetCell(users, "username", "todd", 3)&gt;
&lt;cfset querySetCell(users, "password", "icheatoncod", 3)&gt;
&lt;cfset querySetCell(users, "id", 4, 4)&gt;
&lt;cfset querySetCell(users, "username", "ray", 4)&gt;
&lt;cfset querySetCell(users, "password", "icodesmelly", 4)&gt;

&lt;cfdump var="#users#"&gt;
</code>

<p>

I've got one line to create the initial query, one to add some rows, then a bunch of querySetCells to populate it. That's a lot of typing. There is also queryAddColumn. It lets you add a column and populate it with an array of values. But since queryNew expects at least one column, you're still going to have to do one the "ugly" way.

<p>

ColdFusion Zeus expands both queryNew and queryAddRow so you can immediately set data in the query object. First, queryNew can now take an array of structs:

<p>

<code>
&lt;cfset users = queryNew("id,username,password","varchar,varchar,varchar",
	[{% raw %}{id:1, username:"bob", password:"unicoron"}{% endraw %},
	 {% raw %}{id:2, username:"scott", password:"ilikesoccer"}{% endraw %},
	 {% raw %}{id:3, username:"todd", password:"icheatoncod"}{% endraw %},
	 {% raw %}{id:4, username:"ray", password:"icodesmelly"}{% endraw %}])&gt;
</code>

<p>

Second - queryAddRow can take either an array of structs or a struct. This allows you to either add a bunch of rows or just one more row.

<p>

<code>
&lt;cfset queryAddRow(users, {% raw %}{id:5, username:"vader", password:"whiny"}{% endraw %})&gt;
</code>


<p>

Make sense?