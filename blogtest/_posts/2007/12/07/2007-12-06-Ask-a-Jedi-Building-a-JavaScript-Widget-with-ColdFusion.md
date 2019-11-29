---
layout: post
title: "Ask a Jedi: Building a JavaScript Widget with ColdFusion"
date: "2007-12-07T07:12:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2007/12/07/Ask-a-Jedi-Building-a-JavaScript-Widget-with-ColdFusion
guid: 2521
---

Shimju asks:

<blockquote>
<p>
How can we create Javascript widget from a coldfusion query.

In more detail, we will ask our website visitors to signup for using our widget. While doing so, they will be asked to select which news categories they are interested and how many news they want to display on their site. And once user clicks submit button a Javascript code should generate and they can place it on their websites for appearing our widget with selected number of news from subscribed categories.
Please advice how to do this?
</p>
</blockquote>

This is fairly simple. You are really talking about two particular things here. Building a JavaScript widget driven by URL parameters, and building a front-end "designer" to let folks get the JavaScript code. I'm going to focus on the widget aspect as the front end part you mention is rather trivial once you have the widget built. 

The process to embed a widget from another site is simple. I can embed a JavaScript file from Adobe by doing this:

<code>
&lt;script src="http://www.adobe.com/foo.js"&gt;&lt;/script&gt;
</code>

Since the browser doesn't care about the file extension, I could also do:

<code>
&lt;script src="http://www.adobe.com/foo.cfm"&gt;&lt;/script&gt;
</code>

As long as the script outputs valid JavaScript code, it will work just fine. You specifically talked about embedding news, so lets look at a simple example of this. First I'll build a random query:

<code>
&lt;cfset news = queryNew("articleurl,title,category")&gt;
&lt;cfloop index="x" from="1" to="20"&gt;
	&lt;cfset newurl = "http://someurl.com/#x#.html"&gt;
	&lt;cfset newtitle = "News Story #x#"&gt;
	&lt;cfset newcategory = listGetAt("Cats,Dogs",randRange(1,2))&gt;
	&lt;cfset queryAddRow(news)&gt;
	&lt;cfset querySetCell(news, "articleurl", newurl)&gt;
	&lt;cfset querySetCell(news, "title", newtitle)&gt;
	&lt;cfset querySetCell(news, "category", newcategory)&gt;
&lt;/cfloop&gt;
</code>

Obviously this stuff would be a "real" database hit. Next I want to allow folks to filter both by a max number of entries as well as by category:

<code>
&lt;cfparam name="url.max" default="10"&gt;
&lt;cfparam name="url.category" default=""&gt;

&lt;!--- handle getting right data ---&gt;
&lt;cfquery name="news" dbtype="query" maxrows="#url.max#"&gt;	
select	*
from	news
&lt;cfif url.category is not ""&gt;
where	lower(category) = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#lcase(url.category)#"&gt;
&lt;/cfif&gt;
&lt;/cfquery&gt;
</code>

Nothing too complex about that so I won't cover it in detail. I will mention one tip about maxrows however. If you pass a maxrows of -1, it is the same as all rows. This is a handy way to use maxrows and still allow folks to <i>not</i> specify a maximum number of rows. 

Ok, so far so good. Now we need to output some JavaScript. If I just output simple text, the browser won't know what to do with it. I chose to use document.write. This is probably not the best idea, but it works. I'm definitely open to better alternatives though. Here is my output:

<code>
&lt;cfoutput&gt;
document.write("&lt;table border='1' bgcolor='yellow'&gt;&lt;tr&gt;&lt;td&gt;");
&lt;cfloop query="news"&gt;
	document.write("&lt;a href='#articleurl#'&gt;#title#&lt;/a&gt; [#category#]&lt;br&gt;");
&lt;/cfloop&gt;
document.write("&lt;/table&gt;");
&lt;/cfoutput&gt;
</code>

As you can see, I used a simple table to output the query. Now if you wanted to embed this on your site, you would just use this syntax to get 4 Cat stories

<code>
&lt;script src="http://192.168.1.102/test2.cfm?max=4&category=cats"&gt;&lt;/script&gt;
</code>

Or this syntax to get 10 stories on dogs and cats.

<code>
&lt;script src="http://192.168.1.102/test2.cfm"&gt;&lt;/script&gt;
</code>

Pretty simple stuff, but you can make it more complex of course. Does anyone have any examples of this they would like to share?