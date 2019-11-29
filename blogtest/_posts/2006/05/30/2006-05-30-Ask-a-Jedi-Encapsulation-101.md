---
layout: post
title: "Ask a Jedi: Encapsulation 101"
date: "2006-05-30T16:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/30/Ask-a-Jedi-Encapsulation-101
guid: 1303
---

Marco asks:

<blockquote>
Do you use only one template for all CF operations(insert, update, delete, list) or separately using 3 or 4 templates?
</blockquote>

And I answered, "Polo", of course. All joking aside - this one simple question leads to a huge topic not really appropriate for a blog - code reuse and organization. I will try to answer at a high level, but you should consider this as just a (brief) overview and look for more resources. (I'll try to list some at the end.)

So - do I use one template for all CF operations. Of course not. I try to make my files as specific as possible. So for example, the file that displays the movies in my DVD collection will do only that. I'll use another page to pass in the data, but this one particular file will just handle rendering the DVD information. This is a fairly typical separation. You can see an example of this in the <a href="http://www.model-glue.com">Model-Glue</a> framework (url may not work for a bit, their servers are done). It is a MVC based framework that separates files between a model (code that handles the data), view (the pretty front end user interface), and the controller (think of it as the boss). 

In your question, you specifically mentioned 4 different database operations. For that my answer is a bit different. I typically use one CFC for my database operations. This one CFC handles creating, reading, updating, and deleting data (CRUD) and is typically named fooDAO.cfc. Foo is the data type I'm working with. DAO is "Data Access Object." For list, I'll typically use a Gateway CFC. I definitely can't take credit for this. I saw this in many examples from others. If you look at most of my <a href="http://ray.camdenfamily.com/projects/projects.cfm">projects</a>, you will see this in action. However, <a href="http://www.blogcfc.com">BlogCFC</a> makes use of one big CFC. I call this the Uber CFC. (Technically BlogCFC now uses a few other CFCs, but 99% of the work is in one big CFC.) I built it that way back when I was first learning CFCs. 

So I guess the long winded answer is that I try to make my files do as little as possible. They should have one task, and do it well. This makes debugging and organization a lot easier since I'm not digging through thousands of lines of code. (Again, see blog.cfc and you will wonder why you even read my blog.) 

Code organization is a bit like religion, so you may not find a lot of people agreeing on the particulars, but I do think you will find many people agreeing on the aim (Keep it simple and easy to update).