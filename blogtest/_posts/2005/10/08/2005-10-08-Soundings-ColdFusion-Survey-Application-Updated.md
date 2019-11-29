---
layout: post
title: "Soundings ColdFusion Survey Application Updated"
date: "2005-10-08T16:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/08/Soundings-ColdFusion-Survey-Application-Updated
guid: 837
---

Soundings, my ColdFusion survey application, has been updated. You can download Soundings <a href="http://ray.camdenfamily.com/downloads/soundings.zip">here</a>. Changes are listed below:

<ul>
<li>Fixed the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/7/Soundings-Bug--Very-Important">nasty bug</a> I reported yesterday.
<li>Changed the display of questions a bit. Don't forget that if you don't like this, it is easy to change. Just modify the display handler for the questions.
<li>If you changed the admin password, logged out and returned, it wouldn't accept your new password. This is because the old one was cached. 
<li>I've finally added support for <b>Matrix</b> questions. There are the questions where you are asked to rank various items from 1-5, good to bad, etcetera. 
</ul>

That's it. The next release will focus on the reporting aspects of Soundings.