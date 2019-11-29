---
layout: post
title: "Ask a Jedi: Wrapping List Elements in ColdFusion"
date: "2006-06-21T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/21/Ask-a-Jedi-Wrapping-List-Elements-in-ColdFusion
guid: 1347
---

This is a short and simple questions I thought may be interesting to beginners:

<blockquote>
I have a query "Select * From PhotoTable, Category Where PhotoTable.FileName IN ('#KeywordSearchResults#') AND CategoryID = Category.ID
Order by CategoryPrefix, Filename ASC"
I am using a ValueList that is dynamically generated. I need to know how I can define a custom delimiter in valuelist so that the values appear as 'a',b','c'. Right now whatever I do either i get single quote or comma. Please Help.
</blockquote>

First off - you know the select * is bad, right? Never, ever, use select *. Always list out the columns. Also, you want to replace the simple #KeywordSearchResults# variable with a cfqueryparam tag. But that's not why you are here.

In case folks don't know, the <a href="http://www.techfeed.net/cfQuickDocs/?ValueList">valueList</a> function gets you all the values from one column of a query. It's a handy little function. To use a custom delimiter, just supply a second argument to the function. So for example, this would use the @ sign:

<code>
&lt;cfset values = valueList(myQuery, "@")&gt;
</code>

However, the writer wants to wrap each list item with single quotes. You can't do this with valueList. Luckily ColdFusion provides us with <a href="http://www.techfeed.net/cfQuickDocs/?ListQualify">listQualify</a>. This function will wrap each list item with a character. So to add single quotes to the code above, you would do this:

<code>
&lt;cfset values = valueList(myQuery, "@")&gt;
&lt;cfset niceList = listQualify(values, "'")&gt;
</code>

One little thing about valueList. It doesn't allow for dynamic column names. If you want to dynamically get one column, you can treat the column as an array:

<code>
&lt;cfset col = "id"&gt;
&lt;cfset values = arrayToList(myQuery[col])&gt;
</code>