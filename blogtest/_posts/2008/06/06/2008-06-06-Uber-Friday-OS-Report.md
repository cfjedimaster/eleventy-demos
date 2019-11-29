---
layout: post
title: "Uber Friday OS Report"
date: "2008-06-06T15:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/06/Uber-Friday-OS-Report
guid: 2867
---

I like the word Uber. Anyway, a bunch of updates today.

<ul>
<li><a href="http://seeker.riaforge.org">Seeker</a> was updated to include the Admin console. This now lets you list Lucene indexes as well as perform searches. You can also optimize and delete. ToDo: Form to add/index a new index. (Also ToDo are the things I mentioned before.)
<li><a href="http://blogcfc.riaforge.org">BlogCFC</a> was updated with the latest <a href="http://coldfish.riaforge.org">ColdFish</a> which should fix the CF6/7 issues. 
<li><a href="http://galleon.riaforge.org">Galleon</a> had a small update to the emails sent out to users.
<li><a href="http://www.riaforge.org">RIAForge</a>. What to say? As you guys know, it has been suffering lately. A lot of folks have given advice, and I thank you. I removed the web SVN browser and it seems to have helped a lot. This does <b>not</b> impact the SVN server at all. Project owners can still use SVN. I just removed the web interface to browse SVN. The next issue I had was with MySQL. I was getting a max connection error. Again, multiple gurus stepped in to offer advice. I set a max connection limit in each of the DSNs on the box. So far, both of these changes <i>seem</i> to have helped quite a bit. Of course, it will probably go ape-youknowwhat while I'm at <a href="http://www.cfunited.com">CFUNITED</a>, but I'm hoping for the best.
</ul>

Any questions, let me know.