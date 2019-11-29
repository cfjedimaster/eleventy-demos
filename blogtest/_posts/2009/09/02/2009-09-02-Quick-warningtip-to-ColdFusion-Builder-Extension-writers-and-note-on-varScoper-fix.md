---
layout: post
title: "Quick warning/tip to ColdFusion Builder Extension writers (and note on varScoper fix)"
date: "2009-09-02T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/02/Quick-warningtip-to-ColdFusion-Builder-Extension-writers-and-note-on-varScoper-fix
guid: 3510
---

I ran into an interesting little bug today with ColdFusion Builder and extensions. I was trying to get <a href="http://varscoper.riaforge.org/">varScoper</a> working and I kept getting an error. Every time I got an error, Eclipse kindly told me that it had logged the error. If you open up the Eclipse Error Log view you (possibly) won't see your error. Why? Turns out that there is a bug with how ColdFusion Builder logs the extension error with Eclipse. The date gets screwed up and the error logs it as 1969-12-31. Since I had other errors with newer dates (like from this century), I didn't notice these. I've already filed a bug report for this but keep it in mind if you plan on developing a ColdFusion Builder Extension.

Note - if you plan on using the varScoper extension, make not of this <a href="http://varscoper.riaforge.org/index.cfm?event=page.issue&issueid=D89C6F03-C0EF-D698-5934B5438EF73B2A">bug report</a>. You can quickly fix it by adding <cfsetting showdebugoutput="false"> to the top of cfbuilder.cfm. I'd also recommend adding requestTimeOut=600 as well. This will let the extension run a bit longer. (So for example, I just scanned a project with close to 7000 unscoped variables. As you can imagine, that took a little time to generate. (Although honestly - not that bad - I think it was less than 5 minutes total.)

And lastly - just to show that Jedis make dumb mistakes as well - don't do what I did and type: <cfset showdebuggingoutput="false">. -sigh- CFSET isn't quite the same as CFSETTING.