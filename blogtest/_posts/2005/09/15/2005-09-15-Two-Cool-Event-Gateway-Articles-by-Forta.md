---
layout: post
title: "Two Cool Event Gateway Articles by Forta"
date: "2005-09-15T18:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/15/Two-Cool-Event-Gateway-Articles-by-Forta
guid: 779
---

I don't normally waste an entry just pointing to another blog, but I thought I'd point out two cool entries by Ben Forta:

<a href="http://www.forta.com/blog/index.cfm?mode=e&entry=1737">Building an IM Bot - Part 1</a><br>
<a href="http://www.forta.com/blog/index.cfm?mode=e&entry=1738">Building an IM Bot - Part 2</a>

I read this articles and had a bot up and running in less than five minutes. The only problem is that there is one typo in part 2 of his article. Change this line:

&lt;cfset var originatorID=CFEvent.data.originatorID&gt;

to

&lt;cfset var originatorID=CFEvent.originatorID&gt;

I've registered "CFLibbot" and will be hooking up UDF lookup to it. I'm also considering hooking up <a href="http://www.rsswatcher.com">RSSWatcher.com</a> to it - so you can get notifications via IM instead of email.