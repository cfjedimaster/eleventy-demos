---
layout: post
title: "Know WordPress? Need some advice."
date: "2015-01-14T05:50:53+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2015/01/14/know-wordpress-need-some-advice
guid: 5550
---

Ok, time to throw in the towel and ask for help. ;) After upgrading the virtual server this blog runs on to a better level of hardware (1.7 gigs of RAM versus 0.6), my uptime improved quite a bit. But I still get - a few times a week - the infamous "Error Establishing Database Connection" issue. I've got a monitor set up for it now so I can reboot quickly, but last night it happened about an hour and a half after I went to bed so it was down for hours.

I've Googled quite a bit but most of what I've found focuses on the issue happening immediately and focus on your authentication values for MySQL. Obviously that isn't the problem. Other items I found focus on using caching plugins to help with performance. I'm using WP Super Cache so I've already done that.

So - any ideas? All I can think of is to try to find out if MySQL isn't using as much RAM as it can. Maybe there is a setting where I can tweak that higher.