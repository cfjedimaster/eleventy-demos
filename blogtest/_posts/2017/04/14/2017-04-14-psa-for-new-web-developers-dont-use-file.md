---
layout: post
title: "PSA for New Web Developers - Don't Use file://"
date: "2017-04-14T12:55:00-07:00"
categories: [development]
tags: []
banner_image: /images/banners/psa1.jpg
permalink: /2017/04/14/psa-for-new-web-developers-dont-use-file
---

If you are new to web development, one of the things you may try is simply opening a local file with your web browser. In other words, you make a file, like cat.html, save it to your desktop, then do a File/Open in your browser to view it:

![cat.html, I bet that is awesome!](https://static.raymondcamden.com/images/2017/4/cat1.png)

This is a common way to learn web development and it's even what Mozilla Developer Network suggests in its [Learning Web Development](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/Dealing_with_files) tutorial. 

This works... but what you may not be aware of is that there are multiple web features that do not work when viewing HTML files loaded via File/Open (when you see file:// in the URL). For example, geolocation is blocked in Chrome when run on a page opened this way. 

I was not able to find a *precise* list of things that are blocked, but in general, you should probably avoid the issue as a whole and run a local web server. I understand that may be a bit daunting, but here are a few options to consider:

* [Apache](http://httpd.apache.org/) is probably the most well known web server out there. It's the easiest to install (and comes pre-installed on Mac), and the quickest to get up and running. To be clear, you do not need to become an expert with Apache! You can literally install it and then drop files in the folder set up to be the web root. Windows has IIS, and I believe it used to come pre-installed, but I'm not seeing it on my Win10 desktop, so maybe it isn't anymore. 
* [httpster](https://github.com/SimbCo/httpster) is my tool of choice, but it requires npm and command-line usage that may be a bit much for someone really new. The benefit of httpster is that I can make a folder, put some random web crap in it, then fire up a web server directly from that folder. It's fast and convenient for testing. I wouldn't recommend this for a new developer on their first day of learning to build web pages, but I'd tell them to bookmark it for later.
* Another option I see mentioned quite a bit is SimpleHTTPServer for Python. Python is installed by default on Mac, but not Windows. If you have it though, you can open your terminal, change to the right directory, and then just type `python -m SimpleHTTPServer`. Like the httpster suggestion though, it may be a bit overwhelming for new developers. (Although I hate to break it to you, you will need to get more comfortable with the command line. You won't need to be a wizard, but basic navigation and 'tool running' is something you'll need to become familiar with.)

Ok, so I'm going to ramble a bit. As someone who presents to and generally focuses on new developers, I'm always trying to keep things as simple as possible. I think a lot of people in our community *greatly* underestimate how overwhelming, confusing, and just difficult, many things are to people entering this field. Sure, you can "just Google it", but if you aren't at a point yet where you even know *what* to Google, you're stuck.

I 100% recommend the Mozilla Developer Network tutorial I mentioned earlier, and as far as I know, you can do the entire thing with just File/Open, but at least be *aware* that you're going to need to switch to using a local web server soon and prepare yourself for that install. (And heck, if you have local friends/coworkers, ask them to install it for you. Watch them, but I think it's totally fair to get some help on this step for now.)