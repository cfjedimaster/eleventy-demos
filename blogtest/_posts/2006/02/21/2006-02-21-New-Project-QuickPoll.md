---
layout: post
title: "New Project: QuickPoll"
date: "2006-02-21T14:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/21/New-Project-QuickPoll
guid: 1115
---

Hey, did you see my <a href="http://ray.camdenfamily.com/index.cfm/2006/2/21/Reader-Survey">post</a> about the reader survey? Guess what - the form was all built on the fly using a new project I released today, <a href="http://ray.camdenfamily.com/projects/quickpollcfc">QuickPoll CFC</a>. "Project" may be too strong of a word - it's really just a nice CFC. Think of it like a "lite" version of <a href="http://ray.camdenfamily.com/projects/soundings">Soundings</a>.
<!--more-->
QuickPoll CFC lets you rapidly deploy a simple survery. How rapid? The following code is shows how my <a href="http://ray.camdenfamily.com/index.cfm/2006/2/21/Reader-Survey">reader survey</a> was done:

<code>
&lt;cfset poll = createObject("component", "quickpoll")&gt;
		
&lt;cfset poll.setThankYouMessage("Thanks for taking the time to respond to my survey. I'll be sharing the results in a week or two once I've collected the data.")&gt;
&lt;cfset poll.setMailResults("ray@camdenfamily.com")&gt;
&lt;cfset poll.setPollName("Initial Test")&gt;
&lt;cfset resultsFile = expandPath("./results.csv")&gt;
&lt;cfset poll.setFileResults(resultsFile)&gt;
		
&lt;cfset poll.addQuestion("text", false, "What is your name? (Optional)")&gt;
&lt;cfset poll.addQuestion("text", false, "What is your email address? (Optional)")&gt;
&lt;cfset poll.addQuestion("multichoicesingle", true, "I visit your blog", "Multiple times a day,Once a day,Few times a week,Once a week,Very rarely")&gt;
&lt;cfset poll.addQuestion("multichoicesingle", true, "In general, your articles are", "Interesting and useful to my job@Interesting, but not very useful to my job@Not very interesting", "@")&gt;
&lt;cfset poll.addQuestion("multichoicesingle", true, "The design of this blog", "Is fine@Is great, but not terribly important to me@Isn't great, but doesn't impact my reading@Is bad, and detracts from my reading", "@")&gt;
&lt;cfset poll.addQuestion("multichoicesingle", true, "Compared to other ColdFusion blogs, I find this blog", "Very Useful@Somewhat Useful@Useful@Not very useful@A complete waste of time", "@")&gt;
&lt;cfset poll.addQuestion("textarea", false, "What does my blog need more articles on?")&gt;
&lt;cfset poll.addQuestion("textarea", false, "What does my blog need less articles on?")&gt;
&lt;cfset poll.addQuestion("textarea", false, "The thing I like best about your blog is")&gt;
&lt;cfset poll.addQuestion("textarea", false, "The thing I like least about your blog is")&gt;
&lt;cfset poll.addQuestion("textarea", false, "Any last comments?")&gt;
</code>

The CFC allows you to generate results in email or a CSV file (or both). Enjoy.