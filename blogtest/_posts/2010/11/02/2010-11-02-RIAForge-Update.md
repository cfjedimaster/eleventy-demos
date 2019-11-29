---
layout: post
title: "RIAForge Update"
date: "2010-11-03T00:11:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/11/02/RIAForge-Update
guid: 3996
---

Just a quick note for <a href="http://www.riaforge.org">RIAForge</a> users. When searching, projects that have not been updated in over 180 days will be "dimmed". This is not meant to prevent users from clicking on them (you definitely still can), but rather to highlight projects that are more active. If your curious, I simply added an "old" class to them when printing out the results loaded via AJAX and used this CSS for opacity:

<code>
.old {
	opacity:0.3;filter:alpha(opacity=30);
}
</code>