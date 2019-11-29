---
layout: post
title: "Galleon ColdFusion Forums Updated"
date: "2005-10-06T15:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/06/Galleon-ColdFusion-Forums-Updated
guid: 834
---

I fixed a bug in Galleon today. It was a major bug in subscriptions which basically made them not work at all. Want to know what I did? When you added a subscription, the code checked to ensure that you had not subscribed already. However, the query didn't check for <b>your</b> user id, so if anyone had subscribed to that resource, no one else could subscribe. -sigh-

I also changed the Login link in the top nav to remember where you were in the site.

I still haven't added the BlueDragon fix. Completely forgot. Check the archives for how to add it though.

You may download Galleon, or see a demo, in the My Tools pod to the right.