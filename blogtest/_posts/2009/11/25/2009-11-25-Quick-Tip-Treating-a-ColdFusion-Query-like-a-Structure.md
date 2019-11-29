---
layout: post
title: "Quick Tip - Treating a ColdFusion Query like a Structure"
date: "2009-11-25T13:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/25/Quick-Tip-Treating-a-ColdFusion-Query-like-a-Structure
guid: 3622
---

I've mentioned this before, but as it came across today on my <a href="http://www.raymondcamden.com/forums/messages.cfm?threadid=B7B75388-087A-5C47-43ABA869EA6C7FEE&page=1">forums</a>, I thought it wouldn't hurt to write up a quick example. ColdFusion queries are pretty easy to work with. You have multiple options for looping over them and can easily address the data when using a cfoutput:
<!--more-->
<code>
&lt;cfoutput query="getArt"&gt;
Art: #artname#&lt;br/&gt;
&lt;/cfoutput&gt;
</code>

Outputting a query is probably one of the first things we do as ColdFusion developers. The user on my forums though had a problem where he didn't know the exact name of the column. He knew it would begin with "b" and the rest of the column would be based on some other variable.

ColdFusion allows us to treat a query like a structure of arrays. By that I mean you can address a column using structure notation and you get a particular row by using array notation. 

So given that the column is "b"+groupid, and given that you are inside a query driven cfoutput, you can use this syntax:

<code>
&lt;cfoutput query="getStuff"&gt;
#getStuff["b#groupid#"][currentRow]#
&lt;/cfoutput&gt;
</code>

currentRow is simply one of those built in variables you have when working with a query. 

The only real caveat to this valueList function. It requires a hard coded query and column name. If you wanted to use valueList with the dynamic column above, you would need to use evaluate (which, remember, isn't the end of the world like it used to be):

<code>
&lt;cfset list = evaluate("valueList(getStuff.b#groupid#)")&gt;
</code>