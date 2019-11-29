---
layout: post
title: "Creating category specific RSS feeds"
date: "2011-03-22T10:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/03/22/Creating-category-specific-RSS-feeds
guid: 4166
---

As I've worked on populating <a href="http://www.jquerybloggers.com">jQueryBloggers</a>, I've been surprised by how few blogs provide category specific RSS feeds. Almost every blog provides a basic RSS feed. That's pretty much a given. But for sites that cover multiple disparate topics, it's surprising how few will provide a RSS feed specific to one topic. I thought it might be fun to quickly explain how you could add support for category specific RSS feeds in your ColdFusion application. Obviously my implementation will be very specific to the data I'm using, but I still think it might be a useful bit of example code.
<!--more-->
<p>

First, let's begin with a simple RSS feed example. I'll be using the cfbookclub datasource that ships with the ColdFusion sample applications. I set that up in my Application.cfc using one of the simplest, yet most welcome additions to ColdFusion 9.

<p>

<code>
component {
	this.name = "rsscat";
	this.datasource = "cfbookclub";
}
</code>

<p>

In my index page I then created a link to the RSS page.

<p>

<code>
&lt;a href="rss.cfm"&gt;RSS&lt;/a&gt;
</code>

<p>

Now let's look at the actual RSS implementation in rss.cfm.

<p>

<code>
&lt;cfquery name="getentries" maxrows="10"&gt;
select	id, title, body, posted
from	blogentries
order by posted desc
&lt;/cfquery&gt;


&lt;cfset meta = {title="Main RSS", link="http://www.raymondcamden.com", 
			   description="Latest blog entries", version="rss_2.0"}&gt;
			   
&lt;cfset colMap = {% raw %}{publishedDate="posted",content="body"}{% endraw %}&gt;

&lt;cffeed action="create" query="#getentries#" properties="#meta#" columnmap="#colMap#" xmlvar="rssXML"&gt;

&lt;cfcontent type="text/xml" reset="true"&gt;&lt;cfoutput&gt;#rssXML#&lt;/cfoutput&gt;
</code>

<p>

I begin with a simple query to get my blog entries. Notice I've sorted them newest to oldest. I've used maxrows to restrict the number of entries to 10. That seems to be fairly standard for RSS feeds but you can use any value really. Next up is a structure called meta. In order to create a RSS feed there are a few basic things you need to define. I've set a title, link, description, and version for my feed. 

<p>

The colMap structure is simply an alias. RSS feeds have specific column requirements. This let's me tell ColdFusion to map a RSS column to one of my columns. 

<p>

Next - I actually create the feed and store it into an xml variable. Finally I output it. And that's that. I've complained a few times about bugs and issues in cffeed, but you have to appreciate how simple this template is. 

<p>

Ok - so now let's talk category specific feeds. I began by writing some simple code to get categories from the database. I then used this query to create a list of RSS links:

<p>

<code>
&lt;cfquery name="getcats"&gt;
select	categoryid, categoryname
from	blogcategories
order by categoryname desc
&lt;/cfquery&gt;

&lt;cfoutput query="getcats"&gt;
	&lt;a href="rss2.cfm?catid=#categoryid#"&gt;#categoryname# Feed&lt;/a&gt;&lt;br/&gt;
&lt;/cfoutput&gt;
</code>

<p>

I assume there isn't anything weird there so I'll just move on. Let's look at rss2.cfm.

<p>

<code>
&lt;cfparam name="url.catid" default=""&gt;
&lt;cfquery name="getentries" maxrows="10"&gt;
select	id, title, body, posted
from	blogentries
&lt;cfif url.catid neq ""&gt;
	where id in (
		select 	entryidfk 
		from	blogentriescategories
		where	categoryidfk = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#url.catid#"&gt;		
	)
&lt;/cfif&gt;
order by posted desc
&lt;/cfquery&gt;

&lt;cfif url.catid is ""&gt;
	&lt;cfset meta = {title="Main RSS", link="http://www.coldfusionjedi.com", 
			   description="Latest blog entries", version="rss_2.0"}&gt;
&lt;cfelse&gt;
	&lt;!--- grab the category name ---&gt;	
	&lt;cfquery name="getcat"&gt;
	select	categoryname
	from	blogcategories
	where	categoryid = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#url.catid#"&gt;
	&lt;/cfquery&gt;

	&lt;cfset meta = {title="RSS for #getcat.categoryname#", link="http://www.coldfusionjedi.com", 
			   description="Latest blog entries for #getcat.categoryname#", version="rss_2.0"}&gt;

&lt;/cfif&gt;
			   
&lt;cfset colMap = {% raw %}{publishedDate="posted",content="body"}{% endraw %}&gt;

&lt;cffeed action="create" query="#getentries#" properties="#meta#" columnmap="#colMap#" xmlvar="rssXML"&gt;
&lt;cfcontent type="text/xml" reset="true"&gt;&lt;cfoutput&gt;#rssXML#&lt;/cfoutput&gt;
</code>

<p>

I'm going to focus on how this template differs from the previous version. I start off by paraming a value for catid. I want my template to support both the core RSS feed as well as the category specific one. I modify my query to allow for this. I know (or at least think I know) that subselects like that aren't very performant, but for now, it works. 

<p>

The next change is to the metadata I provide for my RSS feed. I want it to be clear that the category specific feed is different. You can see see here that I fetch the category name and then use it in my values. I'd also probably have a category specific link. For now though I just changed the title and description. 

<p>

The rest of the code is the exact same. Define my column map - create my XML - serve it up. Not that it's terribly exciting, but you can demo this below.

<p>

<a href="http://www.coldfusionjedi.com/demos/march222011/"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

Any questions?