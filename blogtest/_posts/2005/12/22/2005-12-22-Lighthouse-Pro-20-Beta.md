---
layout: post
title: "Lighthouse Pro 2.0 Beta"
date: "2005-12-22T18:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/22/Lighthouse-Pro-20-Beta
guid: 989
---

So <a href="http://ray.camdenfamily.com/index.cfm/2005/12/21/Question-for-Lighthouse-Pro-Users">yesterday</a> I blogged about the possibility of removing the Flash Forms from <a href="http://ray.camdenfamily.com/projects/lhp">Lighthouse Pro</a>, my ColdFusion bug tracking application. I worked on it last night, and this morning, and I think I've wrapped it up. I haven't replace the official zip yet (nor have I updated the docs or changed the version number in the screen), but if you want to see the 2.0 version, you can download it <a href="http://ray.camdenfamily.com/downloads/lighthouseprobeta.zip">here</a>. What has changed?

<ul>
<li>Well obviously the Flash Forms are all gone. I found the application to be a lot more... 'springy' in use. So I think it was the right call. It still requires CFMX7 though, due to it's use of Application.cfc and isValid. One could probably change that in about 30 minutes though.
<li>Quick Stats on login. You immidiately see an overview of the bugs assigned to you.
<li>You (the admin) can now subscribe users to projects. I used to hate telling my user to logon and subscribe. Now I can just force them to get the emails. 
<li>Layout is now table based. This fixes a bug in IE. Sorry, I'm not a CSS guru. I took the easy way out to fix a layout bug so I could focus on the server-side stuff.
<li>My favorite change - if you modify the filters to show open only bugs, click to edit, then save, when you return to the project, the filters remain as they were. You can also bookmark the project view.
<li>I'm sure I'm forgetting a few things here and there, but take it for a spin and let me know what you think.
</ul>

Today's build was once again wrapped up while listening to Depeche Mode.