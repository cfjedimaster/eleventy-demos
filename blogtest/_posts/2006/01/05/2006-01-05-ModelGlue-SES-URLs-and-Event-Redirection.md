---
layout: post
title: "Model-Glue, SES URLs, and Event Redirection"
date: "2006-01-05T17:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/05/ModelGlue-SES-URLs-and-Event-Redirection
guid: 1011
---

I ran into an interesting problem this morning when working on the ColdFusion Cookbook site. I was adding some protection in for URL variables. Right now when you link to a category, it looks like so:

http://dev.coldfusioncookbook.com/category/6/Forms

(Minus the dev of course. ;)

This translates via URL rewriting to:

http://dev.coldfusioncookbook.com/index.cfm?event=showCategory&id=6

I wanted to validate that the ID was a valid one. Luckily the rewrite just ignore non-numeric numbers. So if you change 6 to apple, you get a 404. (I should probably fix that as well.) But if you change 6 to 600, you got an empty page.
<!--more-->
So this was easy enough to handle in the controller. I added code like so:

<code>
&lt;cfif category.getID() is "0"&gt;
	&lt;cfset arguments.event.addResult("invalid") /&gt;
</code>

Then my ModelGlue.xml had:

<code>
&lt;result name="invalid" do="Home" redirect="yes"/&gt; 
</code>

This basically said - if an invalid result was added to the event, push em back to the home page. However - when I tested - I got an infinite redirection error in Firefox. (Hey, thank God at least Firefox recognizes that.) Turns out it was trying to go here:

http://dev.coldfusioncookbook.com/category/6/Forms/index.cfm?event=Etc

Notice how it didn't remove the SES information? Turns out there is a setting in the core Model-Glue code that says what the "home" URL is. This setting is called self. You can override this in your own ModelGlue.xml, as I did here:

<code>
&lt;setting name="self" value="/index.cfm" /&gt;
</code>

Thanks go to <a href="http://www.doughughes.net">Doug Hughes</a> for this idea! (And sorry Doug for forgetting your credit on the first post!)