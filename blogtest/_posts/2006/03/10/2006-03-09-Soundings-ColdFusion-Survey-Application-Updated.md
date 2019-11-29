---
layout: post
title: "Soundings ColdFusion Survey Application Updated"
date: "2006-03-10T09:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/10/Soundings-ColdFusion-Survey-Application-Updated
guid: 1144
---

I've updated Soundings, my ColdFusion Survey application. Changes include:

<ul>
<li>I know some (poor) people are unable to create mappings with their host. Soundings will now work without a mapping.
<li>Those same (poor) people may be with a host with limited datasources. You can now use the "tableprefix" property so that Soundings can live in another database. 
<li>My recent fix for CFMX7 charts broke compatibility with CFMX6. That should be fixed now.
<li>There was a bug with some charts being too short. I've given them all growth hormones and they are all now the same size. They are quite big... but I figured one size for all was fine. 
</ul>

Enjoy. As always, you can download the code from the <a href="http://ray.camdenfamily.com/projects/soundings">project page</a>. Today's build was brought to you by Ferry Corsten, best trance DJ I've ever heard.