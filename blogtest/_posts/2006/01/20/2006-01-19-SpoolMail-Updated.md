---
layout: post
title: "SpoolMail Updated"
date: "2006-01-20T10:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/20/SpoolMail-Updated
guid: 1041
---

I made two minor updates to <a href="http://ray.camdenfamily.com/projects/spoolmail">SpoolMail</a>. First off - I got rid of the Application.cfc file and changed it to a Application.cfm file provided by Phillip Duba. Now - let me be clear. Application.cfc is <i>much</i> better than Application.cfm. But since this was the only thing preventing the application from working in CFMX6 (and 5 most likely), it seemed like a good call.

Secondly, I added the <a href="http://www.cflib.org/udf.cfm/activateurl">ActivateURL</a> UDF to the message display. This will auto-hot link any URL/email address. These links should pop open a new window. 

Oh - and I added a license. If you have any questions on the license, just let me know. You can download the application from the <a href="http://ray.camdenfamily.com/projects/spoolmail">project page</a>.