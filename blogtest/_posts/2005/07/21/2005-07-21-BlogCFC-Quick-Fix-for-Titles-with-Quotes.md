---
layout: post
title: "BlogCFC Quick Fix for Titles with Quotes"
date: "2005-07-21T12:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2005/07/21/BlogCFC-Quick-Fix-for-Titles-with-Quotes
guid: 635
---

A user reported a bug in BlogCFC involving titles with quotes in them. When you edit such an entry, the form field gets broken. Since the 3.8 release is still a few days away I thought I'd post the fix since it is all of one line long. Open up editor.cfm, find the form field for title, and simply add htmlEditFormat() around the value. Here is the modified line:

<div class="code"><FONT COLOR=TEAL>&lt;td&gt;</FONT><FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;input type=<FONT COLOR=BLUE>"text"</FONT> name=<FONT COLOR=BLUE>"title"</FONT> value=<FONT COLOR=BLUE>"#htmlEditFormat(form.title)#"</FONT> style=<FONT COLOR=BLUE>"width:100%"</FONT>&gt;</FONT></FONT><FONT COLOR=TEAL>&lt;/td&gt;</FONT></div>

Enjoy. For those who are curious - I'm working with Paul Hastings to track down a particular small issue with RSS feeds. There have been a few small changes since the RC (including this one), so the final release will be important if you are running the RC.