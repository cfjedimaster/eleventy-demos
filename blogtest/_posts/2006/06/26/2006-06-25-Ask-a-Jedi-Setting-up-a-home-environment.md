---
layout: post
title: "Ask a Jedi: Setting up a home environment"
date: "2006-06-26T10:06:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2006/06/26/Ask-a-Jedi-Setting-up-a-home-environment
guid: 1355
---

Fernando had a large set of questions, all related to how best to set up a home environment. Let me start with his questions and then I'll respond.

<blockquote>
I would like to have a sense of what is the community using as far as tools and technologies at home.
I'm thinking of using CF7 developer edition and IIS ( my PC is a 2000 pro). Also JRUN, MySql as a database, and Eclipse with CFEclipse of course.

I don't know what to use as far as an admin tool for MySQL.

On the side I want to install PHP as well, but that's for different reasons.

Would you let us know what do
you use at home and pass this on your blog so we could know what other
developers have setup at their local environments?
</blockquote>

Fernando follow up this question with another one concerning source control. He said he is currently using CVS but heard SVN is better.

So - I have mentioned it before, but the absolute best guide in the world for setting up a dev environment is the <a href="http://www.stephencollins.org/acme/">ACME Guide</a> by Stephen Collins. I can't recommend it enough. It will get you start with ColdFusion, Apache, Eclipse, and MySQL. I believe he also briefly touches on Subversion. And yes, I do recommend it over CVS. I also recommend <a href="http://tortoisesvn.tigris.org/">Tortoise SVN</a> for a PC SVN client. I have yet to find a SVN client for the Mac. (Of course, I haven't looked yet.)

So in general, get the <a href="http://www.stephencollins.org/acme/">ACME Guide</a> and start with that. You will notice that it uses Apache instead of IIS, which I think is nicer for developers. At least until Microsoft decides to allow the non-Server OS the ability to use virtual hosts. (Without hacks I mean.) I almost always recommend you keep your dev environment exactly the same as your live environment, but I don't follow that advice myself. My local environment uses Apache while my live box (for this blog, CFLib, etc) uses IIS.