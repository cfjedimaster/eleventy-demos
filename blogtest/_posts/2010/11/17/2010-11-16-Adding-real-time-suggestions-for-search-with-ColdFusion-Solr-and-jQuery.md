---
layout: post
title: "Adding real time suggestions for search with ColdFusion, Solr, and jQuery"
date: "2010-11-17T07:11:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2010/11/17/Adding-real-time-suggestions-for-search-with-ColdFusion-Solr-and-jQuery
guid: 4016
---

This week I read an interesting article on <a href="http://solr.pl/2010/10/18/solr-and-autocomplete-part-1/?lang=en">Solr and autocomplete</a>. It got me thinking about similar behavior with Solr under ColdFusion. Without going into too much detail, a real autocomplete wasn't feasible with the Solr collections ColdFusion creates, but we could do something similar. Instead of providing a list of auto complete options on your search, I'm going to use Ajax to provide a suggestion based on what you type. Here is what I came up with.
<!--more-->
<p>

First, I created a simple form:

<p>

<pre><code class="language-markup">
&lt;form method="post"&gt;
&lt;cfoutput&gt;&lt;input type="text" name="search" id="search" value="#htmlEditFormat(form.search)#"&gt;&lt;/cfoutput&gt;
&lt;input type="submit" value="Search"&gt;&lt;br/&gt;
&lt;span id="suggestion"&gt;&lt;/span&gt;
&lt;/form&gt;
</code></pre>

<p>

Everything above should make sense except perhaps for the span. The span is an empty place to put my suggestion when it is returned. Below the form I had a simple place to display the results.

<p>

<pre><code class="language-markup">
&lt;cfif len(form.search)&gt;
	&lt;cfsearch collection="cfdocs" criteria="#form.search#" name="results" maxrows="10"&gt;

	&lt;cfdump var="#results#"&gt;
&lt;/cfif&gt;
</code></pre>

<p>

Now let's look at the jQuery. Back on the top of my document I've got this:

<p>

<pre><code class="language-javascript">
$(document).ready(function() {

	$("#search").keyup(function() {
		var current = $(this).val();
		$.getJSON("search.cfc?method=getsuggestion&returnformat=json", {% raw %}{"search":current}{% endraw %}, function(res,code) {
			res = $.trim(res);
			if(res != '') $("#suggestion").html("Consider searching for &lt;b&gt;"+res+"&lt;/b&gt;");
			else $("#suggestion").html("");
		});
	});
})
</code></pre>

<p>

As you type, I grab the current value of the search field. This gets passed to a CFC (displayed below). The CFC will return a suggestion or a blank string. If we actually get a suggestion we format the result and display it in the span. Pretty simple, right? Now let's look at the CFC.

<p>

<pre><code class="language-markup">
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="getSuggestion" access="remote" returnType="string" output="false"&gt;
	&lt;cfargument name="search" type="string" required="true"&gt;
	&lt;cfset var status = ""&gt;
	&lt;cfset var results = ""&gt;
	
	&lt;cfsearch collection="cfdocs" criteria="#arguments.search#" maxrows="1" status="status"
			  suggestions="always" name="results"&gt;
			  
	&lt;cfif len(trim(status.collatedresult))&gt;
		&lt;cfreturn trim(status.collatedresult)&gt;
	&lt;cfelse&gt;
		&lt;cfreturn ""&gt;
	&lt;/cfif&gt;
			  
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code></pre>

<p>

All my component does is handle suggestions. I'd probably have the real search in there as well so my form above could be simpler, but for now this is sufficient. To get a suggestion, I simply do my search, set suggestions="always", and minimize my actual results with maxrows="1". Suggestions are returned in the status key "collatedresult" and sometimes include a space. Therefore I do a trim before possibly returning it. And now that I've written this, I can further simplify my CFC by just returning the trimmed result like so:

<p>

<pre><code class="language-markup">
&lt;cffunction name="getSuggestion" access="remote" returnType="string" output="false"&gt;
	&lt;cfargument name="search" type="string" required="true"&gt;
	&lt;cfset var status = ""&gt;
	&lt;cfset var results = ""&gt;
	
	&lt;cfsearch collection="cfdocs" criteria="#arguments.search#" maxrows="1" status="status"
			  suggestions="always" name="results"&gt;
			  
	&lt;cfreturn trim(status.collatedresult)&gt;
&lt;/cffunction&gt;
</code></pre>

<p>

You can see a demo of this by clicking the big button below. Useful? Suggestion - try typing 'cfcd' as it triggers a good suggestion. My search data is the CFML reference - not the complete doc set.

<p>

<i>Sorry - this demo is no longer available online.</i>