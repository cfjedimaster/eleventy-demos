---
layout: post
title: "Ask a Jedi: CFLOGIN and duplicate logins?"
date: "2008-11-07T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/07/Ask-a-Jedi-CFLOGIN-and-duplicate-logins
guid: 3089
---

Robert Palmer (Yes, THE <a href="http://en.wikipedia.org/wiki/Robert_Palmer_(singer)">Robert Palmer</a>), asks:

<blockquote>
<p>
I have a question about CFLogin. Is there any way to
check and see if a username is already in use and prevent the login if it is. I am trying to prevent multiple people from logging in with the same credentials at the same time.
</p>
</blockquote>
<!--more-->
The short answer is no. CFLOGIN really just provides a way to see if your are logged in, store your authentication information (username), and do simple roles based authorization. Anything outside of that area would have to be customized per your application needs.

Solving this problem typically involves solutions that aren't going to be perfect. You can keep a RAM based collection of who has logged in easily enough. Just store the list of users in the Application scope. When the user logs out, remove this name. If they forget to logout, just use onSessionEnd to handle it there. 

The problem with this solution is that users don't always remember to logout. If they were to switch from Firefox to IE for example (crazier things have happened) and forget to logout, they would not be able to login again. You could also remember their IP address and simply allow multiple logins from the same IP, but that could be compromised as well. 

If I had to do this right now, I'd probably just use the Application scope list of usernames. Whats nice about this is that it also gives you some nice metrics you can inspect as well (N users are currently logged in).