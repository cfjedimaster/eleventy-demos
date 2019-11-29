---
layout: post
title: "No, not ColdFusion 9, not BlogCFC 6, but new update to BlogCFC 5"
date: "2009-07-15T18:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/15/No-not-ColdFusion-9-not-BlogCFC-6-but-new-update-to-BlogCFC-5
guid: 3443
---

Forgive the quick repost - I added this to BlogCFC.com, but wanted to ensure it got the widest distribution so I had as many testers as possible.

Ok folks, today I checked into SVN a <b>major</b> update to BlogCFC. New features include:

<ul>
<li>A proper user manager. Yes, you can now add, edit, and delete users for your blog.
<li>Roles. Yes, you can now create users with restricted rules. I spent most of my time on the framework for this, and added a few default roles. I can expand the roles as people come back to me with suggestions.
</ul>

The roles allow you to:

<ul>
<li>Create users who can't edit other users.
<li>Create users who can't CRUD categories.
<li>Create users who can't add new categories.
<li>Create users who can't release, nor work with, released blog entries.
</ul>

Again, these are the roles I'm shipping with. They are hard coded but can be expanded over time. There is also an Admin role. Any user in the Admin role can always do anything. This way you don't have to worry about adding new roles to a super user.

Please download (SVN instructions are at the <a href="http://blogcfc.riaforge.org">RIAForge site</a>) and test. Please read the readme.txt file or you will DIE! (Ok, you might not die, but still....)