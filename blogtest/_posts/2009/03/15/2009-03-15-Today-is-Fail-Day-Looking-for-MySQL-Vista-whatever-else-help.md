---
layout: post
title: "Today is Fail Day... (Looking for MySQL, Vista, whatever else help)"
date: "2009-03-15T15:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2009/03/15/Today-is-Fail-Day-Looking-for-MySQL-Vista-whatever-else-help
guid: 3277
---

So my move to a new server hit a major road block. As of this morning I had migrated some smaller sites, ColdFusionBloggers, CFCookbook, to a new VPS running IIS7 under Windows Datacenter Server 2008. Everything was fine. Of the sites I moved, CFB was definitely the "big guy" getting the most traffic and doing the most intense work (RSS parsing). This morning I moved a few more small sites. No problem at all. Then I pushed my luck and moved my blog. My blog, like most of my sites, had used SQL Server. I've been using the MySQL Migration Tool to suck in the data which seemed to work fine.

After my blog started to serve from the new machine, something went crazy. I saw the CPU was pegged at 100{% raw %}% and assumed it was jrun. Nope, it was mysqld. I thought maybe my blog data wasn't... meshing right with MySQL so I shut the blog down and restarted CF and MySQL. No go. I've now dropped the blog db from MySQL, moved the blog DSN back to the old server, and I still can't get MySQL to work right. Within 30 seconds MySQL will peg out. I even rebooted. The MySQL Admin reports nothing unusual. When I view traffic it is next to nothing (10%{% endraw %} busy, 2 queries, etc), but its acting diseased now.

Of all the sites on the new box, the big one down is CFB, so sorry folks but the aggregation is gone for now. It <i>always</i> used MySQL though so nothing could have gone wrong with the import there.

Any ideas for what could have gone wrong here?

<b>Edit:</b> Oddly, things seem a bit better. I ran through the instance config wizard (Andy Sandefer suggested it) and noticed it was setup as a Developer machine, so I switched it to Server setup. I turned back on CFBloggers.org and the CPU did not spike. I guess I'll just stand back and give it a few hours. I _need_ to walk away from this. I'll worry about my blog tomorrow.