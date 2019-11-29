---
layout: post
title: "Ask a Jedi: Concerns about CFGRID performance"
date: "2011-01-29T09:01:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2011/01/29/Ask-a-Jedi-Concerns-about-CFGRID-performance
guid: 4099
---

Brad asked:

<p/>

<blockquote>
I am just wondering if you know of any way for the html cfgrid on CF9 to only hit the database once, instead of hitting it for every separate sorting/pagination request. I know extJS can do all the processing for you, but it appears cfgrid is requesting the database every time which seems to not be the best way to do things as this could become resource intensive. I have the query it uses caching the roughly 4,000 rows, but I would imagine CF constantly having to hit the cache is still not very performance friendly?
</blockquote>

<p/>
<!--more-->
Ok, so first off, we have two separate things going on here. We have the performance of the front end - in this case the HTML grid. On the other hand we have the performance of the back end. There are things I want to bring up about both of these. Let's first though focus on your first question. Is there a way to get all of the data into the grid at once. The answer is yes. Instead of using binding to load data into a grid you can use a cfquery on the same page and pass that query right into the cfgrid tag. This works - but I <b>strongly recommend</b> against this. 4000 rows of data will be quite a lot to push into the client all at once. I can understand your server side concerns - and we're going to get to that soon - but preloading all of the data at once on the front end is <i>not</i> going to scale well. 

<p/>

So - what about paging on the server? Brad pointed out that it seemed like on every hit (sorting, paging), he was getting 4000 rows from the database. Many examples of the Ajax-based grid demonstrate that. You'll see a simple query followed up by the queryConvertForGrid function. This function will "slice" a query into a page and return data in the form that cfgrid desires. However - you do not need to make use of this function. You can do paging in the database itself (trivial with MySQL) and then return the data in the same way as queryConvertForGrid.

<p/>

queryConvertForGrid returns a structure with two keys. The first key, query, is the "page" of data. The second key is totalrowcount which represents how many records total exist. (Again, MySQL provides a way to do this: <a href="http://www.arraystudio.com/as-workshop/mysql-get-total-number-of-rows-when-using-limit.html">http://www.arraystudio.com/as-workshop/mysql-get-total-number-of-rows-when-using-limit.html</a>)

<p/>

Dave followed up with:

<p/>

<blockquote>
Do you recommend caching this data if it is hit continually? I normally cache queries that have 4k rows, but found that if i had 8 columns, i'd have 17 different cache's due to filtering by each column. Any thoughts?
</blockquote>

<p/>

If you start paging it on the DB side, I probably wouldn't bother with the caching. You could consider caching the first few pages if you
want - but I'd start with just doing the database paging. What and when to cache is very application specific. 

<p/>

Finally - Brad asked me what I used for grids in jQuery - and for that I always recommend <a href="http://www.trirand.com/blog/">jqGrid</a>. While I don't have the URLs handy (hopefully my readers will), I know someone in our community has done a few blog posts about ColdFusion and jqGrid integration.