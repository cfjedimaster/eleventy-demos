---
layout: post
title: "Be careful with returnFormat and JSON"
date: "2008-06-03T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/03/Be-careful-with-returnFormat-and-JSON
guid: 2855
---

A user pinged me earlier this morning with an interesting issue. His Ajax application wasn't working as expected. He was using jQuery to hit a CFC. Instead of showing you his code, I simplified it a bit which should make the problem a bit simpler to see. Try and figure it out before reading on:
<!--more-->
<code>
&lt;cffunction name="getTime2" access="remote" returnFormat="json"&gt;
	&lt;cfset var s = {}&gt;
	&lt;cfset s.time = now()&gt;
	&lt;cfset s.name = "Current Time"&gt;
	&lt;cfreturn serializeJSON(s)&gt;
&lt;/cffunction&gt;
</code>

It's a bit subtle - but the issue is that he mixes both returnFormat and serializeJSON. I've blogged about returnFormat quite a bit. It's one of my favorite features of ColdFusion 8 and it got little press. His use of it here though is not something I normally recommend. You can pass returnFormat as an argument in the request or you can specify it in the method inline  as he did. To me - using it inline is a bad idea. Not "bad" bad, but I don't think the CFC should be concerned with its return form. Instead, it should simply handle it's business logic and let the caller ask for a particular format. 

Where things go wrong is the serializeJSON. What's happening here is that CF first runs the code of the method (Make a struct, then JSON it), and then it formats the result in JSON. So basically it JSON encodes a string that is already JSON encoded. 

If you view this result (*), you can see the result is a bit funky:

"{% raw %}{\"TIME\":\"June, 03 2008 08:20:06\",\"NAME\":\"Current Time\"}{% endraw %}" 

All those \ should tip you off. If you remove the serializeJSON, you see a result that should look a bit better:

{% raw %}{"TIME":"June, 03 2008 08:20:06","NAME":"Current Time"}{% endraw %} 

I'd remove both the serializeJSON and the returnFormat. I'd then edit the jQuery code's URL to add returnFormat=JSON. 

*Ok, so let me use this blog entry to say <b>once again</b> that 99% of Ajax problems can be solved with a tool like Firebug. Firebug would have let you see the Ajax request and response, and if you were familiar with JSON, it would have been an big clue. It's also a handy way to see times when you forget to turn off CF debugging.