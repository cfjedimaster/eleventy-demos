---
layout: post
title: "ColdFusion, jQuery and Search Example"
date: "2009-04-08T09:04:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/04/08/ColdFusion-jQuery-and-Search-Example
guid: 3307
---

I wrote a few sample applications for my <a href="http://www.raymondcamden.com/index.cfm/2009/4/7/jQuery-101-Presentation">jQuery presentation</a> yesterday that I wanted to explore a bit deeper in a blog post. I think search is a great place for Ajax to help out. How can we build a search interface using jQuery and ColdFusion? Let's start with a simple example.
<!--more-->
First I'll create a simple form with just a tiny bit of jQuery:

<code>
&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /&gt;
&lt;title&gt;Untitled Document&lt;/title&gt;
&lt;script src="../jquery.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {
	$("#searchForm").submit(function() {
		//get the value
		var search = $("#searchText").val()
		if($.trim(search) == '') return false
		$.get('search.cfm',{% raw %}{search:search}{% endraw %},
			  function(data,status) {
				  $("#results").html(data)
			  })
		return false
	})
});

&lt;/script&gt;

&lt;/head&gt;

&lt;body&gt;

&lt;form id="searchForm"&gt;&lt;input type="text" id="searchText" /&gt;&lt;input type="submit" value="Search" /&gt;&lt;/form&gt;

&lt;div id="results"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

Reading from the bottom up, you can see a simple form with one text field. The jQuery code handles taking over the submit action for the form. I first grab the value of the form field and then do a trim() on it. (Trim is something ColdFusion developers are used to and exists as a utility method in jQuery.) 

The actual Ajax portion is done with the get call. The first argument is the code I'm going to hit: search.cfm. The second argument is a structure of name/value pairs. In this case I'm passing an argument named search and using the value from the form. The last argument to the get function is my call back, or, 'what to do when done'. In this case, I'm simply taking the results and stuffing it into the DIV with the ID of "results".

So to translate all of this into English: Get the form field. Pass it to search.cfm. Paste the result onto the page. 

The ColdFusion code is trivial:

<code>
&lt;cfparam name="url.search" default=""&gt;

&lt;cfif len(trim(url.search))&gt;
	&lt;cfset url.search = trim(htmlEditFormat(lcase(url.search)))&gt;
	
	&lt;cfquery name="getArt" datasource="cfartgallery"&gt;
	select	artname, description, price
	from	art
	where	lower(artname) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#url.search#%{% endraw %}"&gt;
	or		description like &lt;cfqueryparam cfsqltype="cf_sql_lomgvarchar" value="{% raw %}%#url.search#%{% endraw %}"&gt;
	&lt;/cfquery&gt;
	
	&lt;cfoutput&gt;
	&lt;p&gt;
	Your search for #url.search# returned #getArt.recordCount# result(s).
	&lt;/p&gt;
	&lt;/cfoutput&gt;
	
	&lt;cfoutput query="getArt"&gt;
	&lt;p&gt;
	&lt;b&gt;#artname#&lt;/b&gt; #dollarFormat(price)#&lt;br/&gt;
	#description#
	&lt;/p&gt;
	&lt;/cfoutput&gt;
	
&lt;/cfif&gt;
</code>

I don't have much much going on here. I do some simple validation to ensure a search term was passed. If so, I do the query and just output the results. The CFM handles both the search and display of results.

Let's kick it up a notch. What if we wanted a more advanced search page? Here is a new version of the search page:

<code>
&lt;cfquery name="mediatypes" datasource="cfartgallery"&gt;
select	mediaid, mediatype
from	media
&lt;/cfquery&gt;

&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /&gt;
&lt;title&gt;Untitled Document&lt;/title&gt;
&lt;script src="../jquery.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {
	$("#searchForm").submit(function() {
		//get the value
		var search = $("#searchText").val()
		if($.trim(search) == '') return false
		var type = $("#mediatype option:selected").val()
		$.post('search2.cfm',{% raw %}{search:search,mediatype:type}{% endraw %},
			  function(data,status) {
				  $("#results").html(data)
			  })
		return false
	})
});

&lt;/script&gt;

&lt;/head&gt;

&lt;body&gt;

&lt;form id="searchForm"&gt;
&lt;input type="text" id="searchText" /&gt;
&lt;select name="mediatype" id="mediatype"&gt;
	&lt;option value=""&gt;Any Media Type&lt;/option&gt;
	&lt;cfoutput query="mediatypes"&gt;
	&lt;option value="#mediaid#"&gt;#mediatype#&lt;/option&gt;
	&lt;/cfoutput&gt;
&lt;/select&gt;
&lt;input type="submit" value="Search" /&gt;&lt;/form&gt;

&lt;div id="results"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

What's different here? On top I did a quick query to get all the media types from the cfartgallery datasource. Once I have this data, I can use it in a select tag within the form (at the bottom of the code listing above). Now users can search both for a keyword and a keyword and a type of media. 

The jQuery code changed a bit as well. Now I also get the selected value from the drop down and pass it in the Ajax call. Notice I switched to post as well. No real reason. In general I almost always prefer Post calls. I'm not going to post the code for search2.cfm as the only change was to look for and notice the mediatype value. (I'm including all of this in a zip attached to the blog entry though.)

Ok, one more example. In the previous two listings, ColdFusion handled running the search query as well as displaying the results. How about making this simpler? I'll just show the jQuery code for my third example since that's the only thing I'm going to change:

<code>
$(document).ready(function() {
	$("#searchForm").submit(function() {
		//get the value
		var search = $("#searchText").val()
		if($.trim(search) == '') return false
		var type = $("#mediatype option:selected").val()
		$.getJSON('art.cfc?method=search&returnFormat=json&queryformat=column',{% raw %}{term:search,mediatype:type}{% endraw %},
			function(result,status) {
				//console.dir(result)
	
				var str = ''
				for(var i=0; i &lt; result.ROWCOUNT; i++) {
					str+= '&lt;p&gt;&lt;b&gt;'+result.DATA.ARTNAME[i]+'&lt;/b&gt; $'+result.DATA.PRICE[i]+'&lt;br /&gt;'
					str+= result.DATA.DESCRIPTION[i]+'&lt;/p&gt;'
				}

				$("#results").html(str)

			})
		return false
	})
});
</code>

So the first few lines are the same - notice the form submission, get the values, etc. Note that I've switched my Ajax call to getJSON. This let's jQuery know that I'll be calling something that returns JSON data. jQuery will handle converting the JSON for me into real JavaScript data. 

Notice the URL I'm posting too:

art.cfc?method=search&returnFormat=json&queryformat=column

This is a CFC I've built to handle the search logic for me. I've passed returnFormat to tell ColdFusion to automatically convert the result into JSON. 

A quick side note: I have both search parameters (term and mediatype) and url parameters (method, returnFormat, queryFormat). Could I mix them up differently? Yes. I could have used no URL parameters at all and put them all with the {% raw %}{}s in the second argument. I could have used an empty {}{% endraw %} and put everything in the URL (with proper escaping of course). In my opinion, the form I used makes the most sense. I've kept the 'meta' stuff (how the request works) in the URL, separate from business logic params used in the second parameter. 

Because I'm getting JSON back, I have to handle formatting the result myself. I worked with the result data to create a string and then simply set it to the results div using the html() function. How did I know how to work with the JSON data? Trust me, I had no idea. See this line?

<code>
//console.dir(result)
</code>

I removed the comments before the line and Firebug gave me a nice display of the data. This let me see how things were setup and let me write the rest of the code. Once again, <b>install Firebug!</b>

The CFC isn't too special. Here is the method I used:

<code>
&lt;cfcomponent&gt;

&lt;cffunction name="search" access="remote" returntype="query"&gt;
	&lt;cfargument name="term" type="string" required="yes"&gt;
	&lt;cfargument name="mediatype" type="any" required="yes"&gt;
	
	&lt;cfset var getArt = ""&gt;
	
	&lt;cfquery name="getArt" datasource="cfartgallery"&gt;
	select	artname, description, price
	from	art
	where	(lower(artname) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#arguments.term#%{% endraw %}"&gt;
	or		description like &lt;cfqueryparam cfsqltype="cf_sql_lomgvarchar" value="{% raw %}%#arguments.term#%{% endraw %}"&gt;)
	&lt;cfif len(arguments.mediatype) and isNumeric(arguments.mediatype) and arguments.mediatype gte 1&gt;
	and		mediaid = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#arguments.mediatype#"&gt;
	&lt;/cfif&gt;
	&lt;/cfquery&gt;

	&lt;cfreturn getArt&gt;

&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

What I love about this is that my CFC has nothing in it related to jQuery, Ajax, JavaScript, JSON, etc. The only clue that there is any Ajax stuff going on is the access="remote" argument. Because the JSON stuff is built into ColdFusion 8, I can write my business logic and use it either in my 'old school' Web 1.0 application or my fancy, multi-billion dollar Web 2.0 site.

That's it. Any questions?<p><a href='enclosures/E{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fdemo%{% endraw %}2Ezip'>Download attached file.</a></p>