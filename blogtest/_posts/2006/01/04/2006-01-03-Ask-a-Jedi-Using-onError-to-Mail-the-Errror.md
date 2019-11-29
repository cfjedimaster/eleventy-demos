---
layout: post
title: "Ask a Jedi: Using onError to Mail the Error"
date: "2006-01-04T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/04/Ask-a-Jedi-Using-onError-to-Mail-the-Errror
guid: 1007
---

A reader asks:

<blockquote>
Ray,
I am in the process of revamping how we handle errors, especially with the new onError event in Application.cfc. Most of the examples that I have seen use onError for logging errors to a file and then output some message to a user (as long as the event did not occur in onApplicationEnd or onSessionEnd). We do not want to log errors to a file, instead we would like to receive an email about the error and show the user a friendly error page. In this case, would we use onError or cferror or both? If both, what should onError handle before throwing the error to cferror? I am trying to find a best practice way of handling site-wide errors in the top level Application.cfc. Any help would be greatly appreciated!
</blockquote>

This is actually quite simple. Your onError can use cfmail just as easily as it can use cflog. What I would suggest is something like this in your onError (assuming that you named the exception argument "exception"):

<code>
&lt;cfmail to="your address here" from="your address here" subject="Error on Site X" type="html"&gt;
&lt;cfdump var="#arguments.exception#"&gt;
&lt;cfdump var="#arguments.cgi#"&gt;
&lt;cfdump var="#arguments.form#"&gt;
&lt;cfdump var="#arguments.url#"&gt;
&lt;/cfmail&gt;
</code>

As you can see, all I'm doing is sending a dump of the exception, as well as the CGI, Form, and URL scopes. Many times these scopes will provide information about what was going on at the time of the error. You can also dump cookie, session, client, and application if you want. You can also be a bit "prettier" and use a nicely formatted table on top. Personally, I just like the dump as I can tell pretty quickly from it what the problem is. 

Just to be clear - this isn't an "either or" type situation. You can mail and you can log <i>and</i> you can present a nice screen to the user.