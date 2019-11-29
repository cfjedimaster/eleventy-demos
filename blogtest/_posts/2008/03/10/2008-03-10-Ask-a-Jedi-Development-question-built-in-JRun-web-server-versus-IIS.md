---
layout: post
title: "Ask a Jedi: Development question - built in JRun web server versus IIS"
date: "2008-03-10T16:03:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2008/03/10/Ask-a-Jedi-Development-question-built-in-JRun-web-server-versus-IIS
guid: 2699
---

Paul asks:

<blockquote>
What's a better development environment?

For those of us that use a local development environment, is there any advantage to using CF Dev Edition's built-in JRun
server, vs. installing IIS on Windows XP and using that?

I just looked at my task manager, and JRun is using a whopping 220 MB of memory, without having been accessed since I booted, completely idle. That's far more than anything else currently running on my system.
</blockquote>
<!--more-->
When it comes to a development environment, I think most people feel that the best rule is that it should match, as much as possible, the production environment. I don't think it is expected that it would be an exact match. Production would probably be Windows Server 2003 and development would be Windows XP, but you get the idea.

With that being said - you should not be using the built-in JRun web server for production. Therefore I'd recommend against it in development as well.

However - IIS is a bit of a pain. Unless you are willing to google and look up a hack, you can't run multiple virtual web servers with IIS under XP. Now if all you work on is one site, that's no big deal. If you are a contractor and work on multiple sites, you really want that multiple server setup. That's why I use Apache (well, I'm on a Mac now so I kind of have to, but even before I switched I used Apache). The only time the difference between Apache and IIS has bit me in the butt is with CGI variables.