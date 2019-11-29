---
layout: post
title: "Ask a Jedi: Filtering Verity Data"
date: "2006-01-10T11:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/10/Ask-a-Jedi-Filtering-Verity-Data
guid: 1018
---

A reader asks:

<blockquote>
I'm developing a Coldfusion MX 7 application which contains document management with verity. Please, can u tell me what do i do if i want to provide a search functionality based on dates (between, before, after,...)? How will verity recognize the createdDate metadata of my documents. 
</blockquote>

So - while Verity is awesome at text searching, this kind of searching is not <i>directly</i> possible with Verity. However - there are some nice ways around it. Verity provides a set of custom fields as well as categories. Here are a few ways you could use this:

<b>Using the custom fields:</b> By using the custom fields, you could do your initial Verity search just using the terms, and then do a query of query to filter the data based on dates. You would store the date in one of the custom fields. The problem with this solution is that it is a bit slow. It requires two queries. This isn't horribly bad. For one client I do an initial Verity query and follow it up with a set of related QofQ calls to get "portions" of the result set back and group my results.

<b>Using categories:</b> Another idea is to categorize your content. Instead of allowing your customers a precise date search, you instead provide something a bit more restricted. Imagine a drop down that says something along the lines of, "Filter by content one week old and younger" and "Filter by content older than one week." Your Verity content would then be categorized by age, using a marker like "OneWeekOldOrLess" and "OldContent." The problem with this approach is that you need to reindex your data daily. That <i>may</i> not be so bad - but keep it in mind.

Another related approach would be to categorize your content by year and month. So a particular entry could have a category tree of "2006" with a category of "January." Your search form would then restrict your filters by month. The nice thing about this approach is that it doesn't require a re-index every day. 

One last note - the above suggestions using the categories features of CFMX7 could also be done using the custom fields in earlier versions of ColdFusion. It is a bit more work - but doable.