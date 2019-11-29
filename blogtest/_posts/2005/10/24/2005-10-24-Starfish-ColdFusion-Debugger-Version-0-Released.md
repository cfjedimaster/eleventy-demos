---
layout: post
title: "Starfish ColdFusion Debugger Version 0 Released"
date: "2005-10-24T18:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/24/Starfish-ColdFusion-Debugger-Version-0-Released
guid: 868
---

So a few days ago I <a href="http://www.raymondcamden.com/index.cfm/2005/10/19/Goodbye-MAX-and-One-More-Thing">blogged</a> about my new project, Starfish. Starfish is essentially a ColdFusion debugger that doesn't display information, but rather stores it in the Server scope. You can then display a report on this data in the CF Admin. I'm now happy to report that the initial version is ready for <a href="http://ray.camdenfamily.com/downloads/starfish.zip">download</a>.

Some <b>BIG WARNINGS</b> - This code is ugly. I'm not kidding. I know that some people have told me they have learned a lot from downloading my code and looking at it. Don't do that. Avoid the code like the plague. Ok, so it's not that bad, but it was written <i>very</i> quickly. I'd call this version more a Proof of Concept than a real application. 

That being said - I'd love feedback on it. I've set up a <a href="http:/www.coldfusionjedi.com/forums/forums.cfm?conferenceid=249AB039-9046-9195-0C8FFD2086ADAC6E">forum</a> for the project, so please use it for your ideas. Also, I've <b>finally</b> gotten around to creating a "Projects" site. You can see the Starfish project here:

<a href="http://www.coldfusionjedi.com/projects/starfish">http://www.coldfusionjedi.com/projects/starfish</a>

All of my projects will have a page like this - as I get around to it. As always, if you like this, visit my <a href="http://www.amazon.com/o/registry/2TCL1D08EZEYE">wishlist</a>. (I'm still waiting for someone to pick up the Nano - what's wrong you people - too cheap?!?! ;)

<b>Edited:</b> Oops - so I forgot to mention. The zip has NO instructions. Here are some simple instructions for now:

Unpack the zip.
profiler.cfm goes in cfusionmx7\wwwroot\web-inf\debug
In your cf admin, turn on debugging and select the template.
Take the other files and place them in:

webroot\CFIDE\administrator\profiler

Add this line to extensionscustom.cfm in your cf admin folder:

&lt;a href="profiler/index.cfm" target="content"&gt;Profiler&lt;/a&gt;&lt;br&gt;