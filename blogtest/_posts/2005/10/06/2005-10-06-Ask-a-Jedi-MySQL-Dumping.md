---
layout: post
title: "Ask a Jedi: MySQL Dumping"
date: "2005-10-06T13:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/06/Ask-a-Jedi-MySQL-Dumping
guid: 833
---

A user asks:

<blockquote>
I perform nightly site maintenance via the scheduler, but before I delete any db rows I'd like to email myself a mysql dump as a flat file for backup. How can I do this?
</blockquote>

So, let me preface my answer by saying I'm no MySQL expert. I've used MySQL for one client, and outside of that, I just use it for testing of my various applications. That being said, I have done something similar for a client before. The client wanted a nightly backup of the data. All the info in database X would be copied to database Y. I did it using this script:

<code>
mysqldump -u x -pPASSWORD foo &gt; foo.sql
mysqladmin -u x -pPASSWORD -f drop foo_auditor
mysqladmin -u x -pPASSWORD create foo_auditor
mysql -u x -pPASSWORD foo_auditor &lt; foo.sql 
</code>

As I said, I'm no expert, so there may be a simpler way. That being said, the only thing you care about is line one. That line uses the mysqldump command to dump the database, in this case foo, to a SQL file. You should be able to run this command via <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000243.htm">CFEXECUTE</a>. You would then use cffile to read in the file and mail it to yourself. Or attach the file to a mail.