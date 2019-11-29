---
layout: post
title: "Simple Error Templates"
date: "2006-12-04T07:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/04/Simple-Error-Templates
guid: 1689
---

A few days ago I promised I'd blog about the error templates I use. Obviously part of the template is set up to show the site's look and feel and present a generic "We are so sorry, blah blah blah" type message. Outside of that though here is typically what I do with the error itself. 

<code>
&lt;cfmail to="me" from="me" subject="SiteX Error" type="html"&gt;
&lt;cfdump var="#exception#" label="Exception"&gt;
&lt;cfdump var="#cgi#" label="cgi"&gt;
&lt;cfdump var="#form#" label="form"&gt;
&lt;cfdump var="#url#" label="url"&gt;
&lt;/cfmail&gt;
</code>

As you can see - I just take a massive dump in the email. Typically this is all I need. Sometimes though I need the session info so I just add a dump of that. I also bring up information on top of the dumps when I think it will be helpful. So for example, on <a href="http://www.riaforge.org">RIAForge</a>, I have both a main site and any number of project sites. To help me see a bit quicker, I can add this on top:

<code>
Site: #cgi.server_name#&lt;br /&gt;
URL: http://#cgi.server_name##cgi.script_name#?#cgi.query_string#&lt;br /&gt;
</code>

I typically also make the URL hot to ensure I can click on it from my email program. 

Another idea to consider is placing the exception.message value in the message subject. You may want to trim it at 500 characters or so to keep it readable in your mail program. 

One last suggestion: When working locally, it helps if you can skip the whole email process. While <a href="http://ray.camdenfamily.com/projects/spoolmail/">SpoolMail</a> is helpful, I'd rather just get the error immediately. What I do then typically is check the server name CGI variable. If it is my local version, I dump the exception to screen.