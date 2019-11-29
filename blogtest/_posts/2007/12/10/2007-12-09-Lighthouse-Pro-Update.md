---
layout: post
title: "Lighthouse Pro Update"
date: "2007-12-10T07:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/10/Lighthouse-Pro-Update
guid: 2526
---

Just a quick note to let folks know I released a minor update to <a href="http://lighthousepro.riaforge.org">Lighthouse Pro</a>. I don't normally bother even blogging about minor updates, but this one includes a feature that I've had on my person bug tracker for a few weeks now and I've really enjoyed it. When you enter a project and filter out the issues (ie, show issues that are open and belong to me), the tracker will store these in a cookie. When you return to the list, the filters automatically reapply. This is <i>darn</i> nice when going back and forth between the list view and the issue view. The cookie is only for one project, so it won't remember multiple project views, but it is better than nothing. 

For Spry users, you may want to take a look at <a href="http://lighthousepro.riaforge.org/index.cfm?event=page.svnview&path=&file=project{% raw %}%5Fview%{% endraw %}2Ecfm">project_view.cfm</a>. I use an observer on the dataset that runs after it has been loaded. This code checks the cookies and updates the dropdowns accordingly.