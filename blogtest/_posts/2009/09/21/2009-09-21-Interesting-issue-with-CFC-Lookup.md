---
layout: post
title: "Interesting issue with CFC Lookup"
date: "2009-09-21T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/21/Interesting-issue-with-CFC-Lookup
guid: 3535
---

I'm currently working on two Model-Glue projects that run on ColdFusion 9. One for Picard, on my Mac, and one for <a href="http://www.firstcomp.com">FirstComp</a>, where I'm doing some contracting with the team there. One thing I've run into with Model-Glue, ever since I began using it, is the magical "tipping point", the point where keeping reload set to true ends up adding too much time to the request. Typically this is a day or two into the project when I've got multiple controllers, lots of events, etc. I then turn off reloading and dedicate a tab in Firefox just to handle reloading the Model-Glue framework.
<!--more-->
What's killer about ColdFusion 9 though is that I never had to do this. Not with Picard at least. The project has grown quite a bit and it still screams. Every new version of ColdFusion was faster than the last, but by my purely unscientific testing ColdFusion 9 seems incredible. 

That is until I started a new Model-Glue project under Windows 7. At first it was ok. But all of a sudden it dramatically slowed down. I turned on debugging and discovered that the main culprit was the loadEventHandlers method of XMLModuleLoader. I did this by using a butt-load of cftrace and cftimer tags. I know I probably should have used the ColdFusion Debugger, but I'm just old school. I love to litter my debug with a few hundred messages and slowly narrow down the issue. 

Digging deeper into loadEventHandlers, I found that the slow portion was in the portion that handled event types. Part of the code tries to load a CFC for an event's type. Folks may not remember, but when Joe was creating Model-Glue 3, the first implementation of Event Types used CFCs. He changed it to use XML, but I guess he kept in the CFC code. I trace down the exact slow point to the code that tried to load the CFC. Model-Glue swallowed this error, but I found that each time it tried to load the CFC it took <b>8 seconds</b>. What the heck?!?!

I quickly whipped up this one liner:

<code>
&lt;cfset foo = createObject("component", "ddssd")&gt;
</code>

And confirmed that - by itself - this took 8 seconds for ColdFusion to run and throw an error on. Any ideas why yet? Well I remembered that ColdFusion <i>searches</i> for components when it can't find it in the same folder. I then checked my settings. I had a custom mapping and a custom custom tag path. I removed the custom mapping - no change. I removed the custom custom tag path - and <b>bam</b> - that was it. The folder in question had 8500 files of which 450 were CFCs. ColdFusion must have been spending all that time scanning that huge directory. 

So for me, the fix was to remove the additional custom tag path. But if I need to bring it back, I'll have to consider modifying Model-Glue to not bother trying to find the CFC for an event type.