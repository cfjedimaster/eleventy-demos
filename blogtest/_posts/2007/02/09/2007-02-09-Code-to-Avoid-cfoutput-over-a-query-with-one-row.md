---
layout: post
title: "Code to Avoid: cfoutput over a query with one row"
date: "2007-02-09T15:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/09/Code-to-Avoid-cfoutput-over-a-query-with-one-row
guid: 1830
---

I've seen this a few times in the past, but I just ran into it so I thought I'd share my feelings on it. 

If you have a query that contains one row that you are using for an edit form, you should not do:

<code>
&lt;cfoutput query="getDetail"&gt;
</code>

While your page will work just fine, it simply isn't the proper user of the tag. (And before I go on - I'll note that this is my opinion only.) When you tie a query to a cfoutput tag, you are telling ColdFusion to iterate over each item of the query. 

If your intent is to work a single database record (again, think of an edit form), then don't use what is - essentially - a looping construct. 

As it stands, for a developer just entering the project (like me!), you can cause confusion over what the template is actually meant to do.