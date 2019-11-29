---
layout: post
title: "Ask a Jedi: Development versus Staging servers"
date: "2008-01-08T15:01:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2008/01/08/Ask-a-Jedi-Development-versus-Staging-servers
guid: 2581
---

Andy asks:

<blockquote>
<p>
Ray, I was reading your blog post:
<a href="http://www.raymondcamden.com/index.cfm/2005/9/8/ColdFusion-101-Config-Files-AGoGo-Part-3-Wrap-Up
">ColdFusion 101 - Config Files A GoGo - Part 3 Wrap up</a>

And I can't think of a difference between the "dev" server
and the "staging" server.  Could you give me a clue how these boxes are different?
</p>
</blockquote>

I'm not sure if there is an official definition, but I'll give mine.

The development server is where you work. You should be the only one working on the machine. Code is constantly in flux and the site may or may not be up, depending on how much coffee you have in.

The staging server is where you deploy your work for folks to look at - <b>before</b> it goes to production. Think of it as the place you show your client your work. You don't want to show them your dev machine as they may not have time to look at your work right when you know things are stable. By pushing your updates to staging, the client can look it over in a stable format before it gets pushed to production.

Your staging machine should have the exact same physical specifications and config settings as your production machine. Visit Wikipedia for a slightly more <a href="http://en.wikipedia.org/wiki/Staging_site">expanded definition</a>.