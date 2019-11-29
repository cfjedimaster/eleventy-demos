---
layout: post
title: "ColdFusion and Verity Tip - Getting results found when paging"
date: "2007-10-11T15:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/11/ColdFusion-and-Verity-Tip-Getting-results-found-when-paging
guid: 2405
---

I was doing a code review this morning when I found this little gem:

<code>
&lt;CFSEARCH NAME="pariscontactsTotal"                    COLLECTION="#collection#"
TYPE="#searchType#"
CRITERIA="#search#"&gt;

&lt;CFSEARCH NAME="pariscontacts"
COLLECTION="#collection#"
TYPE="#searchType#"
CRITERIA="#search#"
STARTROW="#startrow#"
MAXROWS="#itemsPerPage#"&gt;
</code>

So why the duplicate searches? They wanted to return a page of data, but also tell the user how many total matches were returned. This is far easier in ColdFusion 7 and higher. If you add the "status" attribute to your CFSEARCH tag, you can a structure back that contains keys for: Found (how many total found, even if you paginate the results), Searched (total number of records in the collection), and Time (time it took to search).

They could get rid of that first cfsearch and just do this:

<code>
&lt;CFSEARCH NAME="pariscontacts"
COLLECTION="#collection#"
TYPE="#searchType#"
CRITERIA="#search#"
STARTROW="#startrow#"
MAXROWS="#itemsPerPage#"
status="result"&gt;
</code>

I'd name the client - but I'd like to get paid. ;) I will point something they did that was <b>very</b> good (and something I forget to do from time to time). Before searching, they run the search through <a href="http://www.cflib.org/udf.cfm/verityclean">verityClean</a> first. A friend of mine had a site that didn't do this - but as he owes me beer, I won't name him either. ;)