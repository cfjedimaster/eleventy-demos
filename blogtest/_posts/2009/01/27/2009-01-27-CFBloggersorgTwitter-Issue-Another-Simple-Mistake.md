---
layout: post
title: "CFBloggers.org/Twitter Issue (Another Simple Mistake!)"
date: "2009-01-27T21:01:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2009/01/27/CFBloggersorgTwitter-Issue-Another-Simple-Mistake
guid: 3213
---

I made a promise to myself a while ago. Every time I do something stupid, I'd blog it. Not to impress people with the depths of my ineptitude, but to remind my friends that simple mistakes don't stop happening no matter how long you develop. (Well, at least for me.)

Daryl Banttari pinged me earlier today to mention that the Twitter feed for ColdFusionBloggers (<a href="http://www.twitter.com/cfbloggers">http://www.twitter.com/cfbloggers</a>) was screwing up the links. The title would say X, yet when you clicked you ended up on Y, some completely different title. 

Turned out to be a completely simple mistake. I had run a test on my dev machine earlier in the day. The code that sent messages to Twitter ran just fine on my local machine and "polluted" the live feed.

This is just one more reminder of keeping in control of the code that impacts stuff outside your web server. Mail stuff is another example of course. That's a bit easier to handle since normally your local dev environment won't be running a mail server. 

My fix was rather simple. I just added a check in Application.cfc/onApplicationStart to see if it was running on the local server. 

<code>
&lt;cfif findNoCase("dev2", cgi.server_name)&gt;
	&lt;cfset application.localserver = true&gt;
&lt;cfelse&gt;
	&lt;cfset application.localserver = false&gt;
&lt;/cfif&gt;
</code>

p.s. The dev2 comes from me using dev2 locally for the second version of ColdFusionBloggers.org.