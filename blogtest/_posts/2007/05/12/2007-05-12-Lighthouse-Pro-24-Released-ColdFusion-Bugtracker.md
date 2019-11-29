---
layout: post
title: "Lighthouse Pro 2.4 Released (ColdFusion Bugtracker)"
date: "2007-05-12T18:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/12/Lighthouse-Pro-24-Released-ColdFusion-Bugtracker
guid: 2027
---

A semi-big update today. <a href="http://lighthousepro.riaforge.org">Lighthouse Pro</a> now has the follow enhancements/updates:

<ul>
<li>You can now attach multiple attachments to an issue.
<li>You can now delete attachments. (Duh, why didn't I have this before?)
<li>I now store and display the original file name of the attachment. So if you upload foo.txt and ColdFusion has to rename it to vivapinataisweird.goober, then you will see foo.txt displayed on the front end. 
<li>Email support has been updated to allow for attachments. So now your users can email you a bug report and include a screen shot for example.
<li>The XML used in the AJAX has been slimmed down quite a bit. I'll switch to JSON once Spry 1.5 is released, but for now it should make the application run a bit faster. A project with 300 issues was clocking in at 400K or so. Thats insane. It now comes in at 120K or so, which is still big, but less than half of what it was before.
<li>Plus a few other small fixes here and there.
</ul>

Thanks to <a href="http://scottpinkston.org/blog/">Scott Pinkston</a> for doing the MS Access update. I just discovered today that I no longer have a copy of MS Office installed. I'll have to add that to my Parallels install. (Unless anyone knows of a decent OSX Access editor.)

As always - the application is free and your <a href="http://www.amazon.com/o/registry/2TCL1D08EZEYE">support</a> is welcome.