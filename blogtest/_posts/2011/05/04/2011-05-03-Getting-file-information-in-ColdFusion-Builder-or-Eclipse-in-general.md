---
layout: post
title: "Getting file information in ColdFusion Builder (or Eclipse in general)"
date: "2011-05-04T10:05:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2011/05/04/Getting-file-information-in-ColdFusion-Builder-or-Eclipse-in-general
guid: 4219
---

Jim asked:

<blockquote>
Hi Ray,

I'm a longtime reader (Deathclock.com anyone?), but today I'm finally asking a question of my own.

I'm trying to transition from CFStudio to CFBuilder2 - my workflow is remote and primarily FTP based. In Studio - and most other editors I've used - the file explorer  is split into two windows. One window for directory navigation and the other window to show the files contained in the directories.

So for a directory named /foo I might see several files in the file window:

bar.cfm
test.cfm
index.cfm

This is my question: how can I see the file attributes in CFBuilder2? Studio (and Dreamweaver I believe) shows the file size, type and date modified and makes it easy to sort by each.
</blockquote>
<!--more-->
The view you mentioned is probably the #1 thing that I missed when I transitioned from HomeSite++ to CFEclipse (and then CFBuilder) a few years ago. Like most things in Eclipse the answer is a bit complicated and fuzzy. First off - the closest thing you would have to that old view is the RDS File View. I don't use this view very often myself. (I make a heck of a lot of use of the RDS Dataview though.) Once you've defined an RDS server you can browse the file system on top and the files below:

<img src="https://static.raymondcamden.com/images/ScreenClip80.png" />

Unfortunately you can't actually sort the columns. They are clickable for sure, but not sortable. If someone files a bug report for that I'd gladly vote for it! 

If you just want to quickly get file information (size, last modified) and you <i>don't</i> make use of the RDS view, don't forget you can right click on a file in a Navigator project and select Properties:

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip81.png" />

You can also do this with the "File" view:

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip82.png" />

Hope this helps!