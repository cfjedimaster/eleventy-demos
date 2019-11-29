---
layout: post
title: "Ask a Jedi: Scheduled tasks and username/passwords"
date: "2006-05-31T12:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/31/Ask-a-Jedi-Scheduled-tasks-and-usernamepasswords
guid: 1307
---

Chris asks:

<blockquote>
I am running CFM 7.  I noticed that in the CFAdmin, under Schedule Task, is username and password.  How do you use this?  I don't want anyone to run my task only the person that knows the username and password.  Thanks.
</blockquote>

I bet you didn't realize (it's not very obvious) but there is a Help link in the upper right hand corner of the ColdFusion Administrator. It is context sensitive and provides help for the page you are currently using. 

The username/password settings are only used if you are using your web server to secure the URL being used in the scheduled task. So if don't want anyone else to run the task, this is what you want to do.

By the way, I will admit to <i>not</i> securing my Scheduled Tasks URLs all the time, especially if the running of the event is harmless.