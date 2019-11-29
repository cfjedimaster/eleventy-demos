---
layout: post
title: "Knowing when to call it a day..."
date: "2007-07-13T13:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/07/13/Knowing-when-to-call-it-a-day
guid: 2193
---

Have you ever spent a day where you worked so hard that by 2 or 3 - you just <i>knew</i> that your productive output was done. That it was time to just give it up for the day and return fresh tomorrow?

How about a day when you hit that at - oh - let's say 8 o'clock?

This morning I was working on a file named test3.cfm. Every time I'd hit it though the data from test2.cfm would load. This was a PDF so it was pretty confusing. I tried to hit test.cfm and the same happened. I thought - maybe something is cached, but I saw the same problem in multiple browsers. I restarted ColdFusion, OS X, nothing worked. To make matters worse, files in subdirectories work fine.

Now we <b>all</b> know what I should have checked - the Application.cfc file, and I did.... quickly, but didn't see anything odd in onError or onRequest start.

I even reinstalled ColdFusion! Which luckily takes about 45 seconds now with ColdFusion 8.

Finally I thought it would make sense to take one more quick look at my Application.cfc file. Guess what I saw?

Outside of all the methods, right above the closing cfcomponent tag, was:

<code>
&lt;cfinclude template="test2.cfm"&gt;
</code>

My eyes just... never saw it I guess since it wasn't in a method. Why did I have that code there? I had done a test a few days ago to see what would happen if you did an include outside of any method in an Application.cfc. In case folks are curious (and if you haven't figured it out now) it runs on every request. 

-sigh-

In my defense, I had been working on test2.cfm the last few days and had never even ran another file. Of course, it could also be the case of beer I helped take care of last night. (Nah. That couldn't be it.)