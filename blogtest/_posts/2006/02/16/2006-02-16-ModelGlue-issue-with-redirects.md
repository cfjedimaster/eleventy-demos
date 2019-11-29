---
layout: post
title: "Model-Glue issue with redirects"
date: "2006-02-16T15:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/16/ModelGlue-issue-with-redirects
guid: 1105
---

I ran into an interesting issue with Model-Glue this morning, and since it is something I've seen now on multiple sites, I thought it was time to dig into it. There are two issues I want to talk about.

So, I have this site, and it has an event, voteTestHelpful. The event contained the following results:
<!--more-->
<code>
&lt;results&gt;
	&lt;result name="DoLogin" do="DoLoginRegister" redirect="yes"/&gt;
	&lt;result do="ViewClass" redirect="yes" append="id"/&gt;
&lt;/results&gt;
</code>

This worked, but I noticed something odd. After the user would run the event, the URL still had voteTestHelpful. Now - this was ok. If the user hit reload, nothing bad would happen. But it bugged me. I did a bit of digging, and discovered a bug in Model-Glue. (Joe has said this is already fixed in the BER version.) In order to get the "right" URL in the browser, you simply have to use a named event, like so:

<code>
&lt;results&gt;
	&lt;result name="DoLogin" do="DoLoginRegister" redirect="yes"/&gt;
	&lt;result name="success" do="ViewClass" redirect="yes" append="id"/&gt;
&lt;/results&gt;
</code>

Annoying, but I can live with Model-Glue having bugs, since I've heard that a few of my applications have bugs as well. (grin)

So what was the second issue? I was getting error reports from the <a href="http://www.coldfusioncookbook.com">ColdFusion Cookbook</a>. The error reports were being fired from the event that adds comments. As far as I could tell, I could never get the event to fire on either the live server or my local copy.

In the past, I've <a href="http://ray.camdenfamily.com/index.cfm/2006/1/4/Ask-a-Jedi-Using-onError-to-Mail-the-Errror">advocated</a> sending a dump of all the major scopes when using error reporting. That was a good idea in this case. Turns out the CGI variable for the browser showed it was Google AdSense agent. When you view a page with Google AdSense, it actually hits your page, scans it, and figures out the best ads to show. Since my redirect wasn't changing the URL, Google was hitting the URL as is, and since some of the data had been sent in via the Form scope, Model-Glue didn't have the proper ID value to use. I'm not even sure if that made sense - but I'm sharing it in case others run across it as well.

p.s. This "other" Model-Glue site is not quite released yet. When it is, I'll let you know. It's not a fun ColdFusion site, but rather a site I did as a favor for a family friend.