---
layout: post
title: "Yet another post on cffeed and columnMap"
date: "2008-08-21T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/21/Yet-another-post-on-cffeed-and-columnMap
guid: 2981
---

I love to beat up on the cffeed tag. I mean I'm happy it was added to the language, but out of all the features in CF8, this one seemed to be the most flakey. Just look at the blog entries:

<a href="http://www.raymondcamden.com/index.cfm/2008/5/24/CFFEED-and-Date-Values">CFFEED and Date Values</a><br/>
<a href="http://www.coldfusionjedi.com/index.cfm/2008/4/23/Ask-a-Jedi-Handling-RSS-feeds-with-custom-data">Ask a Jedi: Handling RSS feeds with custom data</a><br/>
<a href="http://www.coldfusionjedi.com/index.cfm/2008/4/4/CFFEED-Fixes-in-801">CFFEED Fixes in 8.0.1</a><br/>
<a href="http://www.coldfusionjedi.com/index.cfm/2008/1/14/Fun-little-feed-parsing-issue-to-watch-out-for--new-lines">Fun little feed parsing issue to watch out for - new lines!</a><br/>
<a href="http://www.coldfusionjedi.com/index.cfm/2007/9/18/CFFEED-Tip--Structure-versus-Query">CFFEED Tip - Structure versus Query</a><br/>
<a href="http://www.coldfusionjedi.com/index.cfm/2007/8/22/Metadata-properties-for-CFFEED">Metadata properties for CFFEED</a><br/>
<a href="http://www.coldfusionjedi.com/index.cfm/2007/8/13/Bug-to-watch-out-for-with-CFFEED">Bug to watch out for with CFFEED</a><br/>
<a href="http://www.coldfusionjedi.com/index.cfm/2007/7/29/Columnmap-Gotcha-with-CFFEED">Columnmap Gotcha for CFFEED</a><br/>

Ok, so not all of those entries are complaining, but CFFEED is still my favorite tag to kick around. I ran into another problem this week with a user submitted question. He was using columnMap with CFFEED and kept getting:
<!--more-->
<blockquote>
<p>
<b>There is a problem in the column mappings specified in the columnMap structure</b><br/>
The cffeed query does not contain any column by the name of CITY.
</p>
</blockquote>

He was still on CF 8 with the upper case bug, but he was properly using upper case in his structure:

<code>
&lt;cfquery name="xmlStateCities" datasource="#request.dsn.name#"&gt;
    SELECT		 DISTINCT(city) as city
                ,SUM(population) AS population
                ,state
    FROM		tbl_zip
    WHERE		stateFullName = 'ALABAMA'
    GROUP BY	city, state
    ORDER BY	city ASC;
&lt;/cfquery&gt;

&lt;cfset cmap = structNew()&gt;
&lt;cfset cmap.city = "CITY"&gt;
&lt;cfset cmap.state = "STATE"&gt;
&lt;cfset cmap.population = "POPULATION"&gt;
&lt;cfset cmap.siteurl = "SITEURL"&gt;
</code>

Everything looked right to me and I couldn't figure out why CFFEED was saying the column didn't exist in the query. Turns out it was a simple user error. If you are like me, you probably didn't notice that in his column map structure, he used the <b>same key name and value</b>. Ie:

&lt;cfset cfmap.<b>city</b> = "<b>CITY</b>"&gt;

The error was not that that city didn't exist in his source query. The error was that city wasn't a valid value for the RSS query. This is a great example of how an exception message can either help you or send you down the wrong path. (And yes, I'll file a bug report for this!) Here is the exception I would use. (Just writing this off the top of my head so pardon any misspellings/grammar issues etc.)

<blockquote>
<p>
<b>There is a problem in the column mappings specified in the columnMap structure</b><br/>
You tried to map to a column (CITY) that is not valid for RSS2.0 feeds. Please use one of (LIST HERE).
</p>
</blockquote>

To be fair, some of the other new features of ColdFusion 8 have <b>extremely</b> well written exceptions. For example, if you try to read in an image and use an invalid file type, the exception message will a) tell you that it's invalid and b) tell you to use getReadableImageFormats. That's sweet.