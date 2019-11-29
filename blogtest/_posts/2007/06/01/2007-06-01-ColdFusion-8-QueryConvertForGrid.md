---
layout: post
title: "ColdFusion 8: QueryConvertForGrid"
date: "2007-06-01T18:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/01/ColdFusion-8-QueryConvertForGrid
guid: 2083
---

One of the cool new UI elements we have in ColdFusion 8 is the AJAX based grid. It can be bound to external data and allows for sorting and paging. This is pretty cool and all - and I'll blog more about it later, but I wanted to talk about  a small little function that is used to help drive the grid - queryConvertForGrid.
<!--more-->
Before you can hook up a cfgrid to the result of a CFC, you have to format the data in a special way. Instead of just returning a query, you must return a structure with two keys: query and totalrowcount. 

The query is <b>not</b> your complete recordset. Instead, it is the current "page" of data. All cfgrid AJAX requests will pass to your CFC the current page. So you might think that you need to do a bit of math to figure out the current "slice" of data to return. You certainly could too - but this is where queryConvertForGrid comes into play.

So lets take a concrete example. You may remember my <a href="http://ray.camdenfamily.com/index.cfm/2007/5/31/ColdFusion-8-Demo-of-CFGRID-Ajax-binding-and-CFWINDOW">Traffic</a> demo from yesterday. This demo used a grid that spoke to a CFC that in turn spoke to my Yahoo engine (which in turn spoke to Yahoo's services). The grid "spoke" to my CFC and passed along:

<ul>
<li>The page to fetch
<li>The size of my pages
<li>SortCol and SortDir (not discussed today)
<li>And the Zip Code
</ul>

My CFC then handled getting the data (and potentially sorting). But to return the proper data, I simply used queryConvertForGrid. This function takes three arguments: A query, a page number, and the page size. Here is a simple example using a pre-built query:

<code>
&lt;cfset foo = queryNew("id,name,age,gender")&gt;

&lt;cfscript&gt;
for(i=1; i &lt;= 200; i++) {
	queryAddRow(foo);
	querySetCell(foo, "id", i, i);
	querySetCell(foo, "name", "Name #i#", i);
	querySetCell(foo, "age", randRange(18,65), i);
	querySetCell(foo, "gender", listGetAt("male,female", randRange(1,2)), i);
}
&lt;/cfscript&gt;

&lt;cfset slice1 = queryConvertForGrid(foo, 1, 20)&gt;
&lt;cfset slice2 = queryConvertForGrid(foo, 2, 20)&gt;
&lt;cfset slicex = queryConvertForGrid(foo, 99, 20)&gt;

&lt;cfdump var="#slice1#" label="First Page"&gt;
&lt;cfdump var="#slice2#" label="Second Page"&gt;
&lt;cfdump var="#slicex#" label="Page 99"&gt;
</code>

I have three calls to the queryConvertForGrid function. Each one passes in my query. The first call gets page 1. The second gets page 2. The last gets page 99. If you run this, you will see that each dump returns a slice of the initial 200 row query. You will also notice that it fails silently on page 99. (Is that good? Bad? I'm not sure.)

So as you can see, this function takes out some of the grunt work we have to do in order to hook up our CFCs to the new AJAX goodness on the front end.

Now I do have one point I'd like folks to consider. This function makes it super easy to get the page. But I'm still getting all 200 rows up front. You may want to consider doing your paging in SQL, especially MySQL since it makes it so easy. In fact, you can even write a query in MySQL that will get both a "page" and the total row count. (I discussed this <a href="http://ray.camdenfamily.com/index.cfm/2007/1/24/MySQL-Tip--Finding-total-rows-for-a-query-that-uses-Limit">here</a>.) So if you can easily do the paging yourself, it may make sense to do so and improve the performance of your application.

In my next entry I'll give a nice complete demo of cfgrid and a bound CFC. And lastly - I have to admit that the cfscript block above just makes me plain giddy. (Yes, I'm a Scorpio Geek.)