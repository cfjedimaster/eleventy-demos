---
layout: post
title: "Working with SES URLs Follow Up"
date: "2005-08-03T08:08:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2005/08/03/Working-with-SES-URLs-Follow-Up
guid: 665
---

One of the things I didn't mention in yesterday's <a href="http://ray.camdenfamily.com/index.cfm/2005/8/2/Ask-a-Jedi-Working-with-SES-URLs-and-ColdFusion">entry</a> was that there is an alternative to working with the CGI path_info variable. I didn't bring it up because it is web server dependant which means your code becomes a bit less portable, but at the same time, it does make SES URLs even easier. The other option is URL rewriting. What this means is - we take a URL like so:

www.clownpoop.com/foo/3

and the web server, not our code, actually rewrites it to:

www.clownpoop.com/index.cfm?foo=3

(Note - I have no idea if clownpoop is a real web site or not. Please don't go there. With my luck it will be some obscene site - or worse - pro-Bush. ;)

What's cool about this option is that you do <i>nothing</i> in your code. The web server handles everything. All you have to do is build your links according to the format you want to support, and then tell the web server how to handle it.

If you use Apache, which I do at home, but not for this box, the feature is called <a href="http://httpd.apache.org/docs/2.0/mod/mod_rewrite.html">mod_rewrite</a>. What's cool is that it does a lot more than just "Translate URL X to Y". You can do conditional translations, for example, based on user agents. Check the documentation for more information.

The option that I use for IIS is <a href="http://www.isapirewrite.com/">ISAPIRewrite</a>. This is a pretty handy little tool, and it is free if you only have one server on your box, or only need to apply one set of rules. The non-free version is 75 dollars, which isn't bad. There are other options out there, and if you are using one, feel free to post one in the comments.

By the way - this is the option I'm using for the new version of CFLib. I didn't want to worry about the URL rewriting in my Model-Glue code, so I'm just letting the server handle it.