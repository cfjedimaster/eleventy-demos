---
layout: post
title: "\"My Database View\" ColdFusion Builder Extension"
date: "2011-10-09T18:10:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2011/10/09/My-Database-View-ColdFusion-Builder-Extension
guid: 4385
---

For a while now a small bug has impacted RDS dataviews in ColdFusion Builder. I love the built in data views in CF Builder, but this little bug has annoyed me for too long now.

<img src="https://static.raymondcamden.com/images/ScreenClip195.png" />

This bug, and a workaround, are discussed <a href="http://forums.adobe.com/thread/832568">here</a>, but in the meantime, I thought, why not just write a quick CFBuilder extension to get around it. So with that in mind, I wrote "My Databasie View." Once installed, you can right click on any table...

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip196.png" />

This will pop open this view...

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip197.png" />

At which point you can edit the SQL and do whatever you want. The display ain't great, but I never realized how much I used the RDS "Show Table Contents" feature until it stopped working reliably. 

You can download this at the RIAForge project I just set up for it - <a href="http://mydatabaseview.riaforge.org/">http://mydatabaseview.riaforge.org/</a>.