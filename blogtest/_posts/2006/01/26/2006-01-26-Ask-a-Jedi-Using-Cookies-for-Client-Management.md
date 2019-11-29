---
layout: post
title: "Ask a Jedi: Using Cookies for Client Management"
date: "2006-01-26T15:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/26/Ask-a-Jedi-Using-Cookies-for-Client-Management
guid: 1061
---

Here is an interesting question:

<blockquote>
Why would you want to use cookies to store client variables vs. using the registry or external database?
</blockquote>

To be honest, I don't know why. If you want to use client variables, I'd suggest using a database. You want to avoid the registry for sure. The only reason I could come up with to use cookie variables would be if you were at an ISP and only had one DSN. You would probably want to use that for your own content instead of the client variables. 

Has anyone used cookies for client variables before?