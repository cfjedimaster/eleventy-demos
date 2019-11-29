---
layout: post
title: "Can I do it in a CFC?"
date: "2007-04-26T17:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/26/Can-I-do-it-in-a-CFC
guid: 1984
---

Matt asked a question today and since I actually have gotten some work done today, I figured I'd blog about something besides Ubuntu, Hard Drives, and why I can't wait till I'm 100% Mac-ified. Anyway, here is his question:

<blockquote>
I have a best practices question: is it bad practice to call a custom tag from a CFC, also is it bad practice to have HTML in a CFC.
</blockquote>

First - check out the CFC Guide I have here: 

<a href="http://www.raymondcamden.com/page.cfm/CFC-Resources">CFC Resources</a>

I find that folks tend to miss my Guides pod to the right so I thought I'd point it out. 

Is it bad practice to call a custom tag from a CFC? Not at all. You can call other CFC methods, other CFCs, custom tags, web services, etc. You <i>may</i> want to task if it makes sense to move that custom tag's logic into a CFC method however. 

Your second question could be read two ways: 

Is it ok to return HTML from a CFC method?

and...

Is it ok to have HTML in a CFC method?

The second version matches what you said - but I believe you meant the first version. In general folks almost never do this. The idea is - let the CFC handle logic (getProducts) and let you front end handle display. 

That being said - I've done the second way (html in a CFC) in the past when I need to send formatted emails from a CFC, like for <a href="http://lighthousepro.riaforge.org">Ligthouse Pro's email reports</a>. It <i>would</i> be possible to pass in a template of some sort, but frankly that seems like too much trouble.