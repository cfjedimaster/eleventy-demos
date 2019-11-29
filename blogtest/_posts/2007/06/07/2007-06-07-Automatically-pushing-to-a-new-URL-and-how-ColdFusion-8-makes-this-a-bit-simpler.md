---
layout: post
title: "Automatically pushing to a new URL, and how ColdFusion 8 makes this a bit simpler"
date: "2007-06-07T15:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/07/Automatically-pushing-to-a-new-URL-and-how-ColdFusion-8-makes-this-a-bit-simpler
guid: 2102
---

When I was preparing to move my site from http://ray.camdenfamily.com to http://www.raymondcamden.com, I certainly didn't want all of my old URLs to stop working. I wrote some quick code (literally, I forgot to write the code before hand so I wrote it live on the old server) to handle this. Here is what I did...
<!--more-->
First off - I read Pete Freitag's excellent blog post, <a href="http://www.petefreitag.com/item/359.cfm">What CFLOCATION Does</a>, where he talks about how the status code sent out by CFLOCATION is intended for <i>temporary</i> move, not a permanent one. Using the code he suggested, I added a cfheader to my site. However, I have two styles of URLs. I have both traditional query_string style:

http://ray.camdenfamily.com/index.cfm?mode=entry&entry=XXXX

And my SEO style cgi.path_info style:

http://ray.camdenfamily.com/index.cfm/noone/reads/code/samples

So I needed code to notice either of these two forms. This is what I came up with:

<code>
&lt;cfset loc = cgi.script_name&gt;
&lt;cfif len(cgi.query_string)&gt;
	&lt;cfset loc = loc & "?" & cgi.query_string&gt;
&lt;cfelseif len(cgi.path_info)&gt;
	&lt;cfset loc = loc & cgi.path_info&gt;
&lt;/cfif&gt;
&lt;cfset loc = replaceNoCase(loc,"index.cfm/index.cfm","index.cfm")&gt;

&lt;cfheader statuscode="301" statustext="Moved Permanently"&gt;
&lt;cfheader name="Location" value="http://www.coldfusionjedi.com#loc#"&gt;
&lt;cfabort&gt;
</code>

As you can see - I check both cgi.query_string and cgi.path_info. Depending on what is used, I build up my new URL in a variable called loc. I can then push the user there using the two cfheader tags.

Now how does ColdFusion 8 make this easier? The cflocation tag has been updated to allow you to pass in a status code. There is a set of valid status codes, of which 301 is one of them. The two tags above would become one. (Actually I'd be able to get rid of the cfabort as well.)