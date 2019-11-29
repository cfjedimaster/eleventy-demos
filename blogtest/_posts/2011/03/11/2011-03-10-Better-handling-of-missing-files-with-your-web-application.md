---
layout: post
title: "Better handling of missing files with your web application"
date: "2011-03-11T09:03:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2011/03/11/Better-handling-of-missing-files-with-your-web-application
guid: 4154
---

John sent in an interesting topic to me:

<p>

<blockquote>
Problem: User types in the wrong address. Your site generates a 404 error,
and calls your custom coldfusion 404 handler.
<br/><br/>
Solution: Perform a smarter suggestion for possible page matches. This will
work very much like a full-text search engine would auto-suggest words. The
custom handler would need to match "conatct" with "contact."
<br/><br/>
I'll bet we could dig into java to do some sort of dictionary lookup
somewhere!
</blockquote>
<!--more-->
<p>

I think this is an absolutely great idea, and it touches on something I've blogged about before. It's pretty trivial to write a 404 handler with Adobe's web application product. The following script will send any CFM request it can't handle to a 404 page:

<p>

<code>
component {
	this.name="missing";

	public boolean function onMissingTemplate(string targetpage) {
		location(url="404.cfm");
		return true;
	}
		
}
</code>

<p>

This by itself would be an improvement to most sites (shoot, evne mine). But by itself you are missing out on a lot of opportunities to actually - you know - help the user find what they want. So for example, I could easily add a quick log:

<p>

<code>
component {
	this.name="missing";

	public boolean function onMissingTemplate(string targetpage) {
		writelog(file="404",text="#arguments.targetpage#?#cgi.query_string#");
		location(url="404.cfm");
		return true;
	}
		
}
</code>

<p>

And then periodically check the log file for common issues. Let's say we see cases of what John used an example. We could easily handle it like so:

<p>

<code>
component {
	this.name="missing";

	public boolean function onMissingTemplate(string targetpage) {
		//handle some common ones...
		if(listLast(arguments.targetpage,"/") is "conatct.cfm") location(url="contact.cfm");
		writelog(file="404",text="#arguments.targetpage#?#cgi.query_string#");
		location(url="404.cfm");
		return true;
	}
		
}
</code>

<p>

Now - what you probably don't want is a giant set of IF statements, or even a switch statement. That can get messy pretty quickly. John suggested a dynamic based approach. You could - in theory - keep a list of files and see if any are "close" to the request. (Perhaps using <a href="http://www.cflib.org/udf/levDistance">levDistance</a>.) But this is something you would want to cache heavily. 

<p>

To me the critical thing here is this: Do you have a good understanding of how people are using your site? What things are they requesting that are not being found? Did CNN link to your site and screw up? You're going to have a lot more success handling it yourself than getting CNN to fix it probably. What are people searching for on your site? I just searched for xbox360 on Sony.com and the results were pitiful. Why not provide a link to a comparison between the PS3 and the XBox? Why not show a list of PS3 exclusives? But most of all - is there someone who is making it their job to see what's being searched for and actually <b>respond</b> to those requests.

<p>

This isn't a code issue at all. (Although certainly code can help us generate and report metrics.) It's a basic "Site Awareness" that far too many of us are lacking in. (To be fair, in some companies you have to beg for basic QA!) As I said, this is something I've blogged about before, and it's something I think about when I can't sleep. I'd love to get some comments from folks who are dealing with this - or at least thinking about dealing with this today.