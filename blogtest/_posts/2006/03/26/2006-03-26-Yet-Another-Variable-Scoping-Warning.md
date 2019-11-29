---
layout: post
title: "(Yet Another) Variable Scoping Warning"
date: "2006-03-26T20:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/26/Yet-Another-Variable-Scoping-Warning
guid: 1170
---

Scott Pinkston sent me a note this weekend about a problem he ran into:

<blockquote>
I had a page that set a form variable called path.  The action page then used the path variable to determine which table to use.  I just used #path# in the code instead of #form.path#.  Under IIS this worked, under apache it threw an error.  I could not figure it out until I decided to look at the value of path.  Apache returned the following for #path#:

C:\WINDOWS\system32;C:\WINDOWS;C:\WINDOWS\system32\WBEM;C:\Program Files\ATI Technologies\ATI Control Panel;C:\Program Files\Microsoft SQL Server\80\Tools\Binn\;C:\Program Files\Microsoft SQL Server\90\Tools\binn\;C:\Program Files\Microsoft SQL Server\90\DTS\Binn\;C:\Program Files\Microsoft SQL Server\90\Tools\Binn\VSShell\Common7\IDE\

IIS returned the value of the form.path variable.  Under Apache, once I changed it to form.path things worked.
</blockquote>

Yet another good reason to use the full scope when referencing variables, and thanks to Scott for sharing. This is probably also a good place to remind folks that CGI variables change between web servers as well. If you plan on running a site on IIS, or Apache, it is a <i>real</i> good idea to make sure your dev environment uses the same web server.