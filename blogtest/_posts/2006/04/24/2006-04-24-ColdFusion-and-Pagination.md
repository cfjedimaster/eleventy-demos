---
layout: post
title: "ColdFusion and Pagination"
date: "2006-04-24T14:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/24/ColdFusion-and-Pagination
guid: 1231
---

One of the more common tasks a web developer gets asked to do is add pagination to a result set. By pagination I simply mean displaying one "page" of content at a time. So if you had 22 records and wanted to show 10 at a time, there would be three pages of content. Let's take a look at <i>one</i> way to solve this problem.
<!--more-->
First, let's get some data:
<code>
&lt;cfset data = queryNew("id,name,age,active","integer,varchar,integer,bit")&gt;

&lt;cfloop index="x" from="1" to="22"&gt;
	&lt;cfset queryAddRow(data)&gt;
	&lt;cfset querySetCell(data,"id",x)&gt;
	&lt;cfset querySetCell(data,"name","User #x#")&gt;
	&lt;cfset querySetCell(data,"age",randRange(20,90))&gt;
	&lt;cfset querySetCell(data,"active",false)&gt;
&lt;/cfloop&gt;
</code>

I use queryNew to create a "fake" query. I then populate it with random data. Normally you would have a real cfquery here, but I think you get the point. Now I'm going to need to know how many items to show per page. I could hard code a number and use that, but I know it's best to abstract this into a variable:

<code>
&lt;cfset perpage = 10&gt;
</code>

I'd probably suggest an application variable actually as if you use pagination in one place, you will probably use it in multiple places, and you want to be consistent. Next I'm going to create a variable that will tell me what record I'll be starting with. This isn't the current page per se, but ends up being the same thing. So if we had 22 records, the first page will start with record 1. The second page will start with record 11. Here is the variable I will use along with the validation:

<code>
&lt;cfparam name="url.start" default="1"&gt;
&lt;cfif not isNumeric(url.start) or url.start lt 1 or url.start gt data.recordCount or round(url.start) neq url.start&gt;
	&lt;cfset url.start = 1&gt;
&lt;/cfif&gt;
</code>

There is a lot going on in that conditional, so let me break it out. IsNumeric will ensure that the URL variable is a number and not some other string like "apple." The lt 1 and gt data.recordCount simply ensures we are starting between 1 and the total number of rows in the query. Lastly, the round check simply ensures we have an integer value and not something like 10.2. Probably a bit overkill, but you can't be too careful with URL (and other client controlled) data. 

Now let's display the data:

<code>
&lt;h2&gt;Random People&lt;/h2&gt;

&lt;cfoutput query="data" startrow="#url.start#" maxrows="#perpage#"&gt;
#currentrow#) #name#&lt;br /&gt;
&lt;/cfoutput&gt;
</code>

Nothing magic here. I simply tell cfoutput to loop from the starting index and stop after perpage records. Notice my lovely use of HTML. Ok, my design sucks, but you get the idea. Now let's do the pagination code:

<code>
&lt;p align="right"&gt;
[
&lt;cfif url.start gt 1&gt;
	&lt;cfset link = cgi.script_name & "?start=" & (url.start - perpage)&gt;
	&lt;cfoutput&gt;&lt;a href="#link#"&gt;Previous Page&lt;/a&gt;&lt;/cfoutput&gt;
&lt;cfelse&gt;
	Previous Page
&lt;/cfif&gt;
/
&lt;cfif (url.start + perpage - 1) lt data.recordCount&gt;
	&lt;cfset link = cgi.script_name & "?start=" & (url.start + perpage)&gt;
	&lt;cfoutput&gt;&lt;a href="#link#"&gt;Next Page&lt;/a&gt;&lt;/cfoutput&gt;
&lt;cfelse&gt;
	Next Page
&lt;/cfif&gt;
]
&lt;/p&gt;
</code>

Basically there are two things going on here, ignoring my simple HTML. The first cfif block checks to see if we need to make a linked or plain text "Previous Page" output. If url.start is above 1, then we need to make the previous link hot. I do this by checking the current script_name. I could have hard coded it as well. I then simply set start to the current value minus the number of entries per page. Note -  a user could change url.start so that it is a low number, like 3. Then the value in the link would be negative. However, I already took care of that so I'm covered. This link doesn't handle other URL variables in the link. I'll cover that in a later blog entry if folks are interested. 

The next cfif block is virtually the same as the first one. 
The logic here is to check if the current starting row, plus the per page value, minus one, is less then the total. Seems a bit complex, but the basic idea is to see if we have complete additional page of records to display.  

That's it! Very quick and simple pagination.

<b>Note: I edited the entry due to a bug found by Fernando. Thanks Fernando!</b>