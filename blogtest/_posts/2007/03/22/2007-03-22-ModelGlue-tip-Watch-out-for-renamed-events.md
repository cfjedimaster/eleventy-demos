---
layout: post
title: "Model-Glue tip - Watch out for renamed events"
date: "2007-03-22T13:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/22/ModelGlue-tip-Watch-out-for-renamed-events
guid: 1917
---

So I think everyone knows that if you redesign a web site, you can potentially end up with renamed files and the like which means old URLs will no longer work. There are multiple ways you can handle this. You can use a URL Rewriter. A 404 handler. Etc.

Well what happens when you update a Model-Glue (or Fusebox, etc) site? If you are like me, you probably have a total and complete brain fart and completely forget. Personally I brain Model-Glue and it's usage of one main index.cfm. 

This past Sunday I helped launch the second version of <a href="http://www.universitynotes.net">University Notes</a>. This is a site I built with some friends of mine in college. It has been pretty successful and version 2 was a major update. In that update I changed almost each and every single event name, typically from XXX to page.XXX. 

So what happened the day after we launched? I got a whole heck of a lot of error messages about missing events. I covered how to handle these events in the past. (See this <a href="http://ray.camdenfamily.com/index.cfm/2006/11/5/Handling-unknown-events-in-ModelGlue">blog entry</a>.) 

I bring it up since I thought I'd show how I fixed it. Instead of catching the unknown event error, I created a mapping in my Application.cfm file. Here is a snippet:

<code>
&lt;cfif structKeyExists(url,"event")&gt;
	&lt;cfif url.event is "dologinregister"&gt;
		&lt;cfset url.event = "page.logon"&gt;
	&lt;cfelseif url.event is "home"&gt;
		&lt;cfset url.event = "page.index"&gt;
	&lt;cfelseif url.event is "viewprofile"&gt;
		&lt;cfset url.event = "page.profile"&gt;
	&lt;cfelseif url.event is "registerform"&gt;
		&lt;cfset url.event = "page.register"&gt;		
...
</code>

I'm sure I'm not the only person to make such a mistake, so keep it in mind if you work to update a large frameworks based site. 

p.s. Not that it's related, but the site also makes heavy use of Spry. Check out the Courses/Ratings/Content tags.