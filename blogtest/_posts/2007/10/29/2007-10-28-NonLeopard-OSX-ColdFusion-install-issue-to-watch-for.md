---
layout: post
title: "Non-Leopard OSX ColdFusion install issue to watch for"
date: "2007-10-29T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/29/NonLeopard-OSX-ColdFusion-install-issue-to-watch-for
guid: 2440
---

I didn't discover this - but it was reported to me by a friend and former coworker, <a href="http://www.venturegeek.com/">Nathan Dintenfass</a>. I'm copying his findings here verbatim:

<blockquote>
<p>
I was trying to install CF8 on a new MacBook Pro, and I kept getting an error that said "installer user interface mode not supported".  I tried updating my java VM, but no dice.  Turns out the issue is that the installer app was in a folder containing a "!", and that special character in the path prevented it from loading. Once I moved the installer to a path without a special character it worked.
</p>
</blockquote>

Interesting! I can't imagine ever naming a folder like that though. Anyone else run into this?