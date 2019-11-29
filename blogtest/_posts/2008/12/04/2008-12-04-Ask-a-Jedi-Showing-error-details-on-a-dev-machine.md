---
layout: post
title: "Ask a Jedi: Showing error details on a dev machine"
date: "2008-12-04T15:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/04/Ask-a-Jedi-Showing-error-details-on-a-dev-machine
guid: 3133
---

Brett asks:

<blockquote>
<p>
Hi,
Do you have that "ask ray" thing going on still?
</p>
</blockquote>

Yes, thanks for asking!
<!--more-->
<blockquote>
<p>
In my application.cfc, during dev / local testing, I don't want the onerror handler to work, I want the site to bomb out. I'm constantly commenting the onerror handler out in the
application.cfc, is there an easier way to turn this off when testing locally?
</p>
</blockquote>

So most likely you have some nice error handling going on where the error is completely hidden from the end user. Great. Pat yourself on the back because right there you have made your application nicer than the average! During development though it can be a bit of a pain. You actually want to see the error so you can fix it right away.

Normally what I do is a simple hostname check. If I recognize that I'm on the dev server, I'll dump the error out. So my onError may look something like this:

<code>
&lt;cffunction name="onError" returnType="void" output="false"&gt;
	&lt;cfargument name="exception" required="true"&gt;
	&lt;cfargument name="eventname" type="string" required="true"&gt;
	&lt;cfif cgi.SERVER_NAME is "localhost"&gt;
		&lt;cfdump var="#exception#"&gt;
		&lt;cfabort&gt;
	&lt;/cfif&gt;
	&lt;cfoutput&gt;Sorry, the intern broke the internet tubes!&lt;/cfoutput&gt;&lt;cfabort&gt;
&lt;/cffunction&gt;
</code>

As you can see, if I recognize that I'm on my local server, I dump the exception out and abort. Otherwise I display the nice message. You can use other means to check of course. You can check the referring IP. You can check the machine name. Etc. 

Now your message said that you wanted to turn the onError off. To me that implies that you want it to look a bit closer to an unhandled error. You could simply remove my dump with:

<code>
&lt;cfthrow object="#exception#"&gt;
</code>

That simply takes the exception and throws it right back out. The end result is an error that looks like an unhandled exception. 

Now - if you really do want to 'remove' onError, can you? Yes! Using the same trick Sean Corfield came up with to hide onRequest from AJAX/Flex Remoting requests:

<code>
&lt;cffunction name="onRequestStart" returnType="boolean" output="false"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	&lt;cfif cgi.server_name is "localhost"&gt;
		&lt;cfset StructDelete(this, "onError") /&gt;
		&lt;cfset StructDelete(variables,"onError")/&gt;
	&lt;/cfif&gt;
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

Now personally I wouldn't go this route, I'd just use the example above, but it is another option you may want to consider.