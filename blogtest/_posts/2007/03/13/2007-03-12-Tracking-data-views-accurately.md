---
layout: post
title: "Tracking data views accurately"
date: "2007-03-13T10:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/13/Tracking-data-views-accurately
guid: 1885
---

A user posted an interesting <a href="http://ray.camdenfamily.com/forums/messages.cfm?threadid=4BC348E3-D7F9-BF32-B2AB5FF22B84E764&#top">question</a> over on my forums that I thought I'd share with others. I answered there but I'd like to get other opinions as well. Here is the question:

<blockquote>
I'm in the process of building a forum system as a means of trying out new things. Just came across an issue I hadn't really thought about with view tracking - what would you suggest is the best way to keep track of thread views so a user hitting refresh repeatedly doesn't artificially inflate the numbers?

presumably a DB table storing the thread id, user id (if recorded), IP address and timestamp of the view is a start - but I'm not sure how you would maintain that table to prevent it getting unwieldy, and i guess you'd only want to store the latest visit for any given thread for a user.
</blockquote>
<!--more-->
So what I recommended was based on the changes I made to BlogCFC recently. Originally, my "Views" column for blog entries would go up every time you viewed a blog entry. You could sit there and reload all day long. (By the way, that issue still applies here, my own blog is a bit behind the released BlogCFC.) 

I added a simple session variable that created a structure of viewed pages. I used a structure since I wanted a simple way to store, and check, for pages you had viewed before.

When you view a page now, I check that structure, and if this is a new page for you, I log a view. If it isn't, I do not log a view. 

This was a rather simple fix, and it isn't perfect. BlogCFC simply <i>counts</i> views. It doesn't log them. So I can't say that Entry X got more views on Monday then it did on Tuesday. Another problem - someone could block the session cookies and artificially inflate the views for an entry. But I'm not building the Pentagon here - so I think it was a reasonable solution. 

So what have others done?