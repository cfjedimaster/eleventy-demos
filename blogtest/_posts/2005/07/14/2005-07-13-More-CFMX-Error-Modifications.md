---
layout: post
title: "More CFMX Error Modifications"
date: "2005-07-14T08:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/07/14/More-CFMX-Error-Modifications
guid: 624
---

Did you ever notice that if you encounter a CF error and use IE, the error template collapses, and hides, the stack trace? Of course, no one <i>I</i> know actually uses IE. All the cool kids use Firefox. Well, it is trivial to update your exception template to hide the strack traces in Firefox as well.

Open up /web-inf/exception/detail.cfm and find this line:

&lt;cfset bIE = (cgi.user_agent contains "MSIE")&gt;

and change it to:

&lt;cfset bIE = (cgi.user_agent contains "MSIE" or cgi.user_agent contains "Firefox")&gt;

That's it. Enjoy.