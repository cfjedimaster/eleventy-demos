---
layout: post
title: "Ask a Jedi: Randomizing the display of a query"
date: "2007-12-04T13:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/04/Ask-a-Jedi-Randomizing-the-display-of-a-query
guid: 2514
---

Charles asks a pretty common question about randomizing the result of a query:

<blockquote>
<p>
I have a simple page that loops a couple queries and randomly issues the question and choices.  I have the loop go from 1 to 10; however sense I do not want to have duplicate questions, I did a conditional that does not allow dups to be shown.  In turn, instead of giving me my nice 1-10 quiz, I get random amount of questions.  I completely understand why this is happening, but have trouble coming up with a solution. 
</p>
</blockquote>
<!--more-->
As I said above, this is a fairly common question. The best solution is to randomize the results at the database level. There are various ways to do that depending on your database type. But if you can't do that, and want to do it in CFML, it is fairly straightforward. Let's begin by creating a fake query:

<code>
&lt;cfset data = queryNew("id,name")&gt;
&lt;cfloop index="x" from="1" to="10"&gt;
	&lt;cfset queryAddRow(data)&gt;
	&lt;cfset querySetCell(data, "id", x)&gt;
	&lt;cfset querySetCell(data, "name", "Name #x#")&gt;
&lt;/cfloop&gt;
</code>

Now that we have a query, how can we loop through it randomly? There are multiple solutions. Here is one way of doing it. 

The first thing I'll do is generate a list of rows. If the query has 3 rows, than I want "1,2,3". If it has 4, then "1,2,3,4". 

<code>
&lt;!--- generate a list of rows ---&gt;
&lt;cfset rowList = ""&gt;
&lt;cfloop index="x" from="1" to="#data.recordCount#"&gt;
	&lt;cfset rowList = listAppend(rowList, x)&gt;
&lt;/cfloop&gt;
</code>

Why do I do this instead of using a simple valueList()? I'll get to that in a minute. Now that I have a list of rows, I want to randomize the list. 

<code>
&lt;!--- now randomize ---&gt;
&lt;cfset rList = ""&gt;
&lt;cfloop condition="listLen(rowList)"&gt;
	&lt;!--- pick a random position ---&gt;
	&lt;cfset pos = randRange(1, listLen(rowList))&gt;
	&lt;!--- get the row ---&gt;
	&lt;cfset row = listGetAt(rowList, pos)&gt;
	&lt;!--- add to rList ---&gt;
	&lt;cfset rList = listAppend(rList, row)&gt;
	&lt;!--- remove from rowList ---&gt;
	&lt;cfset rowList = listDeleteAt(rowlist, pos)&gt;
&lt;/cfloop&gt;
</code>

This code loops over the original rowList. In each iteration, I grab a random value, add it to rList, and remove it from rowList. Once down, rList is a randomized version of rowList. (rowList is destroyed, but I don't need it anymore after this.)

Now I can use the rList list like so:

<code>
&lt;cfloop index="row" list="#rList#"&gt;
	&lt;cfoutput&gt;Name: #data.name[row]#&lt;br /&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

Do you see now why I got a list of rows, not a list of values? Imagine I had gotten a list of primary key values using valueList. In order to display the right data, I'd have to find the row for that primary key. I could do that with a query of query, or a listFind. That would work, but I felt this was a simpler solution. The complete template is listed below.

<code>
&lt;cfset data = queryNew("id,name")&gt;
&lt;cfloop index="x" from="1" to="10"&gt;
	&lt;cfset queryAddRow(data)&gt;
	&lt;cfset querySetCell(data, "id", x)&gt;
	&lt;cfset querySetCell(data, "name", "Name #x#")&gt;
&lt;/cfloop&gt;

&lt;!--- generate a list of rows ---&gt;
&lt;cfset rowList = ""&gt;
&lt;cfloop index="x" from="1" to="#data.recordCount#"&gt;
	&lt;cfset rowList = listAppend(rowList, x)&gt;
&lt;/cfloop&gt;

&lt;!--- now randomize ---&gt;
&lt;cfset rList = ""&gt;
&lt;cfloop condition="listLen(rowList)"&gt;
	&lt;!--- pick a random position ---&gt;
	&lt;cfset pos = randRange(1, listLen(rowList))&gt;
	&lt;!--- get the row ---&gt;
	&lt;cfset row = listGetAt(rowList, pos)&gt;
	&lt;!--- add to rList ---&gt;
	&lt;cfset rList = listAppend(rList, row)&gt;
	&lt;!--- remove from rowList ---&gt;
	&lt;cfset rowList = listDeleteAt(rowlist, pos)&gt;
&lt;/cfloop&gt;

&lt;cfloop index="row" list="#rList#"&gt;
	&lt;cfoutput&gt;Name: #data.name[row]#&lt;br /&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>