---
layout: post
title: "Cross Operating System ColdFusion Development Guide (First Draft)"
date: "2009-05-05T22:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/05/05/Cross-Operating-System-ColdFusion-Development-Guide-First-Draft
guid: 3342
---

Wow, that title is a heck of a lot more serious than I intended it to be. A few days ago I was working with some code Dan Swizter had written for BlogCFC. I ran into an issue when code he had written failed to run on my Mac. It turned out to be a simple enough mistake, but it occurred to me that it may make sense to create a simple list of development guidelines for ColdFusion programmers to ensure maximum portability of their web applications across Windows, Linux, and Mac platforms. I'm just starting this guide off with a few tips, and I hope my readers can help flesh it out. Once enough content is gathered, I'll create a proper document for it and link it up from the Guides pod to the right. So without further ado, here are some things to keep in mind when writing your code.

1) When it comes to creating file paths, don't worry about \ versus /. Just use /. The / character will work on Windows, OSX, and Linux systems. Yes, you can write code to check for the proper file path separator, but if you are just reading or writing to a file, why worry about it?

2) Don't let case sensitivity ruin your day. On more than one occasion I've worked with code that was fine on OSX and Windows, but failed on Linux because of case sensitivity issues. The simplest solution is to simple lowercase everything. Ie: klingon.cfc, ships.cfm, index.cfm, etc. Of course, the exception to this are the files ColdFusion use for application-specific functionality: Application.cfc, Application.cfm, and onRequestEnd.cfm. Everything else though should be lowercased. 

3) Minimize the use of operating system specific features called via cfexecute. This may be out of your control, but if you write CFML that makes use of cfexecute to run command line code, you want to ensure you are using a command line tool that runs on multiple operating systems, and runs with a similar API. You may not be able to though, so at minimum, this is a perfect example of something that should be carefully documented for your client so they are aware of the dependency. 

Ok, what am I forgetting folks? Try to focus on things that should apply to most cases. Odd edge cases may not make sense in a general document like I the one I want to create. (But those tips could always be added to an Errata section). 

<img src="https://static.raymondcamden.com/images//im_a_pc_mac_linux_bsd_tronguy_hippie.jpg">