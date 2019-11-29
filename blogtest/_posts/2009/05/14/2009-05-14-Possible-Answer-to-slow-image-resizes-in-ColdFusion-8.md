---
layout: post
title: "(Possible?) Answer to slow image resizes in ColdFusion 8"
date: "2009-05-14T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/05/14/Possible-Answer-to-slow-image-resizes-in-ColdFusion-8
guid: 3354
---

For a while now I've seen an odd issue with image resizing on the Mac (and then Windows as well). Sometimes when I would resize an image, it would take an extremely long time to finish. I'm not talking about <i>expected</i> slowness for a large image/high quality resize. I'm talking about some images take a few seconds, and others taking well over 2 minutes while my CPU went thermonuclear.

This was <i>very</i> hard to reproduce, although I had one image by <a href="http://www.talkingtree.com/blog/">Steven Erat</a> that seemed to be pretty consistently 'bad' in terms of tripping up this issue.

Other people have not always been able to reproduce this. I know  <a href="http://www.web-relevant.com/blogs/cfobjective/index.cfm">Jared</a> has seen it, but I'm not sure many other people. RIAForge seemed to suffer from it for all images when doing screenshots. 

So anyway, it was a very odd issue and that was hard to test. I spoke to Adobe engineering this morning and they pointed out that it was a confirmed bug in the 1.5 JDK. I switched my ColdFusion to use 1.6 and at first it didn't help. I did a quick check and saw that I was at: build 1.6.0_07-b06-153

I went to Apple's Java downloads, grabbed the latest update, and went up to 1.6.0_13. After restarting ColdFusion, the previous resize which had taken around 48 seconds went down to 800ms.

Hope this helps others.