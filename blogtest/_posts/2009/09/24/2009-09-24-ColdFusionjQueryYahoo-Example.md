---
layout: post
title: "ColdFusion/jQuery/Yahoo Example"
date: "2009-09-24T19:09:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/09/24/ColdFusionjQueryYahoo-Example
guid: 3541
---

So after releasing an updated version of my <a href="http://cfyahoo.riaforge.org">CFYahoo</a> project at lunch, I thought I'd whip up a super quick demo that made use of it. While researching some of the API changes last night, I came across <a href="http://www.ooer.com/yahoobattle/index.php">YahooBattle!</a>. With a name like that, how could I <i>not</i> click? The idea is simple - provide two search terms and it tells you which term has the most results. I decided to quickly whip up an example that would allow you to compare multiple keywords.
<!--more-->
I began with just a form:

<code>
&lt;form&gt;
&lt;input type="button" id="reportBtn" value="Display Report"&gt;&lt;br/&gt;
Keywords:&lt;br/&gt;
&lt;div id="keywordgutter"&gt;
&lt;input type="text" name="keyword"&gt;&lt;br/&gt;
&lt;input type="text" name="keyword"&gt;&lt;br/&gt;
&lt;/div&gt;
&lt;input type="button" id="addBtn" value="+" title="Add Keyword"&gt;
&lt;/form&gt;
</code>

I've got 2 keyword fields, a "add" button at the bottom, and I put my Display Report button top. Now for the jQuery:

<code>
$(document).ready(function() {

	//add a new keyword when you hit +	
	$("#addBtn").click(function() {
		var s = '&lt;span&gt;&lt;input type="text" name="keyword"&gt;&lt;input type="button" value="-" name="remove" title="Remove Keyword"&gt;&lt;br&gt;&lt;/span&gt;'
		$("#keywordgutter").append(s)
	})
	
	//support removing new keywords only
	$("input[name='remove']").live("click",function() {
		$(this).parent().remove()
	})
	
	//display report
	$("#reportBtn").click(function() {
		var keywords = []
		$("input[name='keyword']").each(function() {
			var value = $.trim($(this).val())
			if(value != '') keywords[keywords.length] = $(this).val()
		})
		if(keywords.length &gt; 0) {
			$("#report").html("&lt;i&gt;Checking your keywords - please stand by...&lt;/i&gt;")
			$("#report").load('report.cfm',{% raw %}{keywords:keywords}{% endraw %})
		}
	})
})
</code>

There are 3 main functions here. The first adds support for adding keyword fields. I do this with a simple bit of HTML that gets appended to my form. Notice the span around the field. That will come back later.

The second function handles removing data. Now because I'm adding stuff on the fly, I have to use the jQuery live function. This is a way to handle items that don't exist in the DOM at the time of script execution. Since the new keyword fields are being added dynamically, I can use the live method to kind of 'monitor' them as they get added. Now to actually remove the keyword, I just have to bind to the button I added, and then just grab the parent. Remember how I wrapped the keyword field and the minus button with a span? That's the parent. So I can just do .parent().remove(). God I hate jQuery for being so simple.

The next function handles loading the report. I gather up all the form fields using the name keyword. For each, I do a quick trim and then add it to an array. If we actually have values, I pass them all to ColdFusion to handle generating the report. 

So the actual ColdFusion code is almost as simple. 

<code>
&lt;cfparam name="form.keywords" default=""&gt;

&lt;cfif form.keywords is ""&gt;
	&lt;p&gt;
	No keywords were sent to the report.
	&lt;/p&gt;
	&lt;cfabort&gt;
&lt;/cfif&gt;

&lt;cfset searchAPI = createObject("component", "cfyahoo.org.camden.yahoo.search")&gt;

&lt;cfset scores = {}&gt;
&lt;cfset total = 0&gt;

&lt;cfloop index="word" list="#form.keywords#"&gt;
	&lt;cfinvoke component="#searchAPI#" method="search" returnVariable="result"&gt;
		&lt;cfinvokeargument name="query" value="#word#"&gt;
		&lt;!--- we ask just for one because all we care about is the total ---&gt;
		&lt;cfinvokeargument name="results" value="1"&gt;
	&lt;/cfinvoke&gt;
	&lt;cfset scores[word] = result.totalavailable&gt;
	&lt;cfset total+=result.totalavailable&gt;
&lt;/cfloop&gt;

&lt;style&gt;
h2 {% raw %}{ font-family:Arial; }{% endraw %}
&lt;/style&gt;

&lt;h2&gt;Number of Yahoo Results per Keyword&lt;/h2&gt;
&lt;cfchart format="flash" chartheight="400" chartwidth="400"&gt;
	&lt;cfchartseries type="pie"&gt;
		&lt;cfloop item="word" collection="#scores#"&gt;
			&lt;cfchartdata item="#word#" value="#scores[word]#"&gt;
		&lt;/cfloop&gt;
	&lt;/cfchartseries&gt;
&lt;/cfchart&gt;
</code>

As you can see, I loop over the keywords and for each I ran a query against Yahoo. All I need are the totals so I tell the API to return only one result. I don't actually even care what it is - I just grab the total. 

Lastly, I take the data and simply pass it over to a pie chart. 

Have you ever wondered how "megamouth shark", "cylon", and "mustache trimmer" would compare? Now you know:

<img src="https://static.raymondcamden.com/images/Picture 259.png" />

You can test this yourself here: <a href="http://www.coldfusionjedi.com/demos/cfyahoo2/test.cfm">http://www.coldfusionjedi.com/demos/cfyahoo2/test.cfm</a>