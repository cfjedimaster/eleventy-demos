---
layout: post
title: "Changes to defaults in ColdFusion 10"
date: "2012-02-26T15:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/02/26/Changes-to-defaults-in-ColdFusion-10
guid: 4538
---

Along with new features, ColdFusion 10 also offers some good changes to defaults. You may not agree with these changes, so review them carefully to ensure they mesh with your development rules.
<!--more-->
<ol>
<li>One that almost no one should argue about - the default storage method for client variables has switched from the Windows Registry (or the fake version on Unix-based systems) to cookie values.
<li>CFTOKEN cookie values now are set to use UUIDs. 
<li>Global script protection is now enabled by default. Now, this is probably a good thing, but, I've found it trips me up and I normally ensure it is <i>disabled</i>. (You can disable it at the application level.) This is the setting that trips up bloggers since it takes their HTML and escapes it automatically. I guess I can accept that it makes more sense to be enabled, just keep this in mind when working on code for a ColdFusion 10 server.
<li>The maximum number of simultaneous template requests changed from 10 to 25. The maximum number of simultaneous CFC function requests went from 10 to 15. Remember - these are defaults. You <b>really</b> want to take the time to configure these for your server and application.
<li>The minimum JVM heap size went from nothing to 256 megs.
<li>This one may impact people too - the maximum size of post data went from 100 megs to 20. 
<li>Finally, ColdFusion Event Gateway services will be disabled by default. Probably makes sense with no one using it (which is unfortunate!), but keep it in mind if your code requires it.
</ol>

There are a few other changes as well. For example, file uploads are now more secure by default since we go far beyond just checking the file extension. Now deeper checking into the file type is performed. You can disable this, but don't. 

There may be other changes as well - if you find em - post em!