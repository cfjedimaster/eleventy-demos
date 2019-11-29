---
layout: post
title: "Food for thought - method to block non-Ajax requests"
date: "2009-04-17T14:04:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2009/04/17/Food-for-thought-method-to-block-nonAjax-requests
guid: 3319
---

A user sent in an interesting idea to me earlier in the week and I wanted to share it with my readers. It involves noticing and blocking Ajax-based requests. This kinda dovetails nicely with one of my recent InsideRIA posts (<a href="http://www.insideria.com/2009/04/jqueryserver-side-tip-on-detec.html">jQuery/Server Side Tip on Detecting Ajax Calls</a>, and forgive me for not posting recent InsideRIA links - should I keep doing that?). Rob sent me the following:

<blockquote>
<p>
I am getting into some AJAX-driven work using jQuery, and while it's all happening from secure areas of the site, I don't want people to try and backdoor into some query results by directly calling the CFC. I have 2 functions that are simple query select statements, but are accessed both publicly and remotely. What I came up with was to manage the CFRETURN calls so that if I detect the existence of url.method, to check the cgi.http_referer value to make sure it's from the pages that would be making the AJAX calls. If
it is, I pass back the query. If it's not, I do a CFABORT (perhaps I'll log it in the future for what good that would do?). If I don't see url.method I assume it's not being remotely accessed so I just pass back the query.
</p>
<p>
All my queries are CFQUERYPARAM'ed so I'm not worried about injection attacks. But I was wondering if you think this is a strong enough gate to put up for this or if you have something more betterer. :)
</p>
</blockquote>
<!--more-->
So right off the bat, the first thing I mentioned was that the Method argument can be passed in via a form post as well, so he really needed to check url.method and form.method. I also mentioned that remote methods can be called via SOAP (web services). There's actually a CFML function for that: isSOAPRequest(). 

The next thing I'd probably worry about is checking the referer. I've never actually looked at the referrer values in Ajax calls. I whipped up a quick test and the CFM I called via Ajax did report a referrer value of the page itself. I'd still not trust it 100%, but it could stop some people.

At the end of the day though I'm not sure it's worth it. Rob followed up with another idea I thought might make more sense:

<blockquote>
<p>
I did just have a thought. I use onRequest to manage access to the admin sections and that is where the ajax calls come from. I have the code in onRequestStart that looks for .cfc extensions to allow the request to work so why not also add in there a check for a valid session?
</p>
</blockquote>

I think this makes the most sense really. Well, technically, just ensuring the session variables exist. I'm not so sure it even makes sense anymore to bother checking for ajax versus non ajax calls. If a person is authenticated and authorized to run X, do we really need to care if they run it directly versus Ajax?

Again - open question here folks. Be sure to also read the comments over on the <a href="http://www.insideria.com/2009/04/jqueryserver-side-tip-on-detec.html">other post</a> as well.