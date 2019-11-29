---
layout: post
title: "Using CommandBox for Lucee"
date: "2016-08-30T09:03:00-07:00"
categories: [coldfusion]
tags: []
banner_image: /images/banners/cbl.jpg
permalink: /2016/08/30/using-commandbox-for-lucee
---

I think I've been very clear about my lack of interest in working with ColdFusion. It served me well for many years, but I've moved on to other technologies (Node!) that are more appropriate for me. When I do use ColdFusion, I've been trying to stick to [Lucee](http://lucee.org/). It's open source, free, and incredibly light-weight. About the only "code" problem I've had with it so far is with cfspreadsheet and even that was fixed after a bit of research. I've got other reasons to prefer Lucee over Adobe CF as well, but yeah, I'm still "biting my tongue" on that.

<!--more-->

For the most part, the Luceee Express server worked for me. The biggest issue I had was that my document root was under my installation folder and not a custom directory under Dropbox. Since I was mainly doing small tests, this wasn't a big deal. 

About a month or so ago, I began helping a friend out with a "real" site. This grew in size and it bothered me more and more that I was working under Lucee's folder and not my own project root. I decided one day to figure out how to change my document root. I also wanted to enable directory browsing.

I knew this was all done via Tomcat and I knew it was "possible", but two hours later I was tearing my hair out. I was able to change the document root and turn on directory browsing, but I broke having index.cfm as a home page. I was - mostly - ok with it, but then my friend started talking about SES URLs and I figured at this point it was time to give up trying to work with Tomcat and simply do what I'd done in the past with Adobe ColdFusion, integrate it with Apache.

I had just begun my research into doing a "real" Lucee install with Apache when it was recommended (and I forget by whom, sorry!) that I check out [CommandBox](https://www.ortussolutions.com/products/commandbox). I had heard of CommandBox of course. I knew it was a CFML CLI and had a package manager. I also knew it could fire up a server as well.

What I didn't know was how damn useful it was! After downloading the bits, I simply did `box server start` in the project folder. My first attempt failed:

![Error](https://static.raymondcamden.com/images/2016/08/cb1.jpg)

But this must be a common issue as Brad Wood in the Lucee Slack channel asked if I had a WEB-INF folder in my project. I did, from my use of Lucee Express, and removing it corrected the issue quickly.

But wait... there's more. Not only did it fire up Lucee and use the directory as root, it also had index.cfm working as a home page and directory browsing enabled. And it is 100% a "real" instance of Lucee of course, as you can open up the Lucee admin and work with your regular settings. So for example, I had to setup the DSN I had created in Lucee Express in my new server. This persists as well.

It just freaking works! 

Now - that being said - I've run into a few issues with the command line and I can't get it to use Lucee 5 versus Lucee 4, but so far, damn, this is really, really freaking impressive *and* much more useful than anything I've seen come from Adobe's ColdFusion product in years. I've said it before, but Lucee, Ortus Solutions, and Intergral are single handedly doing more for ColdFusion than the "official" providers have for years. 

p.s. So before I could publish this post, the good folks in the Lucee Slack helped me with my issue. As of *today*, the `brew` install for CommandBox isn't the latest version. (By the way, I run into this a lot with Brew installs. I am *not* a fan.) I switched to a direct download and my issue with using Lucee 5 was fixed. Immediately.