---
layout: post
title: "ColdFusion 9 JSON Bug"
date: "2009-10-19T08:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/10/19/ColdFusion-9-JSON-Bug
guid: 3567
---

This one is a doozy. I hope it gets fixed by a hot fix rather than the next "dot" update. Bjorn Jensen gets credit for finding it. I ran into it myself yesterday when working on my blog entry. If you have a CFC that returns numeric data and uses a returnType of numeric, then ColdFusion will throw an error. Here is one example of code that will throw the error:

<code>
&lt;cffunction name="getX" access="remote" returntype="numeric"&gt;
	&lt;cfargument name="id" type="any"&gt;
	&lt;cfreturn arguments.id&gt;
&lt;/cffunction&gt;
</code>

I then entered this URL to test: http://localhost/test.cfc?method=getx&id=1&returnformat=json. The error was:

java.lang.Double cannot be cast to java.lang.String 

The fix is to simply change the returnType to string (or any). You can find more detail (and vote for a fix!) at the public bug tracker: <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=80375">http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=80375</a>.