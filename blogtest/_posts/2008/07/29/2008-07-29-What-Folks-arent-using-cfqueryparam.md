---
layout: post
title: "What? Folks aren't using cfqueryparam?"
date: "2008-07-29T13:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/29/What-Folks-arent-using-cfqueryparam
guid: 2944
---

It seems that while I was gone there was some noise about CF and SQL Injection. I find this a bit surprising as I thought <i>everyone</i> was using cfqueryparam now, aren't they? In all seriousness, here are some few links to consider:

<ul>
<li><a href="http://www.codersrevolution.com/index.cfm/2008/7/24/Announcing-the-first-ever-International-Operation-cfSQLprotect">Announcing the first ever International Operation cf_SQLprotect</a>: I'm a few days late on this (let's see - Friday at this time I was downtown Austin), but Brad Wood decided that July 25th would be a good day to scan your code for sql vulnerabilities. While we should do this <b>constantly</b>, there is nothing wrong with doing it again, over your entire code base.
<li>Brad linked to <a href="http://qpscanner.riaforge.org/">QueryParam Scanner</a> by Peter Boughton.
<li>Brad also linked to Daryl Banttari's <a href="http://www.webapper.net/index.cfm/2008/7/22/ColdFusion-SQL-Injection">scanner</a>.
</ul>

Now all we need is a one stop var scope checker/queryparam checker in one tool.