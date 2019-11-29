---
layout: post
title: "Handling/Testing of Emails in a ColdFusion App"
date: "2011-06-17T18:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/17/HandlingTesting-of-Emails-in-a-ColdFusion-App
guid: 4271
---

prims asked me:

<blockquote>
In our testing and staging region I would like to stop sending emails. I thought the easiest way is to not to have anything in Mail settings. But then not all the users at our work environment have access to Administrator and wouldn't like to make request to System Administrator.

Some other co-worker suggested wrapping cfmail with some condition so that it will not send any emails in those region.

What is the best approach? Any suggestions. Thanks as always for looking into this issue.
</blockquote>
<!--more-->
I hesitate to say I have the best answer (which is the main reason I wanted to answer in a blog entry versus an email!) but here are some ideas to consider:

<ul>
<li>If it isn't too late, you can consider building a mail service component. This component would handle all mail tasks. That means nothing else in the system would use cfmail, but would instead ask the mail service to send email for it. This then makes it easy to change what exactly happens when a mail is requested. A configuration setting could be used to tell the mail service to simply log the mail instead of sending it. Or perhaps to create a simple text file that is accessible to the end user. I've done this before for reasons like this. It also lets me do things like "always CC someone" or "set TO to me in staging". Basically it gives me a way to override cfmail at the code level. 
<li>You mentioned just setting the mail settings to an empty string. If you do that then any code using cfmail will throw an error. I believe instead you want them to just enter "localhost", and as long as they don't have a mail server the mails won't go anywhere. But you said not everyone had access to the cfadmin. That may be something you want to fix. If your developers aren't using their own machines then you should look into "fixing" that as well!
<li>In the past I've used a few simple mail servers that let me 'fake' a real mail server. I don't use it as much since you can easily view ColdFusion's undelivered email, but if I want the "real" experience I'll switch to a free mail server. I've used <a href="http://www.hmailserver.com/">hMailServer</a> for this in the past. You can set it up to accept global email patterns and just address them to one person. I know you said you wanted to stop emails - but this is another option that may be useful.
</ul>

All things considered - I'd do the first option. You can get complex and use ColdSpring to manage this, but if you are looking for a quick fix, it shouldn't take too long to switch your existing code over. Anyone else have better ideas?