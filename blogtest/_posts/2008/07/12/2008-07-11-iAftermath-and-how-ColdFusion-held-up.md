---
layout: post
title: "iAftermath - and how ColdFusion held up"
date: "2008-07-12T09:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/12/iAftermath-and-how-ColdFusion-held-up
guid: 2928
---

Yesterday I wrote a little <a href="http://www.raymondcamden.com/index.cfm/2008/7/11/So-far-iPhone-20-is-DOA">blog entry</a> on how the upgrade experience for my iPhone didn't go so well (by the way, it's all good now and I'll have another blog entry about the 2.0 firmware later today). Little did I know that a few other people were having issues with their upgrades as well. All of a sudden I began to get a regular flood of comment emails. I started watching the stats for the entry and couldn't believe what I was seeing.
<!--more-->
By lunch time, the blog entry had around 5000 views. The number of comments had surpassed the previous record holder (<a href="http://www.coldfusionjedi.com/index.cfm/2005/10/26/Call-to-BlogCFC-Users">Call to BlogCFC Users</a>). By the time my day ended, the views were around 15000, and the comment count had gone over 900. 

The entry ended up being my #5 entry with over 16,000 views. You can see how it compares to others entries on my <a href="http://www.coldfusionjedi.com/stats.cfm">stats</a> page. 

So how did ColdFusion hold up? Really well I think. Over the entire day I got about 10 error emails from the server. 9 of which were:

<blockquote>
<p>
[Macromedia][SQLServer JDBC Driver][SQLServer]Transaction (Process ID 72) was deadlocked on lock resources with another process and has been chosen as the deadlock victim. Rerun the transaction. 
</p>
</blockquote>

I read this as simply so much traffic going to SQL Server that it got a bit overwhelmed. I never saw this error on the site myself though, and again, it only fired a few times over the day.

The other error I saw occurred once:

<blockquote>
<p>
Element pod_archives is undefined in a CFML structure referenced as part of an expression.
</p>
</blockquote>

This was thrown by the scopecache tag, and I was a bit surprised by this. All I can guess is that the RAM based cache maybe got confused at some point under the load.

Although really - how big was the load? My views for the entry were around 15,000 last night, but the views count is a bit low compared to actual page count. A lot of folks were sitting there, reloading, posting new comments. I use the Session scope to remember which entries you have viewed, and I only increase the view count once per session. I checked Google Analytics this morning. Check out the spike:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 34.png">

Even with that spike though, my page views were only at 22,000. That's 660,000 page views per month. I used to run <a href="http://www.deathclock.com">DeathClock.com</a> on a shared host with ColdFusion 5 and get 4 million hits per month. Oh, and that was with <i>Access</i> as a database. (Because I was cheap!)

Anyway, it was certainly fun to watch and I'm happy that most of the 900+ folks commenting kept a somewhat civil tongue. I ended up being quoted on MSNBC as well, which was kinda cool:

<a href="http://www.msnbc.msn.com/id/25641886/from/ET/">The 'iPocalypse' is at hand</a>

Apparently I'm a technophile! I hope no one tells her I'm normally scared of hardware. (Mainly because I have big, clumsy hands, and I'm always afraid I'm going to snap a ram chip like a pretzel.)