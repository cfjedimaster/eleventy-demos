---
layout: post
title: "Front-End Interview Questions – Part 3"
date: "2015-01-28T17:01:02+06:00"
categories: [development]
tags: [front-end-interview-questions]
banner_image: 
permalink: /2015/01/28/front-end-interview-questions-part-3
guid: 5597
---

This post is part of a series I’m writing where I attempt to answer, to the best of my ability, a set of <a href="https://github.com/h5bp/Front-end-Developer-Interview-Questions">Front-End developer questions</a>. I expect/hope my readers will disagree, augment, and generally hash out my answers in the comments below.

<strong>Talk about your preferred development environment. (OS, Editor or IDE, Browsers, Tools, etc.)</strong>
I covered this pretty deeply in a blog post from late last year (<a href="http://www.raymondcamden.com/2014/12/08/my-cordovaphonegap-developer-setup-fall-2014">My Cordova/PhoneGap Developer Setup (Fall 2014)</a>). While that post was focused on Cordova development, it pretty much covers my development setup in general. I don’t think I have anything to add to that list so I’ll carry on.

<strong>Which version control systems are you familiar with?</strong>
Git, although I suck at branches and merging. I’ve made a note in Evernote that lists different types of Git commands based on what I’m trying to achieve. I’d like to be a bit better at Git, but my current level of skill hasn't really hurt me so far. When I have some free time, I plan on taking the <a href="https://www.codeschool.com/paths/git">Code School Git course</a> as I absolutely love Code School.

I can use SVN as well, but since I use it so rarely I keep a note around to help me remember the basics.

I have some experience with Perforce. I’ll use it if you put a gun to my head.

And yes - you will all laugh at me - but I used to love Visual SourceSafe. It was simple, easy to use, and I never had data corruption with it.

<strong>Can you describe your workflow when you create a web page?</strong>
That’s a bit open-ended. In my editor, I use snippets so I can quickly lay out a simple HTML page, quickly add jQuery if I need it, etc. Most of my demos are JavaScript-based so I’ll normally:

<ul>
<li>Make a new folder for my test.
<li>Make an index.html file and drop in the snippet.
<li>Make an app.js and start coding.
</ul>

That’s it. I don’t use Yeoman as I find it super heavy for quick one-offs. Ditto for Bower. My issue with these tools is that they tend to add a huge amount of files. If I were building a proper "project", i.e. something I’d be working on for a month, it may make sense, but for my blog posts, presentations, etc, they are <i>way</i> overkill. I actually built my own tool for Brackets to quickly download JavaScript frameworks with a simple right click. It only downloads the core files needed to use them because - that’s all I want to do - use them. (Maybe I’m crazy that way. ;)

<strong>If you have 5 different stylesheets, how would you best integrate them into the site?</strong>
Oh, this is a good one. Keeping in mind I try to avoid CSS and just use a library (like Bootstrap), it seems to me I’d do the following:

If the 5 style sheets were all application specific, I'd combine them into one file. If they were a combination of application specific style sheets and libraries (like Bootstrap), I'd only combine the application specific ones. I’d want Bootstrap (or whatever) separate to ensure it is easy to update in the future.

I never really thought much about "organization" of my CSS because I rarely write much of it. I’d run CSSLint against it, but I don’t think CSSLint deals with "organization" of a large sheet. I’d also run a tool to find unused css, like <a href="http://davidwalsh.name/uncss">uncss</a>.