---
layout: post
title: "Ask a Jedi: CFCs and Cross Referencing Tables"
date: "2006-08-10T09:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/10/Ask-a-Jedi-CFCs-and-Cross-Referencing-Tables
guid: 1459
---

Andrew asks, 

<blockquote>
I'm starting to work with bean/dao/gateway objects, and I'm having a little trouble deciding where to place code that deals with cross reference tables.  Say i have a category table and an item table.   I want items to be in multiple categories, so I create an itemcategories table.  Now my question is, where do a place the required code to handle this relationship?  I want to say i should put it right in the itemDAO, but that just seems sloppy, any comments/suggestions?
</blockquote>

This is definitely one of those questions where I like to admit that I don't think I have the best answer. I'll tell you how <i>I'm</i> doing it now, but, I honestly feel like a year from now I'll look back at this and shake my head. (Or maybe even sooner as my readers pour in and set me straight. May I say once again I'm happy I have such smart readers?)
<!--more-->
Taking your simple example, you have an item and it can be related to N categories. You can also say you have a category that can be related to N items. What I do normally is focus on one side of the relationship. To me, it just makes more sense to think of items having categories than categories having items. As it stands, items are probably more important in your site anyway. 

That being said, let me talk about how I create/update information. I split the operation up into two operations. The first operation is the create/update that is done in the DAO. (I'm trying to move away from create/update and simply use a save, but I'm not there yet.) I then create a second function named assignCategories. I pass this a list of the assigned categories. This method is in my gateway. In theory, the gateway is only for getting a query result set back, but I tend to use my gateway for that <i>and</i> everything else, i.e. miscellaneous methods for my data. 

So the assignCategories method handles wiping out the old data and re-inserting information in the join table. 

For my gets, it is a bit different. I don't have one standard way of handling it. Sometimes it depends on my needs. If I just need to get all the items and not worry about their categories, than I just do that. If I need to get all the items but want category information for each row, I tend to follow up the initial query with N more queries where I assign a list of category IDs and category Names to the initial query. If you look at BlogCFC, this is how I handle getting blog entries and their list of related categories.

Let me stress - that can definitely be done better. However, I'm not aware of a cross-platform SQL solution to do it any better. I know it could be done in one simple stored procedure, but as BlogCFC is meant to work across multiple database engines, I didn't do that. 

In cases where I don't need the category information in my initial query, I simply get it later. So for example, let's say I'm editing an item. I'd make a call to get an item bean, and then a call to get the assigned categories for the  item. Maybe it's bad to have the data split like this. I don't think it's terribly bad though. It is, in ways, two different pieces of information. One represents the item, and one represents the relationship between the item and categories.

So that's how I handle it. Can folks share examples of how they do it?