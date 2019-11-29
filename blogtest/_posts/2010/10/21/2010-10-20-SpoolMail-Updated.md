---
layout: post
title: "SpoolMail Updated"
date: "2010-10-21T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/10/21/SpoolMail-Updated
guid: 3978
---

Today I'm happy for a few reasons. One I can't say till later (hopefully). The other is that <a href="http://spoolmail.riaforge.org">SpoolMail</a> has some kick butt updates that I think people happy. Best of all - they were user contributions which means all I had to do was vet the code! If you don't know what SpoolMail is, let me give you a quick introduction.
<!--more-->
When you work with cfmail on a development machine, your emails typically end up in an folder called "Undlivr". (I guess adding the last 'e' would have been crazy.) This is a good thing as you normally don't want test emails and the like sent out into the real world. However, if you want to actually look at the emails you have to open the files in a text editor. SpoolMail gets around this by simply building a web based interface to the folder. Here is a screen shot and it shows one part of what's new in SpoolMail 2 - a fresh UI by Craig Rosenblum.

<img src="https://static.raymondcamden.com/images/screen19.png" />

Pretty cool, right? I used the heck out of this until ColdFusion 9. ColdFusion 9 added it's own version of this feature and can be found within the mail settings page. Just click the "View Undelivered Mail" button. However not everyone is on CF9 yet so I assume folks still need this tool. 

The next update though I think is pretty darn cool and will be useful to folks in any version of ColdFusion 9. John Ramon has turned SpoolMail into a ColdFusion Builder extension. That means you can check the mail directly from your editor and skip hitting the Admin at all.

<img src="https://static.raymondcamden.com/images/cfjedi/screen20.png" />

Can I say again just how awesome ColdFusion Builder extensions are? Anyway - enjoy and let me know how it works for you.