---
layout: post
title: "iPhone version of ColdFusionBloggers.org"
date: "2007-12-11T16:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/11/iPhone-version-of-ColdFusionBloggersorg
guid: 2531
---

The <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a> aggregator now automatically detects the iPhone browser and sends it to a special URL:

<a href="http://www.coldfusionbloggers.org/iphone.cfm">http://www.coldfusionbloggers.org/iphone.cfm</a>

This was done with some rather trivial code:

<code>
&lt;!--- detect iphone ---&gt;
&lt;cfif findNoCase("iphone", cgi.http_user_agent)&gt;
	&lt;cflocation url="iphone.cfm" addToken="false"&gt;
&lt;/cfif&gt;
</code>

Let me know if this breaks any non-iPhone users. Or - if you use some other mobile browser, feel free to add this to your bookmarks.