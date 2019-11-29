---
layout: post
title: "BlogCFC Alpha 2 Launched"
date: "2005-09-22T19:09:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2005/09/22/BlogCFC-Alpha-2-Launched
guid: 797
---

Didn't I say <a href="http://ray.camdenfamily.com/index.cfm/2005/9/22/A-few-BlogCFC-Notes">something</a> about not having a new version for a while? I finished the second alpha today, which includes the improvements I mentioned in the earlier post, and trackback support. 

Trackback support comes from work that <a href="http://thinkingdev.com/blog/index.cfm">Dave Lobb</a> did for his blog. I'm not 100{% raw %}% satisfied with it yet, but thanks go to him for doing 99%{% endraw %} of the work. How do you use it? Well, if your blog system supports doing TB hits, you just hit my blog url at trackback.cfm, with a form post containing title, except,  your blog_name, and the URL of the entry. The form post should have a query string that equals the ID of the entry you are hitting. If you don't have a system that lets you TB other blogs, you can click on the Trackback links on the entry and add it manually. The response from this is XML and not user friendly, so I'll be changing that. 

If you are the admin and are linking to another blog, you can click on the Trackbacks link to hit that other blog. The form appears <i>below</i> the form the site visitors see. It's hidden though for people who are not logged in.

So... as I said, I'm not 100% happy with it - but luckily it won't take much for me to get it just right for me. (Sorry Dave, I'm super-particular about my code. ;)