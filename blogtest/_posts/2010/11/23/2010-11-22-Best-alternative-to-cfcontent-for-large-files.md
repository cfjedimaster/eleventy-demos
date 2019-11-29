---
layout: post
title: "Best alternative to cfcontent for large files?"
date: "2010-11-23T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/11/23/Best-alternative-to-cfcontent-for-large-files
guid: 4025
---

Reader Paul pinged me with the following:

<blockquote>
Our main site uses cfcontent to fetch files, since we've decided to store the more sensitive ones outside of the web root.  This has been working famously so far, but our client use has really ballooned, as has their appetite for large files (we're talking pdfs upwards of 70Mbs).
<br/><br/>
The result as you may assume is much longer download times.  The network activity/bandwidth not a problem for our host.  The real issue seems to be the fact it turns these downloads into open threads.  During high-traffic times, it's not uncommon to see all 20 consumed, and worse, jrun overheated at 25% and hanging there.
<br/><br/>
Is there a better way to handle this kind of situation?  We're going to be moving to a beefier machine which may help somewhat, but even with huge pipes, users can only pull in a file so fast, so even with the possibility of more threads, logjams could persist.
</blockquote>

I only have one personal experience with this myself. A few years ago I did a job for a company that needed to serve up large files. Instead of using cfcontent I used symlinks (to be honest, 'symlink' may not be the proper technical term - think shortcut) to create an alias of the file under web root. These aliases were removed on a timed basis. But for a short time, in theory, the files were accessible if you knew the link. I helped reduce that risk by copying to a folder under web root that was created with a UUID. 

The other option I've heard mentioned recently is <a href="https://tn123.org/mod_xsendfile/">mod_xsendfil</a>, an Apache-only mod that allows you to simply output a header that allows Apache to serve up a file outside of web root. 

Does anyone have any better advice to offer Paul?