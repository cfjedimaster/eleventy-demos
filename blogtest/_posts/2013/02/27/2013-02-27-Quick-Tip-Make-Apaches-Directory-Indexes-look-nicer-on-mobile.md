---
layout: post
title: "Quick Tip - Make Apache's Directory Indexes look nicer on mobile"
date: "2013-02-27T15:02:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2013/02/27/Quick-Tip-Make-Apaches-Directory-Indexes-look-nicer-on-mobile
guid: 4868
---

If you use Apache, then you most likely have DirectoryIndex enabled on your development server. This is the feature that lets you request a directory without a home document and see a list of folders and files. This is <i>not</i> normally enabled in production, but in certain circumstances it may be. (For a file download directory perhaps.) If you do any testing with mobile devices though you will probably find this index to a be a bit hard to read. Here's an example.
<!--more-->
<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Feb 27, 2013 2.16.22 PM.png" />

You can pinch and zoom to make that a bit easier to read, but it's a pain in the rear. Turns out Apache has a few options that allow you to customize how this index file is created. One of them, <a href="http://httpd.apache.org/docs/2.2/mod/mod_autoindex.html#indexheadinsert">IndexHeaderInsert</a>, allows you to add HTML to the head section of the document. I added the following to my Apache httpd.conf file:

<script src="https://gist.github.com/cfjedimaster/5051337.js"></script>

And the result was exactly what I needed:

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Feb 27, 2013 2.16.28 PM.png" />

Hope this helps!