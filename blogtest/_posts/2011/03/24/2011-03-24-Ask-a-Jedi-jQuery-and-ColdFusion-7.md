---
layout: post
title: "Ask a Jedi: jQuery and ColdFusion 7"
date: "2011-03-24T17:03:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2011/03/24/Ask-a-Jedi-jQuery-and-ColdFusion-7
guid: 4169
---

Sue asks:

<blockquote>
Already a fan of yours, but I'm hoping to become a JQuery fan as well...I still have CF MX7; can I use JQuery?

Am I missing something, because although I read your (and other) articles/blogs/posts, I can't readily tell what version of CF is being used. Therefore, I get high hopes that I can do something only to discover way too late that the example was done using CF8 or CF9.

Is there a cheatsheet of sorts that tells what version of CF supports what?
</blockquote>

You've got a couple of things going on here but I'll answer the first question right away - Yes - you can definitely use jQuery with ColdFusion 7. Let me talk a bit about what you're missing though.
<!--more-->
ColdFusion 8 added the ability to call a CFC via HTTP and get JSON back. Before that you could only get WDDX or XML. And yes, WDDX <i>is</i> XML, but what I mean is, you either get an WDDX version of your CFML data or you were able to return a pure XML string. This was only possibly in CF7. In CF6, you got WDDX. Period. 

However, you can easily generate JSON yourself. <a href="http://jsonutil.riaforge.org/">JSONUtil</a>, from Nathan Mische, is available for free from RIAForge and has ColdFusion 7 as being supported. You would point your jQuery templates (the ones that need to do Ajax stuff of course, just because you use jQuery does <b>not</b> mean you are doing Ajax requests) to a CFM that served up your JSON instead of directly pointing to a CFC. Does that mean you can't use CFCs? Of course not. Your CFM could easily call the CFC to do the fancy business logic and then handle outputting the result in JSON itself.

So - what about your second point - blog examples that are CF8/9 only. Speaking only for myself, I tend to always use the latest/greatest syntax. I recognize my readers can't always upgrade to the latest version right away. If asked about a specific feature, I definitely don't mind explaining how something could be done in CF#Current-1#. Just ask. :)

And finally - how do you know what was added when? I've got a blog post on that: <a href="http://www.raymondcamden.com/index.cfm/2009/11/4/Checking-for-updates-to-tagsfunctions-in-ColdFusion-9">Checking for updates to tags/functions in ColdFusion 9</a>