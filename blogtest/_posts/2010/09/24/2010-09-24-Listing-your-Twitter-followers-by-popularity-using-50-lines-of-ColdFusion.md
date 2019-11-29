---
layout: post
title: "Listing your Twitter followers by popularity (using 50 lines of ColdFusion)"
date: "2010-09-24T14:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/09/24/Listing-your-Twitter-followers-by-popularity-using-50-lines-of-ColdFusion
guid: 3953
---

Earlier this morning <a href="http://www.joshuacyr.com/">Joshua Cyr</a> and I had a discussion about a Twitter feature we would both like to see - the ability to list your followers by their popularity - ie, by <i>their</i> number of followers. Once you get over a certain number of followers there is no real easy way to do this. Turns out this is rather simple if you use Twitter's API. What follows is an ugly - but effective - script that will get all of your followers and then sort them by their followers. I banged this out in about 15 minutes at lunch so pardon the lack of proper error handling or a decent UI. (But let's be honest - if I had all week to work on it I'd just make it uglier!)
<!--more-->
<p>

To begin - I suggest looking over the <a href="http://apiwiki.twitter.com/Twitter-REST-API-Method:-statuses{% raw %}%C2%{% endraw %}A0followers">followers</a> API at Twitter. As always, Twitter goes out of it's way to create a simple and powerful API. Unfortunately they don't support sorting but they make paging quite easy. So based on the documentation, I determined that I could get my first page of followers using this url:

<p>

<a href="http://api.twitter.com/1/statuses/followers/cfjedimaster.json?cursor=-1">http://api.twitter.com/1/statuses/followers/cfjedimaster.json?cursor=-1</a>

<p>

This works without authentication as I've not blocked anyone from accessing my data. The result is a nice JSON packet containing my first 100 followers as well as a cursor value I can use to fetch the next "page" of followers. Note that the data set may not be exactly 100. Either way - I can loop through them, add them to a cache, and then continue to fetch more data. The script is short enough that I'll paste in the entire thing:

<p>

<code>

&lt;cfset user = "cfjedimaster"&gt;
&lt;cfset baseurl = "http://api.twitter.com/1/statuses/followers/#user#.json"&gt; 
&lt;cfset theurl = baseurl & "?cursor=-1"&gt;

&lt;cfset needMore = true&gt;

&lt;cfset data = queryNew("name,followers", "varchar,integer")&gt;

&lt;cfset sanity = 0&gt;
&lt;cfloop condition="needMore"&gt;
	&lt;cfhttp url="#theUrl#"&gt;
	&lt;cfoutput&gt;#theURL#&lt;p&gt;&lt;/cfoutput&gt;
	&lt;cfflush&gt;
	&lt;cfset res = deserializeJSON(cfhttp.filecontent)&gt;
	&lt;cfif structKeyExists(res, "error")&gt;
		&lt;cfdump var="#res#"&gt;
		&lt;cfabort&gt;
	&lt;/cfif&gt;
	&lt;cfif structKeyExists(res, "next_cursor_str")&gt;
		&lt;cfset nextCursor = res.next_cursor_str&gt;
	&lt;cfelse&gt;
		&lt;cfset nextCursor = ""&gt;
	&lt;/cfif&gt;
	
	&lt;cfloop index="user" array="#res.users#"&gt;
		&lt;cfset queryAddRow(data)&gt;
		&lt;cfset querySetCell(data, "name", user.screen_name)&gt;
		&lt;cfset querySetCell(data, "followers", user.followers_count)&gt;
	&lt;/cfloop&gt;

	&lt;cfif len(nextCursor) and nextCursor neq 0&gt;
		&lt;cfset theurl = baseurl & "?cursor=#nextCursor#"&gt;
	&lt;cfelse&gt;
		&lt;cfset needMore = false&gt;
	&lt;/cfif&gt;
	
	&lt;cfset sanity++&gt;
	&lt;cfif sanity gt 50&gt;
		&lt;cfset needMore = false&gt;
	&lt;/cfif&gt;	
&lt;/cfloop&gt;

&lt;cfquery name="sorted" dbtype="query"&gt;
select *
from data
order by followers desc
&lt;/cfquery&gt;

&lt;cfdump var="#sorted#"&gt;
</code>

<p>

As you see - I begin by creating a variable for the user I want to report on. You can change this to your own ID or anyone else's ID that is not protected. I then create a base URL I'll use to begin fetching my data. I'm going to use a manual ColdFusion query to store the data so I create the initial query with two columns - name and followers. I could store more information if I wanted to but that is all I care about.

<p>

Next I begin my loop. Note the condition loop. The idea is to keep fetching data as long as I have more pages of data. I did add  a bit of error checking in case I hit my rate limit. Twitter will limit you to 150 requests per hour from your IP. Unless you have over 22,500 followers, this won't be a big deal. After fetching my nextCursor value (used to make paging easy - again - thank you Twitter!) - I loop over the array of users and add them to my query. I added a quick sanity check at that bottom that will abort the process after 50 runs. Technically you would want to remove that, but I <b>always</b> use sanity checks like that when I have condition loops. 

<p>

Finally - all I have to do is sort the query and dump it to screen. Here's mine:

<p>

<img src="https://static.raymondcamden.com/images/screen7.png" />

<p>

Personally I was a bit surprised by how many of my top followers were unknown to me. I was even more surprised to see one of my favorite authors (JohnBirmingham) as one of my followers. Unfortunately, Paris Hilton does not yet follow me - despite my following of her for many months.

<p>

So how hard would it be to turn this into a "real" Twitter application with OAuth? I plan on finding out this weekend. This will give me the ability to get 350 "pages" or 35000 followers, which should be more than enough for most folks.