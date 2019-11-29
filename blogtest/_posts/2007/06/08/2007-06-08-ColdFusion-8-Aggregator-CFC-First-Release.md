---
layout: post
title: "ColdFusion 8 Aggregator CFC - First Release"
date: "2007-06-08T13:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/08/ColdFusion-8-Aggregator-CFC-First-Release
guid: 2105
---

A few days ago I <a href="http://www.raymondcamden.com/index.cfm/2007/6/6/ColdFusion-8-Update-to-Aggregator-UDF">blogged </a> about an Aggregator UDF I was working on. This UDF took a set of RSS feeds and returned a "joined" query, like MXNA, FullAsAGoog, or Feed-Squirrel. I've worked on this a bit more and have updated it to be a full CFC. I've made some interesting changes I think folks may like as well.
<!--more-->
First off - the CFFEED tag returns a query that contains as much information as possible about the RSS feed. But if you are working with dynamic/multiple feeds at once, it is a bit difficult to write one query to output the results for all of them. So for example, the linkhref column is used for Atom feeds while rsslink is used for RSS. In order to use the right column, you would normally check the metadata returned from the cffeed tag. Consider this example from the ColdFusion 8 docs:

<code>
&lt;cfoutput query = "myQuery"&gt;
&lt;cfif myProps.version IS "atom_1.0"&gt;
&lt;h3&gt;&lt;a href = "#linkhref#"&gt;#title#&lt;/a&gt;&lt;/h3&gt;
&lt;p&gt;&lt;b&gt;Published:&lt;/b&gt; #DateFormat(publisheddate)#&lt;/p&gt;
&lt;cfelse&gt;
&lt;h3&gt;&lt;a href = "#rsslink#"&gt;#title#&lt;/a&gt;&lt;/h3&gt;
&lt;p&gt;&lt;b&gt;Published:&lt;/b&gt; #publisheddate#&lt;/p&gt;
&lt;/cfif&gt;
&lt;p&gt;#content#&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

So one of the first things I added was a new column, link. This column will contain the appropriate column based on the feed type.

Another problem is the difference in date formats. Atom has a format and RSS has another format. Again - don't worry. I combine this into a new Date column. (Thanks to Jared for help parsing the Atom feed.) This fix also makes the sorting work nicer as well. 

So along with an aggregator method, I added search. Want to search RSS feeds for a particular search term?

<code>
&lt;cfset aggregator = createObject("component", "aggregator")&gt;
&lt;cfset feeds2 = "http://weblogs.macromedia.com/mxna/xml/rss.cfm?query=byMostRecent&languages=1,http://www.riaforge.org/index.cfm?event=page.rss,http://feeds.feedburner.com/RaymondCamdensColdfusionBlog,http://www.protogenius.com/atom/example-03.atom"&gt;

&lt;!--- Test Search ---&gt;
&lt;cfset results = aggregator.search(listToArray(feeds2), "ray")&gt;
&lt;cfdump var="#results#"&gt;
</code>

So test it out and let me know what you think. This will be the core of my new RSSWatcher.com site, when I find the time to build it. ;) If you use the sample code above, you may notice MXNA doesn't return a value from dates. This is a known bug in CFFEED and has been reported.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Faggregator%{% endraw %}2Ecfc%2Ezip'>Download attached file.</a></p>