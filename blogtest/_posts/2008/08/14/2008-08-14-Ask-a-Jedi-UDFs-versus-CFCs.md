---
layout: post
title: "Ask a Jedi: UDFs versus CFCs"
date: "2008-08-14T22:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/14/Ask-a-Jedi-UDFs-versus-CFCs
guid: 2972
---

John from Cincinnati (no, not really) asks:

<blockquote>
<p>
I have a question, as I am learning cfcs, and I am wondering is there a difference between cfcs and a UDF? From my understanding a cfc is a function that does something you want,and is something that you can call, and therefore use in other projects. Such as, have a date function that you can from other CF pages. Is this what a UDF is too? I don't seem to understand how the two are different, but I think that they must be.
</p>
</blockquote>
<!--more-->
Actually I think you have it backwards. Think of UDFs first as a the code that you single unit (single function, black box, whatever) that you can use from multiple places. A CFC though is a collection of UDFs. We typically call them methods when inside a CFC. 

You would normally use UDFs for operations that don't really relate to anything else. So for example, a UDF to do both a date and time format in one call is fairly simple, doesn't need anything else, and would be just fine by itself. 

Now imagine a few other UDFs. One adds a record to the Users table. One reads a record. One delete. Etc. All these UDFs are related to each other. They all probably share a common variable for the datasource. You can probably share some code for the Add User and Edit User routines. These common functions would work nicely together in a common CFC. 

Let me be clear. You wouldn't <b>have</b> to actually use a CFC. But the benefits of having these methods together, being able to share the same code and variables, make it more sensible to do so.

Let me also use this as an opportunity to bring up the <a href="http://www.raymondcamden.com/page.cfm/ColdFusion-Unconference">ColdFusion Unconference</a> again. If you are going to MAX this year, my first session is on code encapsulation options in ColdFusion. I talk about all the ways you can blackbox code and compare where and when you would use each.