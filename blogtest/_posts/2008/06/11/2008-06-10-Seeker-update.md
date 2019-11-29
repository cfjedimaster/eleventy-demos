---
layout: post
title: "Seeker update"
date: "2008-06-11T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/11/Seeker-update
guid: 2874
---

Last night I released an update to <a href="http://seeker.riaforge.org">Seeker</a>, my ColdFusion Lucene wrapper. A user, Casey, of <a href="http://www.dealtree.com">Dealtree.com</a>, contacted me about a possible speed improvement to help with larger indexes. I tried his suggestion, and now the search API should be a bit quicker. I also added support for pagination (you can get from N to M results) and metadata results (how many matches exist). Lastly, there is an optimize custom tag now as well.

What may interest folks, especially those who don't like the size limitation of the Verity engine bundled in ColdFusion, is the size of Casey's collection. Would you believe he had 25 million records? Is being able to support a 25 million record index something that may be useful to folks? Oh, and the speed is pretty darn nice too. To search those 25,000,000 records, it takes approximately 250ms to 1s. Not bad I'd say. (Although to be clear, all the credit goes to the kick butt Lucene engine.)