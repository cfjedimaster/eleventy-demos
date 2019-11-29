---
layout: post
title: "Converting ColdFusion data for jQuery Plugins - An example"
date: "2009-07-03T00:07:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/07/02/Converting-ColdFusion-data-for-jQuery-Plugins-An-example
guid: 3419
---

Kerrie asks:

<blockquote>
<p>
A couple of weeks ago, I read a post you wrote on jQuery and form validation... really peaked my interest so I've been taking a look at not only the validation plugin, but many of the other great jQuery plugins... I found this one last night, and its perfect for an app I'm working on, but I cannot figure out how to return the output of a query to populate the list.  In the demo they are returning the results of tvshows.php. I noticed a number of other folks were having the same problem but no solution. Might you have a few spare moments to take a look??
</p>
</blockquote>

Kerrie, don't feel alone. I've noticed this in a few other jQuery plugins. The author will give you an example of the JSON they want, but they don't describe the JSON in pure data forms. So for example, if the JSON string is an array of strings, they don't say that. They just show it and assume you know that is how arrays are represented in JSON. JSON may be easy, but I definitely can't parse it in my head quite yet. Lets take a look at what the plugin wants:
<!--more-->
<blockquote>
<p>
[{% raw %}{"id":"856","name":"House"}{% endraw %},
 {% raw %}{"id":"1035","name":"Desperate Housewives"}{% endraw %},
 {% raw %}{"id":"1048","name":"Dollhouse"}{% endraw %},
 {% raw %}{"id":"1113","name":"Full House"}{% endraw %}
]
</p>
</blockquote>

Ok, so what do you do here? Obviously this is a pattern where every result is {% raw %}{"id":"X", "name":"Y"}{% endraw %}, wrapped in [ and ]. So I took a guess here and thought maybe they wanted an array of structs. There is an easy way to test this - just write a quick test script:

<cfoutput>
<cfset s = {}>
<cfset a = []>

<cfset c = []>
<cfset c[1] = s>

<cfoutput>
s, just a struct: #serializeJSON(s)#<br/>
a, just an array: #serializeJSON(a)#<br/>
c, an array with a struct: #serializeJSON(c)#
</cfoutput>
</code>

This output:

<blockquote>
<p>
s, just a struct: {}<br/>
a, just an array: []<br/>
c, an array with a struct: [{}]<br/>
</p>
</blockquote>

Perfect! So now I know - I need to convert a query into an array of structs. Easy enough, right?

Here is the first CFC method I came up with:

<code>
&lt;cffunction name="getNames" access="remote" output="false" returnType="any"&gt;
	&lt;cfargument name="q" type="string" required="true"&gt;
	&lt;cfset var entrylookup = ""&gt;
	&lt;cfset var r = []&gt;
	&lt;cfset var s = {}&gt;
	
	&lt;cfquery name="entrylookup" datasource="blogdev"&gt;
	select	id, title
	from	tblblogentries
	where	title like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#arguments.q#%{% endraw %}"&gt;
	&lt;/cfquery&gt;

	&lt;cfloop query="entrylookup"&gt;
		&lt;cfset s = {% raw %}{id=id, name=title}{% endraw %}&gt;
		&lt;cfset r[arrayLen(r)+1] = s&gt;
	&lt;/cfloop&gt;
	
	&lt;cfreturn r&gt;

&lt;/cffunction&gt;
</code>

The docs said one argument, q, was always passed in, so I look for that and pass it to a query. I then loop over the results and create a struct for each, append it to the array, and return the array. 

I next whipped up a quick demo script:

<code>
&lt;html&gt;
	
&lt;head&gt;
&lt;script src="/jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script src="/jquery/jquery.tokeninput.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" href="/jquery/tokeninput/token-input.css" type="text/css" /&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#name").tokenInput("data.cfc?method=getNames&returnFormat=json", {
		hintText: "Type in the name of a blog entry.",
		noResultsText: "No results",
		searchingText: "Searching..."
	})
		
})

&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
	
&lt;form&gt;
&lt;input type="text" name="name" id="name"&gt;
&lt;/form&gt;	

&lt;/body&gt;
&lt;/html&gt;
</code>

The code comes from the docs, and me viewing source, for the plugin. As far as I can tell, he doesn't actually document the options, but I was able to guess. So I gave it a try and did it work?

Heck no!

And since it was Ajax and I couldn't see why, I cried into my beer, shut the laptop, and went home.

Oh wait - I have Firebug! And what do I always say when something goes wrong with Ajax? Check Firebug. And guess what - notice the result:

<img src="https://static.raymondcamden.com/images//Picture 331.png">

See the case of the ID and NAME values? They are both upper case. I changed my code to use the more verbose struct creation and set the keys so that my case was maintained:

<code>
&lt;cffunction name="getNames" access="remote" output="false" returnType="any"&gt;
	&lt;cfargument name="q" type="string" required="true"&gt;
	&lt;cfset var entrylookup = ""&gt;
	&lt;cfset var r = []&gt;
	&lt;cfset var s = {}&gt;
	
	&lt;cfquery name="entrylookup" datasource="blogdev"&gt;
	select	id, title
	from	tblblogentries
	where	title like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#arguments.q#%{% endraw %}"&gt;
	&lt;/cfquery&gt;

	&lt;cfloop query="entrylookup"&gt;
		&lt;cfset s["id"] = id&gt;
		&lt;cfset s["name"] = title&gt;
		&lt;cfset arrayAppend(r, s)&gt;
	&lt;/cfloop&gt;
	
	&lt;cfreturn r&gt;

&lt;/cffunction&gt;
</code>

And voila - it worked. So long story short - the basic idea is to try to figure out the real data behind the expected JSON - or the real data form I should say. It would have been nice if the author had said "An array of maps" (or whatever PHP uses) though.