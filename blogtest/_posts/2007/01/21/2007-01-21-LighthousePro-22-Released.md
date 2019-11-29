---
layout: post
title: "LighthousePro 2.2 Released"
date: "2007-01-21T19:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/01/21/LighthousePro-22-Released
guid: 1785
---

Today I put the finishing touches on <a href="http://lighthousepro.riaforge.org/">Lighthouse 2.2</a>, my ColdFusion based bug tracker. It was more fun that watching my Saints lose. (Although they did try very hard!) Changes in this version include:
<!--more-->
<ul>
<li>First off - many changes were done by Qasim Rasheed. Thanks Qasim!
<li>Support for Oracle. This was done by renaming the tables to not conflict with Oracle. There isn't a install script yet, but you should be able to copy the structure from SQL Server and run it just fine on Oracle. (Thanks Qasim.)
<li>You can supply a username/password for your dsn. (Thanks Qasim.)
<li>Improvements to how CFCs are passed around. (Thanks Qasim.)
<li>Issue Types are now editable. In the past your issues were one of two types: Bug or Enhancement. Now you can make as many issue types as you want. 
<li>Slight changes to the PDF creation. You now get a properly named file and the display is a tiny bit different.
<li>LighthousePro is now cooking with AJAX, baby! Spry specifically. This will be especially useful for projects with large numbers of issues.
</ul>

You can download the <a href="http://lighthousepro.riaforge.org">latest version</a> from RIAForge (which is also going to have a nice update later this week). 

The next version of LighthousePro will have integrated email checking. You will be able to point a project to a mail server account and then have it automatically create bug reports based on mails sent to the account. This lets you "open up" LHP to the world by simply creating an email address for your bug reports.

As always, LHP is free. If you find it useful, please visit my <a href="http://www.amazon.com/o/registry/2TCL1D08EZEYE">wish list</a>.