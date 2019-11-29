---
layout: post
title: "ColdFusion 9 ORM Tip - Count related entities"
date: "2009-12-08T11:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/08/ColdFusion-9-ORM-Tip-Count-related-entities
guid: 3636
---

Here is a simple (or so I thought) problem: Given that an entity has a related property, how can you get a count of the objects? Imagine a Group entity with a One-To-Many to Members (Groups have many Members). How would you report on the number of members in a group?
<!--more-->
You could simply get them and count them:

<code>
&lt;cfset totalMembers = arrayLen(group.getMembers())&gt;
</code>

However this is a bit wasteful if you just want the count. I tried what was suggested in the Hibernate docs but had no luck getting the code to work. Thankfully Rupesh Kumar of Adobe helped me out. When you have related properties, you can get the count by using the size property. So for example:

<code>
&lt;cfset hql = "select g.name, g.members.size as total from group g order by g.members.size desc"&gt;
&lt;cfset r = ormExecuteQuery(hql)&gt;
</code>

In this code I get the name and the size of the members. Notice I can also order by the size as well. This returns an array of structs containing the name and member size for each group. You can even get fancier. My groups actually have members, moderators, and admins. So to get the count I can do:

<code>
&lt;cfset hql = "select g.name, g.members.size+g.moderators.size+g.admins.size as total from group g order by (g.members.size+g.moderators.size+g.admins.size) desc"&gt;
&lt;cfset r = ormExecuteQuery(hql)&gt;
</code>

Obviously to get the count for one group you would get rid of the order by and use a where clause instead.