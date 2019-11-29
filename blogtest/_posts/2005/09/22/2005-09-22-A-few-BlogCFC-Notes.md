---
layout: post
title: "A few BlogCFC Notes"
date: "2005-09-22T13:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/22/A-few-BlogCFC-Notes
guid: 795
---

A few notes in no particular order...

Leif Wells discovered a new bug last night. BlogCFC allows you to create blog entries in the future. This allows you to auto-public entries at a later time. However, my caching system caches from the current time till midnight. This means there is a strong chance your post-dated entry will simply not show up. There are a few things you can do to fix this. Either disable caching completely, or change the cache to last for one hour. I think disabling the cache completely would be fine, as BlogCFC <i>shouldn't</i> be slow. To disable the cache, just find the scopecache call and change the variable disabled in the attributes to a hard coded true value.

I know that people are still getting "ugly" code when I do code in my posts. I have a solution for that in the BlogCFC 4.0 Alpha. In the past, we would change code blocks before you saved the entry. I did this for speed. However, Ben pointed out that it means you can't return to the original code. This is a problem in editing for example. So, I've moved the "code display" handling to a new method in the blog.cfc called render. I've moved the color coding to the utils CFC. Also, when I send out email now, I remove the code tags, but keep the code in there. It should look a lot nicer. To be clear, this is <b>not</b> done on my blog right now. I'm waiting till I finish the next rev of the 4.0 alpha before I update my code here.

So what's the status of 4.0? You may have noticed I slowed down a bit. I wanted to spend some time on Galleon. I'm also working on a new DRK application for Macromedia. It's possible you won't see a beta till after MAX. To be honest, I'd rather go slow and easy then quick since I want 4.0 to be a "gold" type release. (A release everyone will upgrade to quickly.) I did some more development work last night (see above) and trackbacks are now about 40% in.

As an FYI, I will be allowing folks to download the code once it reaches what I consider a beta level. If things go according to plan (I have a plan??) there will be one more alpha, and then the beta.

Oh, I forgot. So another bug I'm going to fix. Right now, if you start a blog entry and go idle, there is a chance you will get logged out while you are away. When you save your blog entry, it will be completely lost. Because of this, I actually write my bigger entries in OpenOffice now. When I don't, I get real paranoid. I will change the editor so that if you log out, your changes are not lost. You will simply relogin and your entry will be saved.