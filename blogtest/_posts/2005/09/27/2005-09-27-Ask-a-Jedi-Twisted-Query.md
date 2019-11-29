---
layout: post
title: "Ask a Jedi: Twisted Query"
date: "2005-09-27T14:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/27/Ask-a-Jedi-Twisted-Query
guid: 811
---

This interesting question came in a few days ago:

<blockquote>
What's the easiest way to output a query in columns rather than rows?
</blockquote>

At first, I wasn't sure what the reader meant. Did he mean that he only wanted to display one column from a query? I don't think so. But just in case....

<code>
&lt;cfloop query="data"&gt;
	&lt;cfoutput&gt;#name#&lt;br&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

Maybe he thought that you needed to output <i>all</i> the values from a query and didn't realize you could just work with one column? Who knows. I've made some pretty silly mistakes in reasoning myself(*). 

Then I thought - maybe he wants to "twist" the traditional row by row display of a query and display one column of data as one row of a table. In other words, turn the normal table display around 90 degrees or so. This is also pretty simple. Let's look at the code and then I'll explain it.
<!--more-->
<code>
&lt;cfset data = queryNew("id,name,age")&gt;

&lt;cfloop index="x" from="1" to="10"&gt;
	&lt;cfset queryAddRow(data)&gt;
	&lt;cfset querySetCell(data,"id",x)&gt;
	&lt;cfset querySetCell(data,"name","User #x#")&gt;
	&lt;cfset querySetCell(data,"age",randRange(20,90))&gt;
&lt;/cfloop&gt;

&lt;table border="1"&gt;
&lt;cfloop index="col" list="#data.columnList#"&gt;
	&lt;tr&gt;
	&lt;cfoutput&gt;&lt;td&gt;&lt;b&gt;#col#&lt;/b&gt;&lt;/td&gt;&lt;/cfoutput&gt;
	&lt;cfloop query="data"&gt;
		&lt;cfoutput&gt;&lt;td&gt;#data[col][currentRow]#&lt;/td&gt;&lt;/cfoutput&gt;
	&lt;/cfloop&gt;
	&lt;/tr&gt;
&lt;/cfloop&gt;
&lt;/table&gt;
</code>

So, just ignore the beginning. All I'm doing is creating a fake query. I begin my table as you would normally. Now comes the changes. Instead of looping over the query, I loop over the column list. For each column, I start a new table row. I then loop over the query and output <i>only</i> my current column and current row using this syntax:

<code>
data[col][currentRow]
</code>

You may wonder - why didn't I use <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000662.htm">valueList</a>? For some reason, valueList was built to only allow for a <i>static</i> column. In other words, I would have to hard code data.id, or data.name, etc. You can use <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000458.htm">Evaluate</a> of course, but that is the tool of the Devil, so I recommend against it.

That's it. If you run this code you will see a nicely transformed query display. Now, I'm not sure <i>why</i> you would do this, but I'm sure there is a good reason. (Of course, half the things I code are for the heck of it and serve no practical purpose!)

*So, what silly mistake did I make? When I was learning AppleSoft BASIC, I read the docs on the syntax, but not very closely. So, I'd write a line of BASIC, and then start on a new line. I'd start on new line by hitting the space bar until the cursor wrapped to a new line. Ok, you can sto laughing now, I was only 12 or so!