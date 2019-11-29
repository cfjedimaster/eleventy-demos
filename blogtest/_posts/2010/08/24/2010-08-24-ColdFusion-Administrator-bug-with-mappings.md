---
layout: post
title: "ColdFusion Administrator bug with mappings"
date: "2010-08-24T15:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/08/24/ColdFusion-Administrator-bug-with-mappings
guid: 3922
---

Watch out for this one - I almost didn't notice it. Today I went to add a new mapping. It just so happened that the mapping I added was one that already existed. The administrator correctly noticed this and gave me an error:

<img src="https://static.raymondcamden.com/images/Capture18.PNG" title="Nothing will go wrong" />

No big deal, right? I'll just rename mine to /org2 and hit submit.

<img src="https://static.raymondcamden.com/images/cfjedi/Capture19.PNG" title="Oh frack!" />

Ouch. It actually replaced my org mapping. Not the end of the world, but if you had a lot of mappings it could easily be missed. Note - I recommend - almost always - that you use Application specific mappings. In my case though it is a code base I can't modify just yet.

I have filed a bug report for this, but unfortunately the <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html">public bug base</a> still hides 901 bugs.