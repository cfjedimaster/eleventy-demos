---
layout: post
title: "What shouldn't you be doing in ColdFusion?"
date: "2007-09-24T14:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/24/What-shouldnt-you-be-doing-in-ColdFusion
guid: 2368
---

A few weeks ago I saw an interesting post on <a href="http://www.dzone.com">Dzone</a> about what you <i>shouldn't</i> do in Python. (See the article <a href="http://plope.com/Members/chrism/now_not_to_write_python">here</a>.) This got me thinking about what features/types of code/practices should be avoided in ColdFusion. 

Some are obvious - for example, not using deprecated code. Did you know that CFML Reference guide contains a list of deprecated code for both tags and functions? Also listed are obsolete tags and functions. These functions/tags won't work at all in ColdFusion 8. 

But what else would you add to this list? I do not want to turn this entry into a "bash CF" entry (obviously, I love ColdFusion!). If you don't like a feature, I don't want to hear about it as we all have features we don't like. But what things would you caution developers against? Or at least warn them? What tags/functions throw a red flag in your mind when you see the code. 

I'll go first, and these are in no particular order, and I won't even pretend to say I haven't done this in the past.

<ul>
<li>CFFILE - Before ColdFusion 8, the only way to read a file in was to read in the entire file. (Unless you used Java.) Any use of CFFILE to read a file where the file is dynamic should have some kind of sanity check to ensure you aren't reading in a two gig file. I'd extend this warning to <i>anything</i> that works on the file system. Will your code work if you leave Windows and go to a Linux system? Will your code handle missing files, paths, etc? 
<li>Not using the Database: If you ever see logic being done on query data (like adding, averaging, hiding rows based on some logic), you need to immediately check and see if that work can be done in the database instead.
<li>From the <a href="http://plope.com/Members/chrism/now_not_to_write_python">Python article</a> above, I'll ditto the recommendation to not leave gobs of commented out code in files. No decent developer should be without source control. There is no excuse. Period. (Will there be a day when bloggers can stop saying this?)
<li>Building UDFs for functions that already exist in ColdFusion. Ok, so I'm probably the only one affected by this - but I tend to see submissions to <a href="http://www.cflib.org">CFLib</a> that mimic things already built into CF. I see it from time to time on cf-talk as well. If you don't have time to read the entire docs - at least skim the reference manual and ensure you know what each tag and function <i>basically</i> does. 
<li>Misuse or unsafe use of CFTHREAD - I have a post on this coming up later this week - but CFTHREAD is a powerful and dangerous tool. Be sure, for example, that you don't blindly ignore errors in the thread.
<li>Bad error handling - Again a bit related to the Python article - but do not use try/catch to hide errors that should actually be exposed. I've actually seen entire pages written in try/catch. Scary.
<li>Caching as a bandaid. There are some cool ways to cache in ColdFusion. (See this <a href="http://www.raymondcamden.com/index.cfm/2006/7/19/Caching-options-in-ColdFusion">article</a>.) But caching should not be used to cover up bad code.
</ul>

Thoughts?