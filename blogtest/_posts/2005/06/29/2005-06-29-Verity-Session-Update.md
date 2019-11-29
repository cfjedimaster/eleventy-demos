---
layout: post
title: "Verity Session Update"
date: "2005-06-29T13:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/06/29/Verity-Session-Update
guid: 609
---

I was a bit... off... on the number of maximum documents per server with Verity. It's not 250k, but 125k for Enterprise. For CFMX standard the limit is 125k. For the develop edition, 10k. So I was only off by 125k or so.

Next - Tom Jordhal pointed this out to me. A person in the session asked if cfindex/cfsearch operations were safe if you used multiple instances of CFMX per box, all talking to the same collection. I said no. Actually, it is safe and can be done without cflock. It is a problem, however, if you have N boxes sharing the same collection with mapped network drives. Sorry about that folks!

I would also like to ask anyone who attended my session to give me any feedback you think is relevant. Feel free to post anonymously.

More later...

And no, my luggage still hasn't arrived.