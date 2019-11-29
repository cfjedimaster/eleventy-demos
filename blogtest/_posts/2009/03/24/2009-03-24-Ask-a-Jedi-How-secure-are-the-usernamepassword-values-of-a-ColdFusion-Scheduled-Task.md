---
layout: post
title: "Ask a Jedi: How secure are the username/password values of a ColdFusion Scheduled Task?"
date: "2009-03-24T18:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/03/24/Ask-a-Jedi-How-secure-are-the-usernamepassword-values-of-a-ColdFusion-Scheduled-Task
guid: 3288
---

Kay asks:

<blockquote>
<p>
How secure are the usernames and passwords of scheduled tasks in the ColdFusion admin console?
</p>
</blockquote>

I think the answer is - it depends. I did a quick test and added a username of 'user' and password of 'pass' to a scheduled task. I then clicked to edit it again and the password was in the form. It was a password field, but view source showed it. If someone got access to your ColdFusion admin, they could see the password.

You can also dig into your ColdFusion lib folder and find neo-cron.xml. This is an XML file that defines all the scheduled tasks. The username was there, in plain text:

<code>
&lt;var name='username'&gt;&lt;string&gt;user&lt;/string&gt;&lt;/var&gt;
</code>

But the password was encrypted:

<code>
&lt;var name='password'&gt;&lt;string&gt;(P(BMZG]$VZ\ &lt;char code='0a'/&gt;&lt;/string&gt;&lt;/var&gt;
</code>

Of course, if someone gets access to your lib XML files, they can just disable the ColdFusion administrator password and view the entry via the form.

All in all I'd say - pretty secure unless someone gets access to the machine itself. Locked down completely 100% super-duper government agent safe? Probably not. Reasonably secure though.