---
layout: post
title: "Ask a Jedi: Is CreateObject slow?"
date: "2006-07-17T11:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/17/Ask-a-Jedi-Is-CreateObject-slow
guid: 1406
---

Ronan asked the following question:

<blockquote>
I´ve read some messages talking about resources used by Coldfusion (and the Java) to instantiate objects (CreateObject function or cfinvoke tag).

Is it possible to an application becomes slow because the obsessive use of the OOP or many objects instantiated per template?
</blockquote>

While I wouldn't say OOP is the cause, I can say I've seen excessive use of CreateObject slow a site down. I almost <i>always</i> recommend that you createObject once, typically in the Application.cfc onApplicationStart method. If you are using CFMX instead of CFMX7, simply use the "old style" of checking for an application flag. For an example of this, check out <a hrer="http://www.blogcfc.com">BlogCFC</a>'s Application.cfm file. I create a few objects, some of which are quite big. (The core blog.cfc file is way too big.) By ensuring I only create these files once, I can dramatically improve my page to page performance.

As a general FYI, there are a number of steps you can do to track down slow parts of your application. First - turn on the "Log Slow Pages" option in the admin and try to figure out what pages are the culprits. Make use of the cftimer tag to isolate what parts of your files are slowest. Check your SQL queries to ensure your database queries aren't performing poorly. 

Basically, you need to get down and dirty and dig around all your files. I've said in the past it is always a good idea to have a very strong understanding of what your application does in every request. This will be a big help as well.