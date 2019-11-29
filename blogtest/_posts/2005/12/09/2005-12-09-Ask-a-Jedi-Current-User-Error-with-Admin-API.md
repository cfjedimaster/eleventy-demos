---
layout: post
title: "Ask a Jedi: Current User Error with Admin API"
date: "2005-12-09T18:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/09/Ask-a-Jedi-Current-User-Error-with-Admin-API
guid: 964
---

Talk about timing. I decided to hit up a few old Ask a Jedi questions and came across this:

<blockquote>
I'm working with the CFMX 7 Admin API.  When trying to invoke the 'getJvmProperty()' method, I receive an error stating 'Current user is not authorized to invoke this method.'

I am instantiating the admin.cfc and the runtime.cfc in the request scope.   I am also using the request.adminObj.login() method to login to the Administrator.  When I invoke the inherited method 'isAdminUser()' from the runtime object, the response is TRUE.

I am slightly confused here.
</blockquote>

Today Macromedia (um, sorry, Adobe) released a tech note that I believe answers this exact question:

<a href="http://www.macromedia.com/cfusion/knowledgebase/index.cfm?id=b46c5e8c&pss=rss_coldfusion_b46c5e8c"> Error "Current user is not authorized to invoke this method" occurs when using the ColdFusion MX 7 Admin API</a>