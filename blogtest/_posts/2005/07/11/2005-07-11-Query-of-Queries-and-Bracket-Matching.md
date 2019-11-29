---
layout: post
title: "Query of Queries and Bracket Matching"
date: "2005-07-11T16:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/07/11/Query-of-Queries-and-Bracket-Matching
guid: 618
---

So, I ran into an interesting issue today while working on a new (personal) project. I needed to do a query of query (QofQ) and match records that <b>started</b> with the following:

CFC[(space)

In the string above, (space) is meant to represent a space.

So, in general, this would be easy, but the [ is a special character in QofQ. No problem I thought, I'll just escape it. QofQ let's you use the ESCAPE clause to signify another character as the escape character. I thought I would just use that and be fine - but I kept getting errors (or no results).

I tried many things, and other CF developers also offered good ideas, but nothing worked until Russ (sorry, don't know you last name) suggested the following syntax:

<div class="code">and template like 'CFC[[ %'<br>
escape '['</div>

This solution is the one that finally worked. So what is the project I'm working on? It's an idea motivated by the profiler New Atlanta demonstrated at CFUNITED. It's basically a new kind of debug template for CFMX. If it works right, it could be pretty cool. If I ever get it done, I'll post it here of course.