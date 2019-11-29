---
layout: post
title: "Reminder - there is more to the CGI scope than what the dump shows"
date: "2011-09-03T12:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/09/03/Reminder-there-is-more-to-the-CGI-scope-than-what-the-dump-shows
guid: 4353
---

I knew this - but forgot and instead of spinning my wheels when I make the same mistake in a month, I figured I'd quickly blog it to help me remember.

Don't forget when you cfdump the CGI scope,  you are getting what is basically a "known" set of CGI variables. There may be additional CGI values available that will not show up.

A good example of this is CGI.redirect_url. When using Apache URL rewriting, that value will contain the original request URL. So if you rewrite foo.cfm to goo.cfm, you can use cgi.redirect_url to return foo.cfm.