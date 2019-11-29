---
layout: post
title: "Blocking ColdFusion Debugging for AJAX Requests"
date: "2009-04-30T18:04:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/04/30/Blocking-ColdFusion-Debugging-for-AJAX-Requests
guid: 3336
---

This question came in via Twitter today (why, oh why did I start monitoring all ColdFusion mentions in Twitter??) - how does one disable ColdFusion debugging when using Ajax. This is an important question as ColdFusion's default debug output can really screw with Ajax requests. Consider the simple example of loading content into a div:

<code>
$("#response").load('reverse.cfm',{% raw %}{string:str}{% endraw %})
</code>

I took this line from the last InsideRIA <a href="http://www.insideria.com/2009/04/detecting-an-end-of-session-ev.html">blog entry</a> I wrote - basically it calls a ColdFusion service to reverse a string. If I enable ColdFusion debugging, the initial page looks likes so:

<img src="https://static.raymondcamden.com/images//Picture 233.png">

But when I fire off an Ajax request to reverse the string, check what comes back:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 325.png">

Yeah, that's so <i>not</i> hot. Luckily it is pretty easy to avoid. I've <a href="http://www.insideria.com/2009/04/jqueryserver-side-tip-on-detec.html">blogged</a> before about how you can sniff the request headers to check for an Ajax based request. The article focuses on jQuery, but <a href="http://blog.cutterscrossing.com/">Cutter</a> has assured me the same header exists in ExtJS. (Cutter did some more digging and he believes most JS framework peeps are standardizing on it.)

So given that we can check for an Ajax header in the request, we can use that to turn off debugging using the cfsetting tag and the onRequestStart method:

<code>
&lt;cffunction name="onRequestStart" returnType="boolean" output="false"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	&lt;cfset var reqData = ""&gt;
		
	&lt;!--- is it ajax ---&gt;
	&lt;cfset reqData = getHTTPRequestData()&gt;
	&lt;cfif structKeyExists(reqData.headers,"X-Requested-With") and reqData.headers["X-Requested-With"] eq "XMLHttpRequest"&gt;
		&lt;cfsetting showdebugoutput="false"&gt;
	&lt;/cfif&gt;
			
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

That's it. Of course, that isn't the only way to do it. If you work with ColdFusion 8's built in Ajax UI items, you will notice they pass a URL parameter, _cf_nodebug=true. If you add that to any query string than debugging will be disabled. (Actually, it really, <i>reall</i> turns off debugging. See this <a href="http://www.mischefamily.com/nathan/index.cfm/2009/3/30/The-CFNODEBUG-Parameter">blog entry</a> for more details.)

You could also disable debugging by request path, or if the request is to a CFC, or if 'json' appears in the URL. You get the idea. Anyway, I hope this helps.

p.s. Don't forget - if you use <a href="http://coldfire.riaforge.org">ColdFire</a>, you don't have to worry about any of this. Are you using ColdFire yet?