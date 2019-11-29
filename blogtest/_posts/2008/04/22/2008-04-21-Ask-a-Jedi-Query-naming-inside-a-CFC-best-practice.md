---
layout: post
title: "Ask a Jedi: Query naming inside a CFC - best practice?"
date: "2008-04-22T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/22/Ask-a-Jedi-Query-naming-inside-a-CFC-best-practice
guid: 2781
---

Gary asks:

<blockquote>
<p>
I have a CFC that has several query functions. Each function returns a query:

&lt;cfquery name="getData" dbtype="query"&gt;<br>
SELECT  *<br>
FROM            arguments.adResults<br />
WHERE           cn='#arguments.netName#'<br/>
&lt;/cfquery&gt;

Each has cfquery name="getData" and cfreturn getData.

My question is, "Is there a reason not to name each query 'getData' or is this an accepted practice?" 
</p>
</blockquote>
<!--more-->
First, I want you to go into the corner, sit on your knees, and repeat "I will not select *" ten thousand times. Go ahead, I'll wait here. (grin)

Ok, so this is a simple question. First off, ColdFusion doesn't give two hoots what you name your query, whether it be in a CFC or not. You do want to make sure you var scope the name of course:

<code>
&lt;cfset var getData = ""&gt;
</code>

But outside of that, I'd name it whatever you want. Now <i>normally</i> I recommend folks name their query based on what it does. So for example, a query to get users would be called getUsers. But in CFCs I don't bother. I figure if the method is named getUsers, the query name isn't that critical, and in fact, I will typically use "q" to make it short and sweet. In more complex CFC methods, where I'm not just doing a quick query and returning data, I definitely try to use more descriptive names, especially if multiple queries are being run.