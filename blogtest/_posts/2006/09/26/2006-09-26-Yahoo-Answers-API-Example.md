---
layout: post
title: "Yahoo Answers API Example"
date: "2006-09-26T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/09/26/Yahoo-Answers-API-Example
guid: 1555
---

I'm continuing my journey into the Yahoo API. Today let's take a look at <a href="http://answers.yahoo.com/">Yahoo Answers</a>. This is a service where people can ask questions and other people (hopefully bright, intelligent reasonable people, which the net is full of) then answer. While you can use the web to search for Yahoo Answers, you can also use a REST based API. The documentation for this API may be found here:
<!--more-->
<a href="http://developer.yahoo.com/answers/V1/questionSearch.html">http://developer.yahoo.com/answers/V1/questionSearch.html</a>

It is pretty simple so I won't go over it too deeply. Basically you can do free form searches along with searches on question status (is it already solved?), category, and date ranges. A good "real world" example of this would be a search for unanswered questions in your area of expertise. You could then try to answer the question and increase your rep with Yahoo Answers. (That plus 2.99 will buy you a cup of coffee.) 

So let's take a look at a quick example:

<code>
&lt;cfset searchTerm = "coldfusion"&gt;
&lt;cfset results = "10"&gt;
&lt;cfset appid = "dharma_rules_me"&gt;

&lt;cfhttp url="http://answers.yahooapis.com/AnswersService/V1/questionSearch?appid=#appid#&query=#urlEncodedFormat(searchTerm)#&results=#results#&date_range=7" result="result" charset="utf-8" /&gt;

&lt;cfif len(result.fileContent) and isXml(result.fileContent)&gt;

	&lt;cfset xmlResult = xmlParse(result.fileContent)&gt;
	
	&lt;cfif structKeyExists(xmlResult, "Error")&gt;
	
		&lt;cfoutput&gt;
		An error occured while performing your query. The error was:&lt;br /&gt;
		#xmlResult.Error.Message#
		&lt;/cfoutput&gt;
		
	&lt;cfelse&gt;

		&lt;cfset numResults = arrayLen(xmlResult.ResultSet.Question)&gt;
		
		&lt;cfoutput&gt;
		Your search for #searchTerm# questions returned #numResults# results.
		&lt;/cfoutput&gt;
	
		&lt;cfloop index="x" from="1" to="#numResults#"&gt;

			&lt;cfset node = xmlResult.resultSet.Question[x]&gt;
			
			&lt;cfset questiontype = node.xmlAttributes.type&gt;
			&lt;cfset subject = node.subject.xmlText&gt;
			&lt;cfset question = node.content.xmlText&gt;
			&lt;cfset date = node.date.xmlText&gt;
			&lt;cfset link = node.link.xmlText&gt;
			&lt;cfset category = node.category.xmlText&gt;
			&lt;cfset numanswers = node.numanswers.xmlText&gt;
			&lt;cfset answer = node.chosenanswer.xmlText&gt;
			
			&lt;cfoutput&gt;
			&lt;p&gt;
			&lt;b&gt;Question:&lt;/b&gt; &lt;a href="#link#"&gt;#question#&lt;/a&gt;&lt;br&gt;
			&lt;b&gt;Date:&lt;/b&gt; #date#&lt;br&gt;
			&lt;b&gt;Number of Answers:&lt;/b&gt; #numanswers#&lt;br&gt;
			&lt;/p&gt;
			
			&lt;p&gt;
			&lt;cfif len(answer)&gt;
			&lt;b&gt;Answer:&lt;/b&gt; #answer#
			&lt;cfelse&gt;
			This question has NOT been answered yet. Please &lt;a href="#link#"&gt;answer&lt;/a&gt; it!
			&lt;/cfif&gt;
			&lt;/p&gt;
			&lt;/cfoutput&gt;
			
			&lt;hr /&gt;
		&lt;/cfloop&gt;

	&lt;/cfif&gt;
&lt;/cfif&gt;
</code>

As a quick note - don't forget that I've changed the appid. You will need to <a href="http://api.search.yahoo.com/webservices/register_application">get your own</a> if you want to test. 

The URL is pretty long, so let me focus on the variables and what they mean:

<ul>
<li>appid: The application id. 
<li>query: The search term.
<li>results: The total number of results. The API for Yahoo Answers has a max of 50 results.
<li>date_range: My value of 7 just means find results in the last 7 days. 
</ul>

There are more options for the API of course. See the <a href="http://developer.yahoo.com/answers/V1/questionSearch.html">documentation</a> for more attributes.

Unlike my last example, I added a bit of error checking this time. I look at the XML packet and if Error is the root node, then I display the error result. You probably don't want to display to this user, but you would definitely want to email it to yourself. 

After that it is simply a matter of getting the values out of the XML. These lines get a subset of what is returned:

<code>
&lt;cfset questiontype = node.xmlAttributes.type&gt;
&lt;cfset subject = node.subject.xmlText&gt;
&lt;cfset question = node.content.xmlText&gt;
&lt;cfset date = node.date.xmlText&gt;
&lt;cfset link = node.link.xmlText&gt;
&lt;cfset category = node.category.xmlText&gt;
&lt;cfset numanswers = node.numanswers.xmlText&gt;
&lt;cfset answer = node.chosenanswer.xmlText&gt;
</code>

Once I have the values I output them to the user. I also prompt them to answer the question if there isn't a chosen answer yet. By "chosenanswer" Yahoo means that the person who wrote the question hasn't picked one answer as the one that best answers their problem. A question can have multiple answers without one being chosen.

p.s. I'd love to share this with Yahoo's Developer Network. But as far as I can see, they have no way of contacting them. Surely <i>someone</i> must have a connection?