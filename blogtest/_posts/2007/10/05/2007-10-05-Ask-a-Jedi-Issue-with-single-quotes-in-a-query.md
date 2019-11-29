---
layout: post
title: "Ask a Jedi - Issue with single quotes in a query"
date: "2007-10-05T13:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/05/Ask-a-Jedi-Issue-with-single-quotes-in-a-query
guid: 2393
---

Alex had a problem with his SQL. This is actually a frequently asked question and I've covered it here before (I think so anyway), but I thought I'd mention it again. It comes up from time to time as people forget. Anyway - his question:

<blockquote>
I'm using a web service to retrieve zip codes within a given radius from another zip code. The service sends me back a string that is formatted to use in a SQL WHERE clause:

xxx="10001" or xxx="10002" or xxx="10003" ...

I am using MySQL as the DB and the double quotes in the return string above won't work in the WHERE clause, so I am using a simple CF replace() function to replace the double quotes with single quotes (the zip field in my DB is setup as a string) for processing. For some reason, after I replace the quotes, the SQL statement in my CFQUERY tag includes the double quotes again! I can't figure out why this is happening. 
</blockquote>

There is a simple explanation for this. ColdFusion auto escapes single quotes. Why? Imagine you have a search for, and a user searches for "Ray's Hotness is greater than Paris Hilton". Your sql could do:

where name like '#form.search#'

(Although hopefully you would use cfqueryparam instead.) As you can see - the single quote in my search would break.

So in cases where you <b>need</b> a single quote to be left alone, you tell ColdFusion to stop that change with the preserveSingleQuotes function:

where whatever = #preserveSingleQuotes(somefunc)#