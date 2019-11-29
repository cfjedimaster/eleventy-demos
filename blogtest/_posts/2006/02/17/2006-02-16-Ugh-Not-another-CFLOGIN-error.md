---
layout: post
title: "Ugh - Not another CFLOGIN error?"
date: "2006-02-17T06:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/17/Ugh-Not-another-CFLOGIN-error
guid: 1107
---

This morning I woke up to discover about 150 error reports in my mail box. They were all from the blog and all had the same error:

Can not decode string "expires".

The detail said:

The input string is not base64-encoded.

I couldn't even begin to imagine where this code was running, but luckily my report included the tag context. Believe it or not - the error was on the line in BlogCFC that uses cflogon. I realized then that maybe something was wrong with the cookie. Here is the value reported by CGI.http_cookie: (Note, I added a line break or two to spread it out.)

CFAUTHORIZATION_scamdenfamilysourcemorpheusblogforumsApplicationcfmgalleonForums=expires;
CFID=4801581;
CFTOKEN=2ea533ac501d2554-76BF0F72-AD27-30BB-E2A346EC274560B7;
JSESSIONID=7030563869cb7434c484;
CFAUTHORIZATION_ebsitescamdenfamilysourcemorpheusblogApplicationcfm_blog_Default=expires

Now I'm not sure where the cfauthorization cookie is coming from. I would have assumed cflogon, however, a test on my local server didn't show the same cookie. Either way - since it is possible for someone to change their cookies, does this mean cflogon can be forced to throw an error just due to a bad cookie? Shouldn't cflogon simply see a bad cookie as an invalid authorization? 

I started out as a huge fan of roles based security, but the issues I keep running into really make me think that it may be time to leave it.