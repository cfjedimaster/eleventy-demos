---
layout: post
title: "Why aren't you using Trusted Cache?"
date: "2010-10-13T08:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/10/13/why-arent-you-using-trusted-cache
guid: 3969
---

Last night I was honored to give a presentation to the Capital Area CFUG. My presentation was a preview of my MAX topic, "Best Practices of the Modern CF Developer." During the presentation the topic of Trusted Cache came up and I was truly surprised to hear that next to no one was using this in production. 

While certainly not a silver bullet for performance issues, turning on the Trusted Cache (see screen shot below) can sometimes dramatically increase the performance of your site in <b>the one second it takes for you to check a box</b>. That's a huge win for little to no work on your part.

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-10-13 at 6.59.07 AM.png" />

Seriously - go to your production site, hit that box, and tell me if you don't see your site running significantly faster afterwards. There is no XML involved. No Server restart. Just a checkbox. 

Now - there is one small drawback. After you've done this, ColdFusion will no longer look at your CFML pages for changes. In order to tell ColdFusion to check a file again, you either have to a) hit the button below:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-10-13 at 7.00.53 AM.png" />

or b) make use of <a href="http://cacheclearer.riaforge.org/">CacheClearer</a>, a ColdFusion Admin extension that let's you specifically request a file or folder to be cleared.

So... why <i>aren't</i> more of you using this?