---
layout: post
title: "RIAForge Updates"
date: "2009-12-14T22:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2009/12/14/RIAForge-Updates
guid: 3649
---

I'm happy to announce some pretty big updates to RIAForge. While this is mainly for project admins, I thought it made sense to blog about it as it may encourage other folks to give RIAForge a try next time they need a place to host their open source project.

Many months ago I added the concept of project admins. This was the ability for a project owner to assign other RIAForge users as project administrators. The idea being that they would help manage the project. Unfortunately when I set this up, I never really got past the first stage 'trial' test. Project admins could edit the main project page and create releases, but not really do anything else.

Tonight I made it so that project administrators can work with screen shots, edit the wiki, edit (and close!) issues, and edit blog entries. Basically they have the ability to do everything but edit the list of project admins themselves or modify SVN credentials. Oh, and they also get CCed on updated issues.

All in all - this should - I hope - really encourage multi-admin projects. We really need less projects being run by lone developers (and I put myself squarely in that category as well).

I also have another big update that may go live this week. I'm hesitant to say what it is in case it doesn't come through, but part of me feels like if I say it, I'll obliged to ensure it does happen. The update will be support for SVN/issue commit messages. This means you can do something like:

<blockquote>
<p>
I added a dang var statement so it fixes #29.
</p>
</blockquote>

Subversion will pick up the message, pass it to RIAForge, and RIAForge will then actually mark bug 29 fixed for you. No promises yet - but I'm working on it (which in reality means I asked a smart friend for help and I'm hoping he comes through!).