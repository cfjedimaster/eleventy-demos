---
layout: post
title: "Sessions Expiring and Too Many Cookies"
date: "2005-08-23T18:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/23/Sessions-Expiring-and-Too-Many-Cookies
guid: 722
---

I'm completely brain-dead right now. I spent the last few hours trying to track down a very odd issue. In IE (why is it always IE??), and not Firefox, an error would occur when someone would login to the members area of the site I'm working on. The error was being thrown because certain session variables didn't exist. 

However, these session variables were being set when you first hit the page. They weren't being set in onSessionStart, but logic was used to check for a cookie (hasFlash), and if the cookie didn't exist, I used <a href="http://www.cyscape.com/index.asp?bhcp=1">BrowserHawk</a> to sniff for Flash, and set session cookies with various bits of info returned from BrowserHawk.

Somehow the session was being destroyed, but the cookie was not.

After a butt load of testing, ten thousand cfdump statements, something finally clicked... I had too many cookies. The member login area had set 5 additional cookies, which was just enough to tick off IE, and make IE dump some cookies, and of course, it dumped the cookies ColdFusion used to mark the session.

I was, of course, aware of the cookie issue. But this site is in it's sixth generation, and things have just slowly grown to the point where it is hard to remember all the values being used and where. So - consider this a warning - and something to look out for in your own code.