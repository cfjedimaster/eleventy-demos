---
layout: post
title: "Another simple jQuery/ColdFusion example"
date: "2010-07-09T10:07:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/07/09/Another-simple-jQueryColdFusion-example
guid: 3872
---

Earlier this week I worked with a reader who was having issues using Ajax and ColdFusion. We exchanged quite a few emails and I thought I'd share the end result. This isn't anything new for the blog at all, so forgive the lack of originality, but I figured sharing yet another example couldn't hurt. I do want to spend a quick minute talking about his problem and how I went about solving it.
<p>
<!--more-->
To begin - he was trying to create a simple system where his page had two dynamic regions. The first was meant to load a set of categories via Ajax. Once loaded, if you clicked on any of the categories it would use Ajax to load detailed information into the second region. Pretty simple, right? He had complicated the issue though by trying to mix both jQuery and cflayout. He was also trying to run these cflayout calls from the CFC being executed via an Ajax call. Bad call in my opinion. I mentioned that - in general - it is almost never a good idea to do layout within your CFC. Let your CFCs return their data and your front end client can render it. I'm not saying that's <i>always</i> going to be best, but I definitely recommended it for him.
<p>
The next thing I did was to start from scratch and add functionality piece by piece. I walked through the process with him to ensure he understood each step and what it was bringing to the "application" (if we can call 30 lines of code an application). So for example, my first build only had an HTML shell with jQuery loaded but not doing anything.
<p>
<code>
&lt;html&gt; 
 
&lt;head&gt; 
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt; 
&lt;script&gt; 
$(document).ready(function() {
})
&lt;/script&gt; 
&lt;/head&gt; 
 
&lt;body&gt; 
 
&lt;div id="nav"&gt;NAV&lt;/div&gt; 
 
&lt;div id="content"&gt;CONTENT&lt;/div&gt; 
 
&lt;/body&gt; 
&lt;/html&gt; 
 </code>
<p>
In the code above you can see my two dynamic regions. The use of "NAV" and "CONTENT" was so that I could see the regions before the data loaded. Later on they would be removed.
<p>
So step one was to build a list of links. I created a simple CFC that would return hard coded data:
<p>
<code>
&lt;cfcomponent output="false"&gt;

	&lt;cffunction name="getCategories" access="remote" returnType="query"&gt;
		&lt;cfset var q = queryNew("id,name")&gt;
		&lt;cfset var x = ""&gt;
		&lt;cfloop index="x" from="1" to="5"&gt;
			&lt;cfset queryAddRow(q)&gt;
			&lt;cfset querySetCell(q, "id", x)&gt;
			&lt;cfset querySetCell(q, "name", "Name #x#")&gt;
		&lt;/cfloop&gt;
		&lt;cfreturn q&gt;
	&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>
<p>
And then added the jQuery code to load and render these links:
<p>
<code>
//Call the CFC to get links
$.getJSON("data.cfc?method=getcategories&returnformat=json&queryformat=column", {}, function(res,code) {
	//create a string for our result
	var s = ""
	for(var i=0; i&lt;res.DATA.ID.length; i++) {
		s += "&lt;a href='' class='navLink' id='nav_" + res.DATA.ID[i]+ "'&gt;"+res.DATA.NAME[i]+"&lt;/a&gt;&lt;br/&gt;"
	}

	//"draw" s onto the screen
	$("#nav").html(s)
})
</code>
<p>
The next step was to enable clicks on the links. Now jQuery makes it easy to add event handlers - but did you notice how the links weren't loaded until the Ajax call? In order to support listening to an event for items that do not exist when the page is created, you need to make use of the jQuery live function:

<p>
<code>
//listen for clicks on navLink
$(".navLink").live("click", function(e) {
	var clickedId = $(this).attr("id")
	var id = clickedId.split("_")[1]
		
	//load the detail
	$.getJSON("data.cfc?method=getdetail&returnformat=json", {% raw %}{"id":id}{% endraw %}, function(res,code) {
		var s = "&lt;h2&gt;" + res.NAME + "&lt;/h2&gt;"
		s += "This person is "+res.AGE + " years old."
		$("#content").html(s)
	})
		
	e.preventDefault()
})
</code>

<p>

For the most part, this looks just like a click handler - switching to the "live" format though makes it work with items loaded in via Ajax. The only real weird part here is how I get the ID. I created my link IDs so that they contained the primary key in the string. This allows me to get the entire string and just split it. Once I've done that, it's trivial to call my CFC and get the detail. Here's that CFC method:

<p>

<code>
&lt;cffunction name="getDetail" access="remote" returnType="struct"&gt;
	&lt;cfargument name="id" type="numeric" required="true"&gt;
	&lt;!--- fake data ---&gt;
	&lt;cfset var result = structNew()&gt;
	&lt;cfset result.name = "Number #arguments.id#"&gt;
	&lt;cfset result.id = arguments.id&gt;
	&lt;cfset result.age = arguments.id * 2&gt;
	&lt;cfreturn result&gt;
&lt;/cffunction&gt;
</code>

<p>

And that's it. Just in case folks want to play with the code I've zipped it up and attached it to the entry. As I said in the beginning, I've done a bunch of this stuff before, but if there is anything here that is confusing or needs more explanation, please ask!<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fforpaul%{% endraw %}2Ezip'>Download attached file.</a></p>