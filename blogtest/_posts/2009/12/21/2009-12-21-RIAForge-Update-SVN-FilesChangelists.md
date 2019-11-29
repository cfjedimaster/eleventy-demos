---
layout: post
title: "RIAForge Update - SVN Files/Changelists"
date: "2009-12-21T15:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2009/12/21/RIAForge-Update-SVN-FilesChangelists
guid: 3659
---

This weekend I worked on restoring and updating some functionality to <a href="http://www.riaforge.org">RIAForge</a>. RIAForge used to support the ability to browse SVN repositories via the site. It allowed you to browse the repo, view files, and examine the history. This was removed for a few reasons. Today I've restored the functionality and added the ability to view changelists as well. So for example:

<a href="http://fw1.riaforge.org/index.cfm?event=page.svnbrowse">Top level SVN repo for FW/1</a><br/>
<a href="http://fw1.riaforge.org/index.cfm?event=page.svnview&path=/trunk&file=Application.cfc">Code view for /trunk/Application.cfc</a><br/>
<a href="http://fw1.riaforge.org/index.cfm?event=page.svnhistory&file=Application.cfc&path=/trunk">History for Application.cfc</a><br/>
<a href="http://fw1.riaforge.org/index.cfm?event=page.svnchangelists">Changelists for FW/1</a><br/>
<a href="http://fw1.riaforge.org/index.cfm?event=page.svnchangelist&revision=94">Details for revision 94</a><br/>

This will work hand in hand with the SVN post-commit support I've got coming this week as well. As always, if you find a bug, please be sure to report it. 

Thanks go to Rob Gonda's for his original SVN work and <a href="http://www.corfield.org">Sean Corfield</a> for help in testing.