---
layout: post
title: "Ask a Jedi: Spry, Database, and XML Question"
date: "2008-03-10T23:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/03/10/Ask-a-Jedi-Spry-Database-and-XML-Question
guid: 2700
---

Michael asks:

<blockquote>
<p>
I actually have a question about spry. This is my first time
using spry ability and quite stuck with what I'm doing at the moment. I have implemented the spry function to my code with reading it from the xml and it's working fine. However, is there any way of spry to read straight from the SQL server? The program that I am creating has the ability to display in multiple languages. Once the xml is produced and able to be displayed on the screen, when I tried to change the language, it will not work as the xml is not changed. So I might have to read straight from the sql instead of going through xml first.
Please let me know how to read it from the sql server with using spry.
</p>
</blockquote>

I'm not SQL Server expert, but I know that there is built-in functionality to generate XML in a query. This is done using a FOR XML command. (See some <a href="http://www.15seconds.com/issue/001102.htm">examples</a> at 15 Seconds</a>.) That isn't the issue though. You want to point Spry directly at SQL Server, which as far as I know isn't possible. Your database server isn't a web server. You can't just point at it with a URL and get XML back. Even if SQL Server (or any db server) allowed for that, it would be pretty scary to let a URL run any query on your database. 

What you want to do (if I read your question right) is to make Spry load a new URL everytime you change the language. You can hit one common CFM page that accepts a language URL and passes it on to the SQL Server via CFQUERY.