---
layout: post
title: "Is your site secure?"
date: "2006-11-02T11:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/02/Is-your-site-secure
guid: 1630
---

I hate to cross post - but Pete posted a good entry today everone should read:

<a href="http://www.petefreitag.com/item/593.cfm">Web Application Vulnerabilities trump Buffer Overflows</a>

Pete discusses a study that shows that web application vulnerabilities now make up the top three attack vectors. I know I harp on this quite a bit on this blog (and my November CFJUG meeting was going to discuss this), but it is truly appalling how bad web application security is now. To be clear - I'm not perfect - but let me ask you this:

Consider the last ten jobs you did. Of those jobs - how many clients brought up web application security?

I don't mean "We need a username/password protected admin folder", but rather security as a whole for the entire site. Questions like:

"Are we exposing any web services we don't want to?"

"Are we properly checking all input for both cross site scripting attacks as well as authorization purposes?"

How many people integrate questions like this into a report to be handed off to a client? How many people bring it up if the client does not? Of course, most of my readers will probably do all of this and more - but we need to ensure we reach out to those new CF developers and ensure they "get the message".