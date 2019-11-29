---
layout: post
title: "Harlan ColdFusion Ad Server Updated"
date: "2006-01-27T17:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/27/Harlan-ColdFusion-Ad-Server-Updated
guid: 1065
---

Thanks to two cool finds by <a href="http://single-dads.us/">Critter</a>, I've got an important update to <a href="http://ray.camdenfamily.com/projects/harlan">Harlan ColdFusion Ad Server</a>. The updates are as follows:

<ul>
<li>The SQL Server file was updated - and I forgot to paste back in the INSERTs to put the default user in. Oops. Kinda makes it hard to logon with no user.</li>
<li>Big one here - Harlan spits out JavaScript that, in theory, will work on any other host. But the links I generated were relative links, not full links. That is fixed.</li>
</ul>

As always, you can download Harlan from the <a href="http://ray.camdenfamily.com/projects/harlan">project page</a>. Critter found these bugs, but he says you should go visit <a href="http://www.amazon.com/o/registry/2TCL1D08EZEYE">my wishlist</a>. I tried to convince him otherwise, but he wouldn't let me. (Sigh) Just kidding - again - thanks go to Critter for finding the issues.

<i>Today's build brought to you by the drum and base stylings of Pendulum. Played too loud. In the future they will have robotic ears so it won't matter.</i>

<b>Edited:</b> Critter found another host related issue - this time in the image url. The zip has been updated.