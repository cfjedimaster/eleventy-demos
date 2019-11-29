---
layout: post
title: "Ask a Jedi: cfupdate versus cfquery"
date: "2006-08-09T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/09/Ask-a-Jedi-cfupdate-versus-cfquery
guid: 1456
---

James asks, 

<blockquote>
Ray, do you prefer to use cfupdate, or SQL cfquerys for your database updates? What do you see as the advantages, disadvantages, etc. or each? 
</blockquote>

I have never used cfupdate. Ever. (Ok, maybe once to test it out, but I didn't inhale.) Why? Multiple reasons. 

The first reason is more relevant to my recent move to Model-Glue. The cfupdate tag works with form data, and typically I do not directly access the form scope when using Model-Glue. While cfupdate would certainly work, it would be against the standards of MG development to do so. Ignoring Model-Glue for a moment, most of my SQL work is now done in CFCs where you don't want to be using the form scope either.

Secondly - while I don't know the guts underneath, I'd be surprised if bind variables were being used in the query. Therefore you would lose both the security as well as the performance you get with the cfqueryparam tag.

Third - I always feel a bit insecure about "helper" functions like this, especially when I can't dig in and see what is going on (see reason #2). Unlike Reactor and Model-Glue which also offer levels of abstraction, I can't see exactly what cfupdate is up to. 

Fourth - while my update query may be simple now, I figure if there is a 5% chance later on that the query may <i>not</i> be simple, I might as well write out the sql now.

Do any of my readers use cfupdate? I should run a poll to see which is the least used tag. (Anyone using cftable?)