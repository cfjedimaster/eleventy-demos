---
layout: post
title: "AutoSuggest Example"
date: "2007-07-20T18:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/20/AutuSuggest-Example
guid: 2207
---

I've added autusuggest to <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a> and thought I'd talk a bit about how I did it (and about the problems I ran into). 

First off - using autosuggest is extremely simple. All you have to do is take a standard input tag and switch it to a cfinput tag instead. Then just add the autosuggest attribute and your done. Thats it. Well, ok, you have to hook up the autusuggest to either a static list of suggestions, or to a dynamic data source.

For <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a> I decided the autusuggest would be based on previous searches. I added a logSearch() method to my entries CFC. This logged the search term and the time. I then added a method to return results based on what you type in the search box:

<code>
&lt;cffunction name="getSearchHelp" access="remote" returnType="array" output="false"&gt;
	&lt;cfargument name="term" type="string" required="true"&gt;
	
	&lt;cfquery name="q" datasource="#variables.dsn#"&gt;
	select	distinct searchterm
	from	search_log
	where	searchterm like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#left(arguments.term,255)#%"&gt;
	limit 0,10
	&lt;/cfquery&gt;
	
	&lt;cfreturn listToArray(valueList(q.searchTerm))&gt;
	
&lt;/cffunction&gt;
</code>

Notice I used #term#{% raw %}% for my search, not %{% endraw %}#term#%. Why? Remember that autusuggest is based on what you type. If you type "R", you should see suggestions that start with R.

Then I ran into my first problem. Notice the datasource is variables.dsn. My Application.cfc file had created and initialized an instance of entries.cfc. Guess what happened when I hooked up ColdFusion directly to the CFC? Because I was accessing the CFC directly, variables.dsn wasn't set properly. I fixed it by changing to application.dsn, which worked, but I wanted a nicer solution.

The <b>cool</b> thing about binds in ColdFusion 8 is that you can link to CFCs, JavaScript functions, and random URLs. So my cfinput which had been using a CFC:

<code>
&lt;cfinput name="search_query" autosuggest="cfc:components.entries.getSearchHelp({% raw %}{cfautosuggestvalue}{% endraw %})" maxResultsDisplay="10"&gt;
</code>

Was switched to this version:

<code>
&lt;cfinput name="search_query" autosuggest="url:searchhelpproxy.cfm?term={% raw %}{cfautosuggestvalue}{% endraw %}" maxResultsDisplay="10" showAutoSuggestLoadingIcon="false" size="10" /&gt;	
</code>

I then added searchhelpproxy.cfm:

<code>
&lt;cfif structKeyExists(url, "term") and len(trim(url.term))&gt;
	&lt;cfinvoke component="#application.entries#" method="getSearchHelp" term="#url.term#" returnVariable="result"&gt;
	&lt;cfoutput&gt;#serializeJSON(result)#&lt;/cfoutput&gt;&lt;cfabort&gt;
&lt;/cfif&gt;
</code>

This file simply invokes the method I built but uses the Application scoped CFC instead. Notice that I have to format the result into JSON. Also note that Ben has <a href="http://www.forta.com/blog/index.cfm/2007/7/17/Last-Minute-ColdFusion-Ajax-Enhancements">blogged</a> about some nice modifications made to autosuggest and cfselect bound controls. 

If I have to do this again, I'll most likely create a more generic file that can handle different operations. 

One last issue. I noticed that when I used the autusuggest control, it broke my layout a bit. I've pinged Adobe about this, but for now I've tried to make it work better by adding some style to my cfinput. In general I do not see a good reason why this should have <i>any</i> impact on layout, but maybe I did something wrong.

I've updated the code base again. You can download it on the FAQ at the site.