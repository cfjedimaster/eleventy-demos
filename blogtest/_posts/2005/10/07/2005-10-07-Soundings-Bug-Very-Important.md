---
layout: post
title: "Soundings Bug - Very Important!"
date: "2005-10-07T17:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/07/Soundings-Bug-Very-Important
guid: 836
---

I was working with a user of Soundings today and ran into a bug. It was a combination user error and my code not checking something. When you add questions to a survey, you give each question a rank, which is really just the number/order it displays in the survey. My code does <i>not</i> validate that the rank is unique. If you have two (or more) questions with the same rank, problems <i>will</i> occur, and they will be hard to debug. In fact, there is a chance <b>no</b> bug will occur. That is why this is such a bad bug. 

So normally I'd post the fix, but as I'm swamped, it may be a day or two before I get this done, and I wanted folks to know asap. When I post the fix, I'll try to get matrix questions included since I know that is something people have been asking for. I'm also going to tweak the display of multiple choice questions a bit as well.