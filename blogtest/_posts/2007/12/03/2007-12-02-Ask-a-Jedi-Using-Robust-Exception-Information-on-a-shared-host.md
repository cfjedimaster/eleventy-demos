---
layout: post
title: "Ask a Jedi: Using Robust Exception Information on a shared host"
date: "2007-12-03T10:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/03/Ask-a-Jedi-Using-Robust-Exception-Information-on-a-shared-host
guid: 2510
---

I was recently contacted by a possible client who was looking for a code review. As part of my standard "playing around" I noticed that his site was throwing errors with the full path information revealed. As folks know, I always recommend you turn off <b>Show Robust Exception Information</b> on a production machine. There is <b>no</b> reason to use it in production and no reason you need if you use proper error handling. I informed the client of this (possible client, hope I get the job :) and he spoke with host. I was shocked by the response:

<blockquote>
<p>
I spoke with my CF web host, and they said they are the only ones who can disable Robust Exception Info in the CF Admin but that they won't do that because they use it to help clients debug their sites. I told him that they need a separate server (with it disabled) in addition to what appears to be this development server. Am I right? He claimed that users would only be able to find out the DNS (and snippets of code)...no security problem. I've used it, and I know it spits out quite a bit. I told him that a security expert told me I should disable it. He said he'd be glad to talk with you. What do you think?
</p>
</blockquote>

Well, it is certainly true that your host is the only one who can change this if you are using shared hosting. What I found shocking though was their refusal to turn it off and their reason. Yes - the robust exception information is very useful. But if you want to use this information - use it where it makes sense - development. Not a live production server where the information could be used against you. Those "snippets of code" could reveal things. For example, have you ever seen code like this:

<code>
&lt;!--- foo is a valid, back door password ---&gt;
&lt;cfif authenticate(u,p) or form.password is "foo"&gt;
</code>

The host has access to the log files. Those could be checked instead. This involves minimal additional work on the host's part. If they argue that the logs contain information from other sites on the box, show them the <a href="http://www.raymondcamden.com/index.cfm/2007/4/3/Did-you-know-about-the-Log-Viewer-Filter">filtering</a> options.

I'm suggesting to my client that they use error handling for now to address the issue. I'm also suggesting that they possibly move to a new host.