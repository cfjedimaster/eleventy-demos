---
layout: post
title: "Advanced Contest Announced!"
date: "2006-02-22T17:02:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2006/02/22/Advanced-Contest-Announced
guid: 1118
---

After the successful run of the <a href="http://ray.camdenfamily.com/index.cfm/2005/9/20/Contest-Shall-We-Play-a-Game">beginner</a> and <a href="http://ray.camdenfamily.com/index.cfm/2005/10/30/Intermediate-ColdFusion-Contest">intermediate</a> ColdFusion contests, I'm happy to announce the Advanced ColdFusion Contest. This contest begins today, and will run until the end of March. So what's the contest?
The previous two contests were fun - they both involved games. This time, however, I really wanted to help the community. (Or lead an effort to help the community.) Yes the code reviews were helpful - but I wanted the <i>result</i> of this contest to be of use to ColdFusion developers. With that in mind, I took a look at a tool that I use almost every day, but that I think can be improved: the ColdFusion Administrator Log Viewer. 
First - there is no real good way to aggregate information from the logs. So for example, one application may have quite a few instances of a certain type of bug. Right now there is no easy way to determine this. You can do a search filter and count - but that isn't very intuitive. I'd like to see a log viewer that can also summarize information and give me reports. So with that in mind, here are the guidelines:
<ul>
<li>There are two main uses for this new tool. The first is viewing log information. Right now you are limited to a certain number of rows per page. Perhaps your tool will let the user output more rows at a time. Filtering works - but could be easier to use, and inline (i.e., drop the popup). The tool should work in with log file viewing in the ColdFusion administrator <b>where the type is CFML</b>. It need not work in logs marked Other. 
<li>The second use is aggregation, or reporting, of logs. This could give you reports on the number of errors, types of errors, application with most bugs, etc. Perhaps even giving a list of templates throwing the same error. Graphs are always nice. (Think of the administrator who may not be very technical. Graphs could quickly give a non-technical person a simple overview of their system.) You can require a DSN for your application in order to store processed information. However - you may only use Access, SQL Server, or MySQL. (You may support more, of course, but I will only test in those environments.)
<li>Your tool must work within the ColdFusion Administrator. All that means is that you should use the extensionscustom.cfm file. 
</ul>
Now for the kicker: All entries must be built using Flex 2 Builder. I know - not all of you have had a chance to play with Flex 2 yet. I strongly believe Flex 2 is the best tool out there for building a rich Internet application. Flex 1 was great - but Flex 2 is even better. If you haven't had a chance to play with it yet, this is your perfect opportunity. Beta 1 was just released and it is the perfect time to jump in and learn the new platform. You do not need to use Flex Enterprise Services or the Charting Components, but both could be very powerful in your application. 
Next - all entries must be open source. You can choose the license that works best for you - but at the end of day, I want to see something people can download and use in their Administrator. You do <b>not</b> have to maintain the code. Trust me - I know how difficult it is to maintain software projects, even simple ColdFusion ones. If you do - more power to you - and the community will love you. If you just want to release and walk away, that's fine as well.
This contest is marked as "Advanced", but anyone is welcome to enter. What do you get for your time if you win? Lots and lots of good stuff!
<ul>
<li>One copy of Studio (Thanks Adobe!)
<li>One free pass to <a href="http://www.cfunited.com">CFUnited!</a> (Thanks Terratech!)
<li>One free copy of KTML 4 (when released) (Thanks Interakt!) (And yes, I know there are other, free, HTML editors. But I love KTML. It's the bee's knees.)
<li>One more additional prize that I have to wait for a last clarification on.
</ul>
This is quite a few prizes, so please take a moment to visit the sponsors. They all graciously provided the prizes. Contest entries should be emailed to ray@camdenfamily.com.

<b>Edited:</b> The last prize is a copy of the new, and <i>very</i> cool Flex Builder. Obviously Adobe can't send you this till it is released.