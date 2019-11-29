---
layout: post
title: "Find the bug...."
date: "2007-06-22T11:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/22/Find-the-bug
guid: 2143
---

I was helping a user yesterday who ran into an odd problem. His CFC was using Application.DSN (which is another problem) and he kept getting an error that said Application.DSN didn't exist. He copied his line that defined Application.DSN and set it in the Request scope. When he updated the CFC to use the Request scope, it worked fine. What was the problem? Here is some code that simulates his Application.cfm. See if you can spot it before reading on....

<code>
Application.cfm:
&lt;cfset application.dsn = "goo"&gt;
&lt;cfset request.dsn = "goo"&gt;
&lt;cfapplication name="myapp"&gt;
&lt;cfset application.random = "Paris Hilton is my idol...."&gt;

test.cfm:
&lt;cfdump var="#application#"&gt;
&lt;cfdump var="#request#"&gt;
</code>
<!--more-->
If you run this test, you will clearly see that the Application scope only has one variable, random. The Request scope shows the DSN. So now you can see what he saw - that the Application scope was working incorrectly and the Request scope worked fine.

But... look again. Do you see his CFAPPLICATION tag? It is <b>after</b> his application.dsn line. ColdFusion had not "started" the Application yet. Therefore his DSN variable was actually added to the magical unnamed Application scope area. To see what I mean, simply add a dump before his CFAPPLICATION tag. 

So two lessons from this:

1) First, always remember to put the CFAPPLICATION tag before any code that actually uses the Application scope.

2) Second, this is one more big reason to migrate to Application.cfc. If he had used onApplicationStart(), this would not/could not have happened.