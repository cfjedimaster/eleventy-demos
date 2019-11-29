---
layout: post
title: "BlogCFC Update"
date: "2005-11-14T15:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/14/BlogCFC-Update
guid: 915
---

A small update, but with one important fix. Here are the changes:

<ul>
<li>/client/index.cfm: Two fixes to allow title to work right on single entry pages
<li>/client/editor.cfm: fix with &lt;more/&gt; issue. You are no longer allowed to have &lt;more/&gt; in the beginning.
<li>/org/camden/blog/blog.cfc: Two case issues with mysql
<li>/client/stats.cfm: ditto above
</ul>

Thanks to Steven Erat for pointing out some of those bugs, and helping me get my local CF server running again after I switched to JRun. (I must never do that again. -shudder-) Also thanks to Jacob Munson for a few finds as well.

As always, you can download BlogCFC from the <a href="http://ray.camdenfamily.com/projects/blogcfc">project page</a>. I did <b>not</b> update the version number. I'll probably wait until a new feature is added before changing the version.