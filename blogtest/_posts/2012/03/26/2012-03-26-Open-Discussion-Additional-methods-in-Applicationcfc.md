---
layout: post
title: "Open Discussion - Additional methods in Application.cfc"
date: "2012-03-26T15:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/03/26/Open-Discussion-Additional-methods-in-Applicationcfc
guid: 4569
---

A few minutes ago <a href="http://henke.ws/">Mike Henke</a> asked an interesting question on Twitter. I suggested a Google+ post to allow others to hash it out, but as he isn't a big user of it, he suggested I blog it. I thought it was an interesting question, and I definitely have an opinion on it, but I'm very curious to see what others think. 

Ok - so his question was simple: 

<blockquote>Is it "bad" practice to put functions in Application.cfc? Does it pass a smell test?</blockquote>
<!--more-->
Since an Application.cfc file normally has methods in it, we should clarify the question a bit. Mike is asking if it makes sense to put <i>additional</i> methods in there. In other words, methods that aren't called by the server (onApplicationStart, onSessionEnd, etc). 

My opinion is that you should not put additional methods in there unless they directly relate to the "documented" core events. So for example, I can see a case where onRequestStart and onRequestEnd may need to use similar logic. It makes perfect sense to abstract out that logic into a method they can both call. In all things try your best to follow the DRY (Don't Repeat Yourself) rule. 

Outside of that though I would not put other methods in there. Keep the file focused on what it should be - handling the events for your application.