---
layout: post
title: "ColdFusion 8: RSS Aggregator UDF"
date: "2007-06-05T18:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/05/ColdFusion-8-RSS-Aggregator-UDF
guid: 2093
---

As you know (or hopefully know), ColdFusion 8 supports both RSS parsing and creating. I was curious how difficult it would be to create an RSS aggregator in ColdFusion. Turns out it was rather easy - and with the use of CFTHREAD it actually performs quite here. I'll show the code then talk about the parts of it.
<!--more-->
<code>
&lt;cffunction name="aggregate" returnType="query" output="false"&gt;
	&lt;cfargument name="feeds" type="string" required="true" hint="List of RSS urls."&gt;
	&lt;cfset var results = structNew()&gt;
	&lt;cfset var result = ""&gt;
	&lt;cfset var entries = ""&gt;
	&lt;cfset var x = ""&gt;
	&lt;cfset var totalentries = ""&gt;
	&lt;!--- Use this column list since not all feeds return the same cols. ---&gt;
	&lt;cfset var collist = "authoremail ,authorname ,authoruri ,categorylabel ,categoryscheme ,categoryterm ,comments ,content ,contentmode ,contentsrc ,contenttype ,contributoremail ,contributorname ,contributoruri ,createddate ,expirationdate ,id ,idpermalink ,linkhref ,linkhreflang ,linklength ,linkrel ,linktitle ,publisheddate ,rights ,rsslink ,source ,sourceurl ,summary ,summarymode ,summarysrc ,summarytype ,title ,updateddate ,uri ,xmlbase"&gt;
	&lt;cfset var tlist = ""&gt;
	
	&lt;cfloop index="x" from="1" to="#listLen(arguments.feeds)#"&gt;
		&lt;cfthread action="run" name="thread_#x#" url="#listGetAt(arguments.feeds,x)#"&gt;
			&lt;cffeed source="#attributes.url#" query="thread.entries"&gt;
		&lt;/cfthread&gt;
		&lt;cfset tlist = listAppend(tlist, "thread_#x#")&gt;
	&lt;/cfloop&gt;

	&lt;cfthread action="join" name="#tlist#" /&gt;

	&lt;!--- copy out just for ease of use ---&gt;
	&lt;cfloop index="x" list="#tlist#"&gt;
		&lt;cfset results["result_#replaceNoCase(x,'thread_','')#"] = evaluate("#x#").entries&gt;
	&lt;/cfloop&gt;

	&lt;cfquery name="totalentries" dbtype="query"&gt;
		&lt;cfloop index="x" from="1" to="#listLen(arguments.feeds)#"&gt;
		select
		        #collist#
		from results.result_#x#
		&lt;cfif x is not listLen(arguments.feeds)&gt;
		union
		&lt;/cfif&gt;
		&lt;/cfloop&gt;
	&lt;/cfquery&gt;

	&lt;!--- sort ---&gt;
	&lt;cfquery name="totalentries" dbtype="query"&gt;
	select          #collist#
	from            totalentries
	order by        publisheddate desc
	&lt;/cfquery&gt;

	&lt;cfreturn totalentries&gt;
&lt;/cffunction&gt;
</code>

So first off - the point of the aggregator is to take a list of RSS feeds and return one simple query. The UDF takes one argument - feeds. 

I loop through each of the feeds and while inside of a thread, I download and create a query for the feed:

<code>
&lt;cfloop index="x" from="1" to="#listLen(arguments.feeds)#"&gt;
	&lt;cfthread action="run" name="thread_#x#" url="#listGetAt(arguments.feeds,x)#"&gt;
		&lt;cffeed source="#attributes.url#" query="thread.entries"&gt;
	&lt;/cfthread&gt;
	&lt;cfset tlist = listAppend(tlist, "thread_#x#")&gt;
&lt;/cfloop&gt;
</code>

Next I join the threads together. This makes my function wait till all the threads are done:

<code>
&lt;cfthread action="join" name="#tlist#" /&gt;
</code>

Now for the fun part. I need to get the data out of the threads. I named each thread "thread_#x#" where x was a number. I stored the list of thread names in a variable called tlist. So I can loop over each of them and use evaluate to fetch the thread. I stored the data in a variable named entries, so this is the code I ended up with:

<code>
&lt;!--- copy out just for ease of use ---&gt;
&lt;cfloop index="x" list="#tlist#"&gt;
	&lt;cfset results["result_#replaceNoCase(x,'thread_','')#"] = evaluate("#x#").entries&gt;
&lt;/cfloop&gt;
</code>

In case you are wondering about the var scope - let me just say this. Adobe has done... well... "magic", to ensure that we do not have to var scope threaded data like I've used above. Don't ask me why - but I've been assured the code above is safe even in a multiple request format. 

So now I have a results structure that contains a bunch of queries. I can then use query of query to join them all together. 

You may wonder - why the select #collist# instead of select *? Some feeds may contain more columns then other feeds, specifically feeds containing Dublin Core or ITunes extensions. So I created a "core" list of columns I can depend on.

Lastly - I sort the joined query by the published date value. This will give me one final query that contains a sorted list of blog entries. Now for a quick demo:

<code>
&lt;cfset feeds = "http://feeds.dzone.com/dzone/frontpage?abc76aaAw7kar7IKy69lr, http://www.riaforge.org/index.cfm?event=page.rss, http://feeds.feedburner.com/RaymondCamdensColdfusionBlog"&gt;
&lt;cfset aggregation = aggregate(feeds)&gt;

&lt;cfoutput query="aggregation"&gt;
&lt;cftooltip tooltip="#content#"&gt;
&lt;a href="#rsslink#"&gt;#title#&lt;/a&gt;&lt;cfif
len(publisheddate)&gt;(#dateFormat(publisheddate)#)&lt;/cfif&gt;&lt;br /&gt;
&lt;/cftooltip&gt;
&lt;/cfoutput&gt;
</code>

I used three feeds - DZone, RIAForge, and my own blog. I then  loop over the results and use a bit of AJAX-UI candy (cftooltip) to display the results. And guess what?? I finally have a live <a href="http://www.raymondcamden.com/demos/rssagg/test.cfm">demo</a> for you!

Tomorrow I'll show an alternative to this that lets you search RSS feeds. (And yes, I do plan on resurrecting RSSWatcher.com with CF8 code. I promise.)

p.s. Ok, not that I want to start a flame war - but I'd love to see the same code written in PHP. No external libraries allowed - it must be all "baked in" code.

<b>EDIT: Folks, due to IE being a sucky browser and all, there was a huge rendering issue in the code. I added spaces to all of the columns in the "collist" variable. If you cut and paste the code, you will need to trim the values. Also note I have a new version which fixes some bugs. This will be posted around lunch time.</b>