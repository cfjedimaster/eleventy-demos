---
layout: post
title: "Ask a Jedi: Dealing with an incredibly slow query"
date: "2006-08-23T14:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/23/Ask-a-Jedi-Dealing-with-an-incredibly-slow-query
guid: 1489
---

Jay asked an interesting question:

<blockquote>
I have a question about how to do something for pulling
data from a database using CF.
I need to run a VERY large query over night and then have the data somewhere I can either query against the next day to get at it in smaller chunks or look at in a more manageable way. Do you have any thoughts on how that might best be accomplished?
</blockquote>

Obviously the very first thing you want to do is ensure you have done <i>everything</i> possible to ensure that the initial data is as optimized as possible. I find it hard to believe that one query would take so long. I don't mean to belittle your SQL skills, but I know <i>mine</i> aren't that great and this is exactly the case where I'd bring in an experiences DBA. 

That being said - let's assume that there really isn't anything you can do. I can think of a few ways to handle this.

The easiest solution would be to take your resultant query and insert it into a database. (Or even better, change your initial query so that it doesn't return the result, but simply save the results to the new table.) Once the data is in your database, you can perform queries against it. 

Another option is to store the result in text. This text could be read by another program to perform stats. This will definitely be slower then using the database, but depending on how you want to use the data, it might be an option as well.