---
layout: post
title: "IIS, SES URLs, and \"Check for file existence...\""
date: "2005-07-14T18:07:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2005/07/14/IIS-SES-URLs-and-Check-for-file-existence
guid: 625
---

So, a user reported a problem in the latest version of the BlogCFC beta. The SES URLs kept returning a 404 error. Turns out, he was running IIS6 with the "Check for file existence" flag turned on. Why would he do that? Well it let's you have nicer 404 errors on an IIS box with multiple servers on it. So this is normally a "good thing." That being said...

Can someone thing of a way, out of the box, to get this working:

www.foo.com/foo/index.cfm/x/1

What's odd is that the blog worked when run from the root, ie:

www.foo.com/x/1

Either way - does anyone know a work-around for this that does NOT involve using ISAPIRewrite? (Or using the 404 template.)