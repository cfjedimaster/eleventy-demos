---
layout: post
title: "Ask a Jedi: One login, multiple applications"
date: "2008-01-11T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/11/Ask-a-Jedi-One-login-multiple-applications
guid: 2586
---

William asks:

<blockquote>
<p>
I want to build a "portal" to access different web apps.  I would like to have a single login in the portal and some sort of trust between the portal and the other web applications so users will not have to login multiple times.  Is this possible using the cflogin framework?
</p>
</blockquote>

Ok, so I like to rag a bit on the cflogin framework. In the "celebrity" sphere of ColdFusion, cflogin is the Stephen Baldwin of features. But I will say one thing for it - it does make sharing a login among multiple applications pretty easy.

The CFLOGIN tag supports an applicationToken variable. By default, this will be set to the current application name. But if you specify a value, and use the same value in your other applications, your login credentials will be available to all the applications.

If you don't want to use CFLOGIN, then you have to roll your own. Assuming that you must have multiple application names, then the only values that will be cross-application will be cookie values. You could use a cookie to store the logged in status as well as a pointer to some unique user ID that all your applications can use as a reference.