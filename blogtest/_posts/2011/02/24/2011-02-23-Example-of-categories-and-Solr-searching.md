---
layout: post
title: "Example of categories and Solr searching"
date: "2011-02-24T08:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/24/Example-of-categories-and-Solr-searching
guid: 4136
---

Earlier this week a reader came to me with an interesting question. They were using Solr and ColdFusion 9 and had a collection of products they wanted searched. That part wasn't difficult. But here comes the interesting part. His products were split between male and female products (imagine clothing) as well as unisex items. A search for male products should return both male and unisex items while a search for female products would return female and unisex. This ended up being pretty easy to do and I thought I'd share the example code I wrote.
<!--more-->
<p>

I'll begin by sharing the test script I wrote to setup the collection and index. This handles the initial collection creation and then populates the index with fake data. Obviously I could have made this data bit more interesting but hopefully you can see that I've got some male, some female, and some unisex products.

<p>

<code>
&lt;cfset collection = "productgender"&gt;
&lt;cfcollection action="list" engine="solr" name="collections"&gt;

&lt;cfif not listFindNoCase(valueList(collections.name),collection)&gt;
	&lt;cfcollection action="create" collection="#collection#" path="#server.coldfusion.rootdir#\collections" engine="solr" categories="true"&gt;
	&lt;cfoutput&gt;
	Making collection.
	&lt;p/&gt;
	&lt;/cfoutput&gt;
&lt;/cfif&gt;

&lt;cfset products = queryNew("id,title,body,gender","integer,varchar,varchar,varchar")&gt;
&lt;cfset queryAddRow(products)&gt;
&lt;cfset querySetCell(products, "id", 1)&gt;
&lt;cfset querySetCell(products, "title", "Boy One")&gt;
&lt;cfset querySetCell(products, "body", "Body One")&gt;
&lt;cfset querySetCell(products, "gender", "male")&gt;
&lt;cfset queryAddRow(products)&gt;
&lt;cfset querySetCell(products, "id", 2)&gt;
&lt;cfset querySetCell(products, "title", "Boy Two")&gt;
&lt;cfset querySetCell(products, "body", "Body Two")&gt;
&lt;cfset querySetCell(products, "gender", "male")&gt;
&lt;cfset queryAddRow(products)&gt;
&lt;cfset querySetCell(products, "id", 3)&gt;
&lt;cfset querySetCell(products, "title", "Boy Three")&gt;
&lt;cfset querySetCell(products, "body", "Body Three")&gt;
&lt;cfset querySetCell(products, "gender", "male")&gt;
&lt;cfset queryAddRow(products)&gt;
&lt;cfset querySetCell(products, "id", 4)&gt;
&lt;cfset querySetCell(products, "title", "Girl One")&gt;
&lt;cfset querySetCell(products, "body", "Body One")&gt;
&lt;cfset querySetCell(products, "gender", "female")&gt;
&lt;cfset queryAddRow(products)&gt;
&lt;cfset querySetCell(products, "id", 5)&gt;
&lt;cfset querySetCell(products, "title", "Girl Two")&gt;
&lt;cfset querySetCell(products, "body", "Body Two")&gt;
&lt;cfset querySetCell(products, "gender", "female")&gt;
&lt;cfset queryAddRow(products)&gt;
&lt;cfset querySetCell(products, "id", 6)&gt;
&lt;cfset querySetCell(products, "title", "Girl Three")&gt;
&lt;cfset querySetCell(products, "body", "Body Three")&gt;
&lt;cfset querySetCell(products, "gender", "female")&gt;
&lt;cfset queryAddRow(products)&gt;
&lt;cfset querySetCell(products, "id", 7)&gt;
&lt;cfset querySetCell(products, "title", "Girl Four")&gt;
&lt;cfset querySetCell(products, "body", "Body Four")&gt;
&lt;cfset querySetCell(products, "gender", "female")&gt;
&lt;cfset queryAddRow(products)&gt;
&lt;cfset querySetCell(products, "id", 8)&gt;
&lt;cfset querySetCell(products, "title", "Girl Five")&gt;
&lt;cfset querySetCell(products, "body", "Body Five")&gt;
&lt;cfset querySetCell(products, "gender", "female")&gt;
&lt;cfset queryAddRow(products)&gt;
&lt;cfset querySetCell(products, "id", 9)&gt;
&lt;cfset querySetCell(products, "title", "Unisex One")&gt;
&lt;cfset querySetCell(products, "body", "Body One")&gt;
&lt;cfset querySetCell(products, "gender", "unisex")&gt;
&lt;cfset queryAddRow(products)&gt;
&lt;cfset querySetCell(products, "id", 10)&gt;
&lt;cfset querySetCell(products, "title", "Unisex Two")&gt;
&lt;cfset querySetCell(products, "body", "Body Two")&gt;
&lt;cfset querySetCell(products, "gender", "unisex")&gt;

&lt;cfindex action="refresh" collection="#collection#" query="products" key="id" title="title" body="body" category="gender" status="s"&gt;
&lt;cfdump var="#s#"&gt;
</code>

<p>

Very exciting, right? Well let's look at the search interface where things do get a bit interesting.

<p>

<code>
&lt;cfparam name="form.search" default=""&gt;
&lt;cfparam name="form.gender" default=""&gt;

&lt;cfoutput&gt;
&lt;form action="test.cfm" method="post"&gt;
Keyword:&lt;br/&gt;
&lt;input type="test" name="search" value="#form.search#"&gt;&lt;br/&gt;
Gender:&lt;br/&gt;
&lt;select name="gender"&gt;
&lt;option value="" &lt;cfif form.gender is ""&gt;selected&lt;/cfif&gt;&gt;--&lt;/option&gt;
&lt;option value="male" &lt;cfif form.gender is "male"&gt;selected&lt;/cfif&gt;&gt;For Him&lt;/option&gt;
&lt;option value="female" &lt;cfif form.gender is "female"&gt;selected&lt;/cfif&gt;&gt;For Her&lt;/option&gt;
&lt;/select&gt;&lt;br/&gt;
&lt;input type="submit" value="Search"&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;

&lt;cfif len(form.search) or form.gender neq ""&gt;

	&lt;cfset category = ""&gt;
	&lt;cfif form.gender is "male"&gt;
		&lt;cfset category = "male,unisex"&gt;
	&lt;cfelseif form.gender is "female"&gt;
		&lt;cfset category = "female,unisex"&gt;
	&lt;/cfif&gt;
	
	&lt;cfsearch collection="productgender" criteria="#trim(form.search)#" category="#category#" name="results"&gt;
	&lt;cfdump var="#results#"&gt;
			
&lt;/cfif&gt;
</code>

<p>

I begin by creating a simple form that allows for both free text entry and selecting "For Him" or "For Her" products. The whole "For" thing was just me being fancy. Below the form is the real interesting part. If a search was made (and we allow you to pick a gender and leave the text field blank) we create a category field based on the gender. We simply append unisex to the selected value and pass this as the category field in the cfsearch tag. You can play with this yourself here:

<p>


<a href="http://www.raymondcamden.com/demos/feb232011a/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>