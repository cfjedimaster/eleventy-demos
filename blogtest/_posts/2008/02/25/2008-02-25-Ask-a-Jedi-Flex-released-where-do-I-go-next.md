---
layout: post
title: "Ask a Jedi: Flex released - where do I go next?"
date: "2008-02-25T12:02:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2008/02/25/Ask-a-Jedi-Flex-released-where-do-I-go-next
guid: 2673
---

Jason asked a very interesting question considering last night's releases by Adobe.

<blockquote>
<p>
If you were a CF developer, but wanted to start working with Flex 3 (having little or no experience with it) how would you go about starting?  There are a dizzying array of links, tutorials, etc out there (lots of older CF and Flex versions).  I like to focus on getting up and running with CF 8 and Flex 3, for obvious reasons.  You know of a good place to start?
</p>
</blockquote>
<!--more-->
So you are right - there are a crap load of links out there. It can be a bit daunting. I'm sure I'll get a lot of comments here, but here is my thinking.

First off - if you are 100% new to Flex, I would <b>not</b> worry about ColdFusion right now. Blasphemy, I know, but seriously, if you are going to learn something completely new, you want to start simple. The <a href="http://www.adobe.com/support/documentation/en/flex/">Flex documentation</a> doesn't cover communicating with back end systems till chapter 38. I'd get comfortable with Flex's controls first. At the end of the day, whether you have real data populating a drop down or fake data, that's a trivial concern. 

Speaking of the docs, download the Developer's Guide PDF. It weighs in at a mighty 1,328 pages. That's a lot of reading material to keep you busy. 

As for classes, I've been though the Adobe Flex 2 class. It kicks butt. I'd be shocked if they have a Flex 3 class yet, but in general, Adobe Certified instructors/classes are <i>very</i> high quality. It wouldn't hurt signing up for a class either.

So getting back to ColdFusion, the documentation talks about the multiple ways Flex can access server side data. You will, most likely, want to use Flash Remoting. That is covered in "Using RemoteObject components". When you see RemoteObject, think Flash Remoting. What's nice about ColdFusion (among many other things) is that you can simply reuse the CFCs you've been (hopefully) writing already. 

Anyway - I guess my main point is - I'd not focus on hooking up Flex to ColdFusion right away. I'd instead spend time on getting the basics first. I'm open to criticism on this though.