---
layout: post
title: "Canvas ColdFusion Wiki Updated"
date: "2005-12-19T18:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/19/Canvas-ColdFusion-Wiki-Updated
guid: 980
---

I've updated <a href="http://ray.camdenfamily.com/projects/canvas">Canvas ColdFusion Wiki</a> tonight. These changes reflect the feedback from my users, specifically <a href="http://www.brooks-bilson.com/blogs/rob/">Rob Brooks-Bilson</a>, <a href="http://www.doughughes.net/">Doug Hughes</a>, and <a href="http://www.corfield.org/blog/index.cfm?">Sean Corfield</a>. So what was changed?

<ul>
<li>Layout was 100% pure CSS. It's not partially table-based. I feel real bad about that, but I'll get over it. It was causing some errors with IE and frankly I'd rather spend more time on the server-side stuff.
<li>Fixed a few case issues with createObject. 
<li>PageRender had some big updates. First off, my use of _ and + for italics and bold caused issues when those values were in URLs. I tried like hell to find a good solution, but simple couldn't. Someone suggested [b] and [i], and that worked great. I'm not happy with the extra typing, but it worked.
<li>Added support for headings and code blocks. This is from Doug Hughes.
<li>And a few other small fixes.
</ul>

Enjoy. Someone kick me if I don't get a demo site up by the end of the year.