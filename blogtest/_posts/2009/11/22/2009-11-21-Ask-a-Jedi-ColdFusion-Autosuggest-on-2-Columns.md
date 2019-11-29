---
layout: post
title: "Ask a Jedi: ColdFusion Autosuggest on 2 Columns"
date: "2009-11-22T11:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/22/Ask-a-Jedi-ColdFusion-Autosuggest-on-2-Columns
guid: 3618
---

Mike asks:

<blockquote>
I'm working on a suggestion list for a search box, is it possible to query more than one column and return that from the binding CFC?
</blockquote>

Absolutely. Remember, ColdFusion's autosuggest control doesn't care how you create the result, it just cares that you return an array of strings. How you create the array is up to you. When I first wrote back to Mike, I recommended simply running two queries. Then I remember that a union would work fine as well. Here is the example I created.
<!--more-->
Ok, let's start on the front end:

<code>
&lt;cfform name="doesntmatter"&gt;

&lt;cfinput name="chosen" autoSuggest="cfc:test.getSuggest({% raw %}{cfautosuggestvalue}{% endraw %})"&gt;

&lt;/cfform&gt;
</code>

It's truly unfortunate that ColdFusion doesn't make AJAX easier. Look at all the code above. All the messy JavaScript. I really wish ColdFusion did more to make this easier for me. It took me at least 35 seconds to write that code. Maybe even 40. I'm sure PHP does a better job here, so why can't ColdFusion? -sigh- 

All kidding aside, you got to love the binding support in ColdFusion. Let's now take a look at the CFC's getSuggest method:

<code>
&lt;cffunction name="getSuggest" access="remote"&gt;
	&lt;cfargument name="suggest" type="string" required="true"&gt;
	&lt;cfset var search = ""&gt;
	
	&lt;cfquery name="search" datasource="cfartgallery"&gt;
	select art.artname as s
	from art
	where art.artname like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.suggest#%"&gt;
	union
	select artists.lastname as s
	from artists
	where artists.lastname like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.suggest#%"&gt;
	&lt;/cfquery&gt;
	
	&lt;cfreturn listToArray(valueList(search.s))&gt;	
&lt;/cffunction&gt;
</code>

As you can see, I search against two columns in two different tables. The result is a query with a column called S that contains the matches. <b>Note:</b> ColdFusion's autosuggest only allows you to do 'frontal' matches. So if you want "der" to match "Vader", you are out luck. That's why my search only uses a % at the end. I can return other matches but they won't show up. 

<b>Wait!</b> I double checked the docs (always good to do so when you are absolutely sure you are right!) and turns out I was wrong. The cfinput tag has a "matchContains" attribute. It defaults to false. If true, then the autosuggest can match anywhere in the result.

So I changed the front end input to:

<code>
&lt;cfinput name="chosen" autoSuggest="cfc:test.getSuggest({% raw %}{cfautosuggestvalue}{% endraw %})" matchcontains="true"&gt;
</code>

and changed my cfqueryparam (both of them) to:

<code>
&lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#arguments.suggest#%{% endraw %}"&gt;
</code>

and it worked like a charm. I'm <i>very</i> happy to be wrong about that. Anyway, hopefully you see that the autosuggest can be built up anyway you want. I could even mix a cfdirectory query with a database query. Whatever your needs are - just ensure you've got an array at the end and your good to go.

<b>Edit:</b> Ok, so apparently, matchcontains is ColdFusion 9 only. I checked the ColdFusion 8 docs and it isn't there. Unfortunately, Adobe forgot to list this in the tag history, so I mistakenly assumed it was there in 8 and I missed it. I've blogged before about the updates and how you had to dig a bit to find the changes. Apparently this is one of those things didn't get added to the history/tag changed docs. So obviously the <b>core</b> request here - autosuggest against N columns - is possible in ColdFusion 8. The only thing my matchcontains does is allow you to match anywhere in the result. For ColdFusion 8, simply leave that attribute off, and ensure your query uses X{% raw %}%, not %{% endraw %}X%.