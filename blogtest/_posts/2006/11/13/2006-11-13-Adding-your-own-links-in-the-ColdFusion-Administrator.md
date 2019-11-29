---
layout: post
title: "Adding your own links in the ColdFusion Administrator"
date: "2006-11-13T18:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/13/Adding-your-own-links-in-the-ColdFusion-Administrator
guid: 1652
---

I've mentioned this in a few blog entries before but haven't covered it by itself. Did you know that you add your own links in the ColdFusion Administrator? Create a new file in your CFIDE/Administrator folder with the name extensionscustom.cfm. (Note that it is extension<b>s</b>, not extension.) Inside this file add yours links and follow these rules:

<ul>
<li>Use the CSS class leftMenuLinkText
<li>Use the target, _content.
</ul>

I use this to link to custom tools like <a href="http://ray.camdenfamily.com/projects/spoolmail/">SpoolMail</a>. A more simpler example could be for shortcuts. Is there a log file you often check? Copy the link from the Log Files page and then add it to your file, like so:

<code>
&lt;a class="leftMenuLinkText" href="http://localhost/CFIDE/administrator/logviewer/searchlog.cfm?logfile=riaforge%2Elog&bRefresh=1" target="content"&gt;RIAForge Log&lt;/a&gt;&lt;br&gt;
</code>

In this example, I've added a link to my RIAForge Log file. This doesn't really save me a lot of clicks, but you get the idea.