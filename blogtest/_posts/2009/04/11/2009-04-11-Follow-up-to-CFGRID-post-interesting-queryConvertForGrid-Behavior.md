---
layout: post
title: "Follow up to CFGRID post, interesting queryConvertForGrid Behavior"
date: "2009-04-11T11:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/11/Follow-up-to-CFGRID-post-interesting-queryConvertForGrid-Behavior
guid: 3312
---

A few days ago I <a href="http://www.raymondcamden.com/index.cfm/2009/4/9/Ask-a-Jedi-Noticing-an-empty-CFGRID">blogged</a> about CFGRID and noticing when the data inside was empty. I mentioned how you could get the data, but couldn't use the length value as the length would always equal the page size of the grid. Instead, you had to loop over the data and count the rows that were not null. I initially placed the blame on the grid, however, Scott Stroz pointed out that the issue was with queryConvertForGrid. Consider this example:
<!--more-->
<code>
&lt;cfset q = queryNew("id,name")&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "id", 1)&gt;
&lt;cfset querySetCell(q, "name", "Name 1")&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "id", 2)&gt;
&lt;cfset querySetCell(q, "name", "Name 2")&gt;

&lt;cfset r = queryConvertForGrid(q, 1, 10)&gt;
&lt;cfdump var="#r#"&gt;
</code>

I've got a simple, hand made query with 2 rows. I converted it using queryConvertForGrid. Check out the result:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 150.png">

As you can see, the query was expanded to fill the page size. Why? I wrote up a quick test where I copied the query value and trimmed it down to just the two rows. I then returned that to my CFGIRD. Surprisingly the grid actually shrunk in size. When my data had 2 rows, only two rows showed up.

My guess, and let me stress, it's just a guess, is that the Adobe engineers assumed that folks wouldn't want their grids to shrink when they had less than 10 (or whatever page size) rows of data. That's a good assumption. It looks a bit wonky to see the grid shrink like that. However, I'm willing to bet that the Ext Grid could be programmed to not shrink like that. It kinda seems like the 'padding' we see here was simply a hack. Or maybe I'm wrong. I know the Ext grid that ships with CF is a bit old compared to the newest Ext grid, so maybe at the time it wasn't supported.

Anyway, this is probably a completely useless blog post, but I thought it was kind of interesting. As a general aside, I've been using <a href="http://www.trirand.com/blog/">jqGrid</a> at Alagad and it's working real well. It's a nice grid plugin for jQuery.