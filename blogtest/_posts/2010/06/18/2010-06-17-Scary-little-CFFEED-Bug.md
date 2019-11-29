---
layout: post
title: "Scary little CFFEED Bug"
date: "2010-06-18T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/06/18/Scary-little-CFFEED-Bug
guid: 3851
---

Two days ago I wrote a quick little blog entry on <a href="http://www.raymondcamden.com/index.cfm/2010/6/16/Quick-example-of-RSS-URL-checking-with-jQuery-and-ColdFusion">validating RSS feeds</a> with ColdFusion and jQuery. At the end I pointed to a demo but mentioned that I hard to "hobble" it a bit and not allow you to dynamically check <i>any</i> feed. Today I'll explain why.
<!--more-->
<p>

Under certain systems (not all - amongst the folks I checked with only about half had this issue), if you use cffeed to request a URL that requires HTTP authentication, the request will never die. It won't kill ColdFusion (by itself), but the request will stay around until the server restarts. You can't even kill it with the Server Monitor. Here is an example of the code I used.

<p>

<code>
&lt;cftry&gt;
       &lt;cffeed source="http://twitter.com/statuses/friends_timeline/154910849.rss"
query="foo" timeout="10"&gt;
       &lt;cfdump var="#foo#"&gt;
       &lt;cfcatch&gt;
               &lt;cfdump var="#cfcatch#"&gt;
       &lt;/cfcatch&gt;
&lt;/cftry&gt;
</code>

<p>

Under some servers, you get a nice error. On some, you will even get a browser prompt for the login. But on a few of mine, it simply hung. 

<p>

At this time I'm not aware of any workaround. You can, however, use CFHTTP to hit the URL first. It correctly sees the authentication prompt and returns a nice error. You could use CFHTTP to suck down the contents. Unfortunately, CFFEED still does not allow you to parse a generic string. You can use the virtual file system to write the contents out to RAM and than use CFFEED to point to it.

<p>

The good news is that I've already logged a bug report for this and it's already been fixed.