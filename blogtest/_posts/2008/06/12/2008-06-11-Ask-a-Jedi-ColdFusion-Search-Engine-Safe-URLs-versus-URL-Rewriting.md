---
layout: post
title: "Ask a Jedi: ColdFusion Search Engine Safe URLs versus URL Rewriting"
date: "2008-06-12T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/12/Ask-a-Jedi-ColdFusion-Search-Engine-Safe-URLs-versus-URL-Rewriting
guid: 2877
---

Dan the Man asks:

<blockquote>
<p>
s there any advantage to using the CF SEF URL's versus
just doing a mod_rewrite in apache?

I've used various forms of mod_rewrite in the past, and I prefer not having a period in the middle of the URL, however,
I'm wondering if there are any advantages that I'm missing out on.

I'm currently using the following for my mod_rewrite:

[deletia]

This results in "www.website.com/page/url/param" being translated to "www.website.com/page.cfm?id=url/param".  It also checks to make sure that a real directory or file doesn't exist before writing the subdirectory to the URL parameter.
</p>
</blockquote>

So the short answer is that I think using the web server's SES facilities will give you more power than trying to do it in ColdFusion. But let's look at some pros and cons.
<!--more-->
If you decide to use ColdFusion for SES URLs, then the main advantage is that can remove one more dependency for your application. SES URLs are built into Apache, but for IIS you have to use a plugin, and even then you still have one more thing to manage. Now this is <b>not</b> really a big deal, but if you are building software to sell, or open source work, then it matters since you have to both document it and support it. 

If you use the web server, you get the benefit of using code that was expressly written for that purpose. Your ColdFusion code gets simpler as well since you don't have to worry about handling it all. You can also get more fancy with your URLs. If you look at <a href="http://www.cflib.org">CFLib</a> you will notice no .cfm or url parameters anywhere in sight. This wouldn't be possible (as far as I know) with just ColdFusion itself.