---
layout: post
title: "Project Updates (and a small little security fix)"
date: "2009-01-11T23:01:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2009/01/11/Project-Updates-and-a-small-little-security-fix
guid: 3189
---

Two recent updates I wanted to share with folks. First, <a href="http://pdfutils.riaforge.org/">pdfUtils</a> had a minor update. One of the functions in the CFC is a getText command. This will suck out all the text from a PDF. It used to return text in an array, but if a 3 page PDF had text on pages one and three, you didn't have a way to to know that page two didn't have text. I now return an array of structures where each block of text is also associated with a page number. 

Secondly, I updated <a href="http://soundings.riaforge.org">Soundings</a>. There are a few simple bug fixes in there and one small security fix. You are only allowed to take active surveys, so the front page grabs a list of surveys where active is true and showInPublicList is true as well. However, on the page where you actually take the survey, guess what I forgot to do? Check the active state (and the valid date ranges). Nice to know I can still screw up the whole practice what ya preach thing, eh?