---
layout: post
title: "Looking for ideas on ORM Optimization (Post Launch)"
date: "2010-02-05T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/05/Looking-for-ideas-on-ORM-Optimization-Post-Launch
guid: 3709
---

There are some really good blog entries out there on ColdFusion 9 and optimization (I suggest reading <b>everything</b> at Rupesh's <a href="http://www.rupeshk.org/blog/">blog</a>). As a developer, you have multiple options for how your entities are configured, and how related data is loaded. I'm still coming to grips with those options and learning how to best use them. But here is my question. Are there tools out there that can monitor your ORM usage and report back suggestions for optimization? As an example, consider a Department object that has many Employees. You may decide to make that relationship lazy="extra" since you figure you will almost never need to get employees from a department. But imagine now it's three years down the road - your front end code has changed - and now you are almost always requesting that data. It would make sense to change that relationship (and maybe change fetch to select as well) - but how would you know that? Is there some tool out there that can notice how you are using your entities and then provide some guidance? Certainly you can log the SQL, but it may not be simple to go from that logged SQL to your business logic.

Are there any tools/suggestions/etc in this area?