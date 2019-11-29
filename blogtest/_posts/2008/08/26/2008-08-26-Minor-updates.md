---
layout: post
title: "Minor updates"
date: "2008-08-26T22:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/26/Minor-updates
guid: 2989
---

Just a few minutes and a <a href="http://www.riaforge.org">RIAForge</a> update. First off, <a href="http://scopecache.riaforge.org">ScopeCache</a> was updated to support file based caching. That just means you can now cache to the file system and have it persist even more server restarts. The next change was to <a href="http://googlecal.riaforge.org">GoogleCal</a>. A user submitted a nice update to the addEntry code to better support all day events.

Tonight I took a look at RIAForge and wondered how hard it would be to add support for multiple admins in a project. I got it about 90% done. The system is rather simple. A project owner has the right to add any RIAForge user as an admin. She has to know the username, but that shouldn't be a problem since these are people you (hopefully) trust. The owner can add and delete these users at any time. The owner is the only one who can do this, so adding an admin to your project doesn't mean that you can be removed. 

The next thing to build then is support to let these admins do stuff with your project. I'm going to launch with just being able to edit the project details and screen shots. Then I'll move on to blogging, issue management, and wiki editing.