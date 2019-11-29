---
layout: post
title: "ColdFusion/ORM Example - Filtering with a many to many"
date: "2009-11-07T13:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/07/ColdFusionORM-Example-Filtering-with-a-many-to-many
guid: 3595
---

Let me be clear - I'm not sure this is the <b>best</b> way to do this - but it worked and as it took me a while to Google up the answer and test it, I thought I'd share.

Ok - so imagine an entity that has a many-to-many relationship. A good example is a blog entry with many categories. Any one blog entry may have multiple categories assigned to it. How would you write a query to return all blog entries in a specific category? Here is how I did it (and I apologize for not linking to the post - I forget exactly what I saw this):

<code>
&lt;cfset r = ormExecuteQuery("from blogentry as be left join be.categories as cat where cat.id=4")&gt;
</code>

Obviously the 4 there is hard coded and would be replaced with a bound parameter.