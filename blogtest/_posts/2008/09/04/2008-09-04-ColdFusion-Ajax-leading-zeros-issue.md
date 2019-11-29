---
layout: post
title: "ColdFusion Ajax leading zeros issue"
date: "2008-09-04T12:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/04/ColdFusion-Ajax-leading-zeros-issue
guid: 2999
---

A user posted a <a href="http://www.raymondcamden.com/forums/messages.cfm?threadid=2DFAB65D-19B9-E658-9D259B4BEB23A161&#top">question</a> to my forums that I thought would make for interesting blog matter. It concerns ColdFusion, binding, and results with leading zeros. I touched on this before (<a href="http://www.coldfusionjedi.com/index.cfm/2008/3/17/Interesting-ColdFusion-8-AutoSuggest-issue-to-watch-for">Interesting ColdFusion 8, AutoSuggest issue to watch for</a>) so this may be something folks are aware of already. Here is some background. Imagine a CFC with this simple method:
<!--more-->
<code>
&lt;cffunction name="getKey" access="remote" returnType="string"&gt;
	&lt;cfreturn "001234"&gt;
&lt;/cffunction&gt;
</code>

Notice the result is a number, but with zeros in front. If you bind this to something on the front end:

<code>
&lt;cfdiv bind="cfc:test.getkey()" /&gt;
</code>

You will only see 1234, not 001234. If you inspect the HTTP call with Firebug, you can see that the server returned 1234.0. ColdFusion took care of dropping the .0 at least, but this is <b>not</b> a desirable result. As mentioned in the <a href="http://www.coldfusionjedi.com/index.cfm/2008/3/17/Interesting-ColdFusion-8-AutoSuggest-issue-to-watch-for">earlier blog post</a>, this seems to be the nature of the JSON serialization in ColdFusion. I can think of two simple ways around this.

One way would be to bind to a JavaScript function that then used cfajaxproxy to call the back end. Your back end cfc would need to prefix the result so the zeros aren't dropped. Like so:

<code>
&lt;cffunction name="getKey2" access="remote" returnType="string"&gt;
	&lt;cfreturn "pre" & getKey()&gt;
&lt;/cffunction&gt;
</code>

My problem with this solution is that your mucking with your model code. You shouldn't need to do that. Luckily there is another way to handle this. Don't forget that CFCs (in ColdFusion 8 at least) support a plain return format. Plain meaning "don't do squat to my result, just return it!". So if I change my cfdiv to:

<code>
&lt;cfdiv bind="url:test.cfc?method=getkey&returnformat=plain" /&gt;
</code>

It works as expected now. I'm still using my CFC, but I've switch to the URL format. It's a bit more verbose, but at least my model CFC isn't changed.