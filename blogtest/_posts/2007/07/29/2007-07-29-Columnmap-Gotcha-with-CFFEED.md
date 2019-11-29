---
layout: post
title: "Columnmap \"Gotcha\" with CFFEED"
date: "2007-07-29T14:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/29/Columnmap-Gotcha-with-CFFEED
guid: 2229
---

I ran into this bug a week or so ago and just helped a user who ran into the same problem. When providing a query to CFFEED to generate an RSS string, you can provide alias information in the form of a columnMap structure. Basically it is a way to tell ColdFusion that column X maps to property Y of the RSS feed. If you try to use this feature though you will probably run into a bug. Consider this code from <a hrref="http://www.coldfusionbloggers.org">ColdFusionBloggers</a>'s RSS feed:

<code>
&lt;cfset items = application.entries.getEntries(1,url.max)&gt;
&lt;cfset props = {% raw %}{version="rss_2.0",title="coldfusionBloggers.org Feed",link="http://www.coldfusionbloggers.org",description="Feed of the latest items aggregated."}{% endraw %}&gt;
&lt;cfset cmap = {% raw %}{publisheddate = "posted", rsslink = "url" }{% endraw %}&gt;

&lt;cfset items = items.entries&gt;

&lt;cffeed action="create" properties="#props#" columnMap="#cmap#" query="#items#" xmlVar="result"&gt;

&lt;cfcontent type="text/xml" reset="true"&gt;&lt;cfoutput&gt;#result#&lt;/cfoutput&gt;
</code>

The variable cmap is my columnMap structure. When I tried this it didn't work and threw an error:

<blockquote>
The query attribute input does not contain any column by the name of url.

There is a problem in the column mappings specified in the columnMap structure.
</blockquote>

Turns out that the columnMap structure will only work if you use upper case. So I switched around my structure to look like so:

<code>
&lt;cfset cmap = {% raw %}{publisheddate = "POSTED", rsslink = "URL" }{% endraw %}&gt;
</code>