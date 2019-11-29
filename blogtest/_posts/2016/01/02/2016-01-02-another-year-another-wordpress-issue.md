---
layout: post
title: "Another year, another Wordpress issue"
date: "2016-01-02T16:28:28+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2016/01/02/another-year-another-wordpress-issue
guid: 7345
---

Thanks to a reader (thanks Theo!) I've discovered that there is a problem with the latest Wordpress install and my blog. If you try to access a URL and get an infinite redirection loop, please let me know. At the end - this is my fault. When I switched from my custom blog to Wordpress, the "pretty urls" were in a slightly different format than my old site. To fix this, I hacked up Wordpress itself, which I <i>know</i> was dumb, but I somehow managed to survive for a year and multiple WP updates without it ever coming to bite me in the ass - until 4.4 was released a few weeks ago. I didn't even know, but some URLs began infinitely redirecting on themselves. As far as I can tell, the issue is related to the hack I did, but oddly I can't find a consistent way to recreate it. I can fix it for one URL at a time by editing the post, which makes no sense to me. 

For now - my plan is to check my access log for URLs returning 301 and then fix them one by one - while also looking real hard at moving to a completely static solution so I can finally remove PHP/MySQL/NGINX from the equation and go to simple flat files.

Sigh.

Programming would be a lot easier without all the darn programs.