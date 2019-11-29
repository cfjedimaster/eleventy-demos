---
layout: post
title: "MySQL Tip - Finding total rows for a query that uses Limit"
date: "2007-01-24T11:01:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2007/01/24/MySQL-Tip-Finding-total-rows-for-a-query-that-uses-Limit
guid: 1795
---

So I'm constantly surprised by MySQL. I ran across a stored procedure today that had this in it:

<code>
SELECT SQL_CALC_FOUND_ROWS t.themeID....
</code>

A quick google search turned up <a href="http://dev.mysql.com/doc/refman/5.0/en/information-functions.html">this doc</a> that describes this feature. Basically, you can use this to tell MySQL to figure out how many rows would have been returned in a query if you had left off the limit operator. It obviously slows down the query, but is not as slow as rerunning the query without the limit. (And here is a scary question - have you ever seen code that did total counts like that?) To use this feature you have to follow up with an immediate select found_rows(). Check the <a href="http://dev.mysql.com/doc/refman/5.0/en/information-functions.html">documentation</a> for more information.

Anyone know if SQL Server has something like this?