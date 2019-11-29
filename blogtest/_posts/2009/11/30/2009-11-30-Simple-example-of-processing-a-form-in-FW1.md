---
layout: post
title: "Simple example of processing a form in FW/1"
date: "2009-11-30T23:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/30/Simple-example-of-processing-a-form-in-FW1
guid: 3627
---

I spent the last week learning <a href="http://fw1.riaforge.org">FW/1</a> (you can see my quick review <a href="http://www.raymondcamden.com/index.cfm/2009/11/28/Framework-One">here</a>) and while - in general - it was pretty easy - one thing was a bit confusing for me. I had a hard time wrapping my head around the logic of: 

1) User submits a form.<br/>
2) Controller checks the form.<br/>
3) If bad, we go back to the form.<br/>
4) If good, we go to some other view.

That's not complex, but as I said, it was tricky for me to get it working with FW/1. In a Model-Glue application I'd post to an event that runs one controller method. That method would do it's validation and then either throw a bad result or fire off a service method and use a good result. This logic doesn't work the same in FW/1. Thanks go to <a href="http://www.corfield.org/blog">Sean Corfield</a> for explaining why and hopefully this blog entry will make it easier for others.


First off - what happens if you use a simple controller method? Imagine you had code like so:

<code>
&lt;cffunction name="addComment" output="false"&gt;
	&lt;cfargument name="rc" type="struct" required="true"&gt; 
	&lt;cfparam name="rc.comment_name" default=""&gt;
	&lt;cfparam name="rc.comment_email" default=""&gt;
	&lt;cfparam name="rc.comment_comments" default=""&gt;
		
	&lt;cfset rc.errors = []&gt;
		
	&lt;cfif not len(trim(rc.comment_name))&gt;
		&lt;cfset arrayAppend(rc.errors, "You must include a name.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(trim(rc.comment_email)) or not isValid("email", rc.comment_email)&gt;
		&lt;cfset arrayAppend(rc.errors, "You must include a valid email.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(trim(rc.comment_comments))&gt;
		&lt;cfset arrayAppend(rc.errors, "You must include your comments.")&gt;
	&lt;/cfif&gt;
	&lt;cfif arrayLen(rc.errors)&gt;
		&lt;cfset variables.fw.redirect("blog.entry", "id,comment_name,comment_email,comment_website,comment_comments,errors")&gt;
	&lt;cfelse&gt;
		&lt;cfset variables.fw.service("blog.addcomment", "data")&gt;
		&lt;cfset variables.fw.redirect("blog.entry", "id")&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

This is very similar to how I'd have written it in Model-Glue. Get the values - check em - and either create a bad or good result. Obviously this didn't work. When I tested with errors it worked fine. When I tested with a good form, the redirect work but not the service call. There are a couple of things wrong here. 

First - I had forgotten that FW/1 will run my service call automatically. I didn't need to run the call. Secondly - as is described in the <a href="http://fw1.riaforge.org/wiki/index.cfm/DevelopingApplicationsManual#Designing_Controllers">Designing Controllers</a> section of the FW/1 docs, there is an implicit set of controller events run on every request. This is <b>more</b> than just the controller method with the same name as the event ("addComment"). It includes both a pre and post invocation as well. What this means is that I can use the implicit calls, in this case, startAddComment and endAddComment, to handle 'wrapping' my service call. From my previous example application, here is the rewritten logic:

<code>
&lt;cffunction name="startAddComment" output="false"&gt;
	&lt;cfargument name="rc" type="struct" required="true"&gt; 
	&lt;cfparam name="rc.comment_name" default=""&gt;
	&lt;cfparam name="rc.comment_email" default=""&gt;
	&lt;cfparam name="rc.comment_comments" default=""&gt;
		
	&lt;cfset rc.errors = []&gt;
		
	&lt;cfif not len(trim(rc.comment_name))&gt;
		&lt;cfset arrayAppend(rc.errors, "You must include a name.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(trim(rc.comment_email)) or not isValid("email", rc.comment_email)&gt;
		&lt;cfset arrayAppend(rc.errors, "You must include a valid email.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(trim(rc.comment_comments))&gt;
		&lt;cfset arrayAppend(rc.errors, "You must include your comments.")&gt;
	&lt;/cfif&gt;
	&lt;cfif arrayLen(rc.errors)&gt;
		&lt;cfset variables.fw.redirect("blog.entry", "id,comment_name,comment_email,comment_website,comment_comments,errors")&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;

&lt;cffunction name="endAddComment" output="false"&gt;
	&lt;cfargument name="rc" type="struct" required="true"&gt; 
	&lt;cfset variables.fw.redirect("blog.entry", "id")&gt;
&lt;/cffunction&gt;
</code>

Notice - I don't even have an addComment controller method. Rather - I run code both in the beginning and end of my event. The service call is implicit. The error handling in onAddComment, specifically the redrect, will handle exiting out of the current process on error. Otherwise, things proceed normally with the service call and endAddComment running automatically.

Makes sense once you see it I guess but it means that your controller code has to be a bit... I don't know. I won't say more complex, since you get to leave a lot out - but coming from Model-Glue, you definitely have to think... different about your controllers.