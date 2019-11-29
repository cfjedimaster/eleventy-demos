---
layout: post
title: "My little project - ColdFusionBloggers.org"
date: "2007-07-19T17:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/19/My-little-project-ColdFusionBloggersorg
guid: 2203
---

I've been hinting at a little project the last few days and as I'm about to get on an airplane I thought now would be a good time to share. First let me share the URL and I know folks will just immediately link out, so please do me a favor and open this in a new window. I want to talk a bit about the project before you leave.

<a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a>
<!--more-->
So first and foremost, let me just say that I'm not trying to compete with MXNA, Goog, or Feed Squirrel. For a few days now I've been thinking of how easy it would be to build a blog aggregagtor in ColdFusion 8. I decided to build a site that would serve as a proof of concept. So to be clear, this site is mainly for fun and to showcase ColdFusion 8 technology. With that in mind, I've provided a link in the FAQ to the source. You can download all the code and play around with it. Outside of that, be gentle. Again, if you want a real aggregator, you know where to go. If enough folks like it though I'll consider adding more features. (The "Preferences" page for example is totally empty.)

So with that in mind, let me talk a bit about the code behind this site. First and foremost, in my mind, a blog aggregator does this:

<ol>
<li>Download RSS entries from various feeds
<li>Add unique entries into the database
<li>Present a "blended" view to the user.
</ol>

Pretty simple, right? I started off working with <a href="http://paragator.riaforge.org/">Paragator</a>. Paragator is my CFC based Aggregator function. Basically it takes an array of RSS feeds and grabs them all at once, using threading. (Well, not all at once, the server has a max number of threads.) So having the CFC meant 90% of my work was done.

Then I wrote a simple CFC to manage my blogs and entries. I used the OPML (list of blogs) feed from MXNA to seed my list of blogs. I then wrote methods to get all the blogs. This was then passed to Paragator (just a small note, I'm running a slightly modified version of the code). When the results come back, I use a method that will only insert new entries.

And that's it. 2 CFCs and a process page. Oh and one page to dump the results. Incredibly simple. The only really cool tags I used were cffeed and cfthread. 

On the front end I did a bit of AJAX work. The <a href="http://www.coldfusionbloggers.org/feeds.cfm">Feeds</a> page makes use of CF8 tabs. The main page uses cftooltip on the blog names to show their descriptions. I want to add a bit more AJAX to the front end, but I just don't know exactly where yet.

So thats it. Again - I wrote this for fun. If it takes off, great (another chance to slap some ads up! ;), but I mainly wanted to show off ColdFusion 8. Download the code and let me know what you think. And to be clear - my readers know my UI skills stink. The design you see on the blog is an open source one made by <a href="http://www.styleshout.com/">styleshout</a>. (I have to admit - I liked it so much I almost reskinned <i>this</i> blog with it.)