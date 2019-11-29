---
layout: post
title: "Using jQuery to search against different types of content (2)"
date: "2011-02-03T22:02:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/02/03/Using-jQuery-to-search-against-different-types-of-content-2
guid: 4106
---

A few days ago I <a href="http://www.raymondcamden.com/index.cfm/2011/2/1/Using-jQuery-to-search-against-different-types-of-content">blogged</a> an example of "search as you type" implemented with jQuery and multiple types of data. ColdFusion was used to serve up data based on searches against two types of data. The front end client was rather simple. Because ColdFusion returned an array of results for one data type and another array for the second, it wasn't too difficult to render that out. I wanted to build upon that demo and work with data that was a bit more complex. In this example I'll show how you can work with data that comes back in one main "chunk" but contains different types of results.
<!--more-->
<p>

To begin, let me talk about the data. I created a quick template to index blog entries and comments for coldfusionjedi.com. While not exactly relevant to this blog entry, here is the code I used. Do note I had to 'massage' the data a bit to make things work within ColdFusion's limit of 4 custom fields. Solr itself does not have that restriction.

<p>

<code>

&lt;cfset col = "blogcontent"&gt;
&lt;cfset dsn = "blogdev"&gt;

&lt;cfcollection action="list" engine="solr" name="collections"&gt;
&lt;cfif not listFindNoCase(valueList(collections.name), col)&gt;
	&lt;cfoutput&gt;&lt;i&gt;creating #col# collection&lt;/i&gt;&lt;p&gt;&lt;/cfoutput&gt;
	&lt;cfcollection action="create" collection="#col#" path="#server.coldfusion.rootdir#\collections" engine="solr"&gt;
&lt;/cfif&gt;

&lt;!--- remove existing ---&gt;
&lt;cfindex action="purge" collection="#col#"&gt;

&lt;cfquery name="getentries" datasource="#dsn#"&gt;
select	id, title, body, morebody, posted, "entry" as type
from	tblblogentries
&lt;/cfquery&gt;

&lt;cfoutput&gt;Adding #getentries.recordcount# blog entries to index.&lt;p&gt;&lt;/cfoutput&gt;
&lt;cfflush&gt;

&lt;cfindex action="update" collection="#col#" key="id" title="title" body="body,morebody" custom1="posted" custom2="type" query="getentries"&gt;

&lt;cfoutput&gt;Done with entries.&lt;p&gt;&lt;/cfoutput&gt;
&lt;cfflush&gt;

&lt;cfquery name="getcomments" datasource="#dsn#"&gt;
select	c.id, c.entryidfk, concat(c.name," ",c.email) as nameemail, c.comment, c.posted, "comment" as type, e.title as entrytitle
from	tblblogcomments c
left join tblblogentries e on c.entryidfk = e.id
&lt;/cfquery&gt;

&lt;cfoutput&gt;Adding #getcomments.recordcount# comments to index.&lt;p&gt;&lt;/cfoutput&gt;
&lt;cfflush&gt;

&lt;cfindex action="update" collection="#col#" key="id" title="entrytitle" body="comment" custom1="posted" custom2="type" custom3="nameemail" custom4="entryidfk" query="getcomments"&gt;

&lt;cfoutput&gt;Done with entries.&lt;p&gt;&lt;/cfoutput&gt;
&lt;cfflush&gt;
</code>

<p>

I'm not going to cover every line of this code, but the important thing to note is that it indexes my blog entries and blog comments, along with the commenter's name and email address. I also create a 'fake' column called type that will be a static value. Altogether this leaves me with a Solr collection containing one index that covers two types of data. Now let's go to the service component that's going to be used by the front end.

<p>

<code>
&lt;cfcomponent output="false"&gt;
	
	&lt;cffunction name="search" access="remote" returnType="query" output="false"&gt;
		&lt;cfargument name="string" type="string" required="true"&gt;
		
		&lt;cfset var initialResults = ""&gt;
		&lt;cfset var results = queryNew("key,type,title,summary,posted,author,gravatar")&gt;
		&lt;cfsearch collection="blogcontent" criteria="#arguments.string#" name="initialResults" maxrows="20"&gt;

		&lt;cfloop query="initialResults"&gt;
			&lt;cfset queryAddRow(results)&gt;
			&lt;cfset querySetCell(results, "key", key)&gt;
			&lt;cfset querySetCell(results, "type", custom2)&gt;
			&lt;cfset querySetCell(results, "title", title)&gt;
			&lt;cfset querySetCell(results, "posted", dateFormat(custom1) & " " & timeFormat(custom1))&gt;
			&lt;cfif custom2 is "comment"&gt;
				&lt;cfset querySetCell(results, "summary", summary)&gt;
				&lt;cfset var spacemarker = len(custom3)-find(" ",reverse(custom3))&gt;
				&lt;cfset querySetCell(results, "author", left(custom3, spacemarker))&gt;
				&lt;cfset var email = right(custom3, len(custom3)-spacemarker-1)&gt;
				&lt;cfset querySetCell(results, "gravatar", "http://www.gravatar.com/avatar/#lcase(hash(email))#?s=64")&gt;
			&lt;cfelse&gt;
				&lt;cfset querySetCell(results, "summary", htmlEditFormat(summary))&gt;
			&lt;/cfif&gt;
		&lt;/cfloop&gt;
		&lt;cfreturn results&gt;
	
	&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code>

<p>

Ok - so I've got something interesting going on here. The beginning of the method is simple. Take in the search string and run the cfsearch tag. Solr takes over - does it's voodoo - and returns the result. But before I send this back out I want to manipulate the data a bit. I want jQuery to have a simpler time working with the results. I created a new query called results. I copy some things - for example I copy the custom2 column which stores whether or not the result is a blog entry or a blog comment.

<p>

For comments - I take the personalized data, the name and email, and break it out of the custom column I used. Note too I remove the email address and just return a Gravatar url. I could have done that client side. But that would mean people searching on my site would be able to get other people's email address. <b>Always assume people are looking at your data sent over Ajax calls.</b> Whether I actually printed out the email address or not wouldn't matter. If I send it over the wire, someone is going to see it. Now let's take a look at the front end.

<p>

<code>

&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	//http://stackoverflow.com/questions/217957/how-to-print-debug-messages-in-the-google-chrome-javascript-console/2757552#2757552
	if (!window.console) console = {};
	console.log = console.log {% raw %}|| function(){}{% endraw %};
	console.dir = console.dir {% raw %}|| function(){}{% endraw %};
	

	//listen for keyup on the field
	$("#searchField").keyup(function() {
		//get and trim the value
		var field = $(this).val();
		field = $.trim(field)

		//if blank, nuke results and leave early
		if(field == "") {
			$("#results").html("");
			return;
		}
		
		console.log("searching for "+field);
		$.getJSON("search.cfc?returnformat=json&method=search&queryformat=column", {% raw %}{"string":field}{% endraw %}, function(res,code) {
			var s = "";
			s += "&lt;h2&gt;Results&lt;/h2&gt;";
			for(var i=0; i &lt; res.ROWCOUNT; i++) {
				//display a blog entry
				if(res.DATA.TYPE[i] == "entry") {
					s += "&lt;p&gt;&lt;img src=\"blog.png\" align=\"left\"&gt;";
					s += "&lt;b&gt;Blog Entry: &lt;a href=\"\"&gt;" + res.DATA.TITLE[i] + "&lt;/a&gt;&lt;/b&gt;&lt;br/&gt;";
					s += res.DATA.SUMMARY[i];
					s += "&lt;br clear=\"left\"&gt;&lt;/p&gt;";
				//display a blog comment
				} else {
					s += "&lt;p&gt;&lt;img src=\"" + res.DATA.GRAVATAR[i] + "\" align=\"left\"&gt;";
					s += "&lt;b&gt;Comment by " + res.DATA.AUTHOR[i] + "&lt;/b&gt;&lt;br/&gt;";
					s += "&lt;b&gt;Blog Entry: &lt;a href=\"\"&gt;" + res.DATA.TITLE[i] + "&lt;/a&gt;&lt;/b&gt;&lt;br/&gt;";
					s += res.DATA.SUMMARY[i];
					s += "&lt;br clear=\"left\"&gt;&lt;/p&gt;";
				}
			}
			console.dir(res);
			$("#results").html(s);
		});
	});
})
&lt;/script&gt;
&lt;style&gt;
#results p {
	border-style:solid;
	border-width:thin;
	padding: 10px;
}
&lt;/style&gt;

&lt;form&gt;
Search: &lt;input type="text" name="search" id="searchField"&gt;
&lt;/form&gt;

&lt;div id="results"&gt;&lt;/div&gt;
</code>

<p>

I'm going to focus specifically on what's changed based on the last entry. The main change begins with the loop in the callback handler of the getJSON call. I've got one array of results in a DATA object. Because my back end flagged comments and blog entries I can use a simple IF clause to branch between them. For blog entries notice I render a static image. (Also note the URLs are intentionally blank. I do store enough information to render links but I wanted to keep it a bit simple.) 

<p>

For blog comments we get a bit fancier. Since I've got the gravatar URL I used that for each comment. This allows me to put a face to the comment. So how well does it work?

<p>

<a href="http://www.coldfusionjedi.com/demos/feb32011/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

In my testing various search strings seemed to work well, but play with it and you will see (hopefully) how the results go back and forth between blog entries and blog comments. Any questions or comments on this approach?

<p>

p.s. Those of you familiar with ColdFusion and Solr may note how I 'hacked' up email and name into the collection within one custom field. Looking back at my code I could have used the category attribute to store 'comment', 'entry' instead of "wasting" one of my 4 custom fields.