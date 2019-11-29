---
layout: post
title: "Doozy of a bug to watch out for - ColdFusion ORM, logging, and TailView"
date: "2010-12-01T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/12/01/Doozy-of-a-bug-to-watch-out-for-ColdFusion-ORM-logging-and-TailView
guid: 4033
---

Wow, so this one came out of left field. Earlier this week I looked into playing with secondary caching in ORM. I've only scratched the surface of this yet, but I'm amazed at how easy it is to use and how quickly it can begin to increase your performance. I'll try to gather some URLs later but that's not the point of my post here. While testing my site changes I it suddenly stopped responding. I could hit CFMs outside of my site and the CF Admin just fine. But any request for my site just hung. I restarted ColdFusion but it didn't help. Finally I did a complete machine restart and it worked - but only for a few requests. At this point I did what everyone should do - hit up the Server Monitor. I confirmed that my requests were hanging and confirmed in the stack trace that they were stuck on an ORM related function. Next I went to the Snapshots tab and generated a snapshot. The snapshot was large... and pretty much 100% incomprehensible. Luckily I've got smart friends.
<!--more-->
A lot of people responded to my call for help, but <a href="http://petefreitag.com/">Pete Freitag</a> noticed something logging related in the snapshot. I had ORM logging turned on so I decided the first thing I'd try disabling that feature... but before I did so I decided to try something else. I'm a huge fan of TailView within ColdFusion Builder. I use logging as a low-fi/quickie way of debugging and TailView makes it easy to monitor those files. On a whim I just shut down ColdFusion Builder while I had an open, not-responding, request for my ORM site. <b>Bam!</b> The second ColdFusion Builder closed my site responded. (Oh, and I'm not trying to hide what the site was - if folks are curious if was my local copy of <a href="http://groups.adobe.com">Adobe Groups</a>.) I restarted ColdFusion Builder and confirmed my site locked up again. I tried closing the tab just for the log file and it didn't work. It seems as if once CFB locked the file it locked it for good.

I've logged a bug for this - and I'm not sure anyone else will run into it - but if you use TailView be on the lookout. If I get more feedback on the issue from Adobe, or others, I'll post a comment.

Once again - I'm damn lucky to have smart friends. Thanks to everyone who responded to my call (and forgive me for being lazy and not doing links for you all): Pete Freitag, Charlie Arehart, Mike Brunt, Aaron West, Bob Silverberg, Dan Vega, Mark Mandel (actually I shouldn't list him since he made a smart ass remark about me using the 'real' tail command in linux ;), Dave Ferguson, Marc Esher, Curt Gratz.