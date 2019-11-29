---
layout: post
title: "Updating PhoneGap Databases"
date: "2013-08-14T12:08:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2013/08/14/Updating-PhoneGap-Databases
guid: 5006
---

Before we get started, I should point out that today's blog entry isn't really PhoneGap specific. Any browser that supports <a href="http://www.w3.org/TR/webdatabase/">WebSQL</a> can make use of this entry. As WebSQL is a dead standard, I pretty much only use it in PhoneGap.
<!--more-->
A commenter <a href="http://www.raymondcamden.com/index.cfm/2011/10/20/Example-of-PhoneGaps-Database-Support#cE586958D-0F58-7266-2EDE1029D72BAE90">asked</a> if I could talk about how you would update an existing database. I thought it was going to be a pretty easy answer, but it turned into a royal cluster-you-know-what. This is something that IndexedDB actually makes <strong>far</strong> easier. That aside, let's talk about the issue.

When you open a database in PhoneGap, you typically use something like this:

<script src="https://gist.github.com/cfjedimaster/6232231.js"></script>

This is pretty much exactly what the <a href="http://docs.phonegap.com/en/3.0.0/cordova_storage_storage.md.html#Database">PhoneGap docs</a> show so I won't spend much time on it. That log() function there was just a way for me to quickly handle displaying information in the iOS Simulator.

This is what I've always done and it worked fine. But now we have to ask - what happens when you want to modify the DEMO table to include a new column?

You could use a SQL call to select the column - see if it throws an error - and then run an ALTER statement. That smells bad, but would work just fine. It's going to slow down your application startup but probably not noticeably. If you don't like try/catch, you could select * and see if the column shows up.

But - if you check the docs you'll notice a changeVersion method. Unfortunately the PhoneGap docs are a bit unclear about how you would actually use this. 

Apple (surprise surprise), actually has a good doc on this (<a href="http://developer.apple.com/library/safari/documentation/iphone/conceptual/safarijsdatabaseguide/UsingtheJavascriptDatabase/UsingtheJavascriptDatabase.html#//apple_ref/doc/uid/TP40007256-CH3-XSW1">Working with Database Versions</a>) and it is helpful, but I still struggled wrapping my head around the proper flow.

First - the proper API doc for changeVersion is:

db.changeVersion(oldversion, newversion, alterfunc, errorfunc, successfunc)

Where alterfunc is a method that you can use to alter your database. It's passed a transaction object. So far so good. So I tried this:

<script src="https://gist.github.com/cfjedimaster/6232317.js"></script>

And it worked... once. The next time I ran the application it threw an error on the open statement. Why? Because it recognized the db I had now was version 2. 

Um... ok. So luckily the Apple docs mentioned that when you open a database you can pass an empty string and it always works. Ok, cool, so let's try this:

<script src="https://gist.github.com/cfjedimaster/6232331.js"></script>

This worked - again - once. It was also bad for multiple reasons. Notice I still call populateDB as a setup function. I'm running this <strong>after</strong> my database update call. populateDB only makes a table if it doesn't exist, but for new users it could run after the version call. 

But wait - it gets better. I thought changeVersion(x,y) would be a cool way to say, "If I'm version x, change my database version to y". That would rock, right?

<img src="https://static.raymondcamden.com/images/download.jpg" />

Nope. Not at all. changeVersion throws an error if the current version doesn't match old version. So to change from 1 to 2 you have to first check to see if your database is on version 1. The PhoneGap docs don't make this very clear, but your database variable does have a version number property.

So - I think we're good now. So let's pretend I'm building the app today. Here is the first version of the code.

<script src="https://gist.github.com/cfjedimaster/6232378.js"></script>

Unlike my original version, I am now using an implicit version change that should always run for the first time users. This is actually better than the version above as we never run populateDB. To me it was an acceptable 'cost' but you can skip it using changeVersion. So - yeah that's good. 

So imagine this in the wild now. Users have downloaded and installed it. I realized I forgot a column and need to add it. Here's how I handle that - and again - I have to handle both old users and new users.

<script src="https://gist.github.com/cfjedimaster/6232406.js"></script>

You will notice that in the first changeVersion, we go from nothing to version 2, and the table contains a foo column. 

The second changeVersion handles folks on v1. It runs just the alter.

And... that's it. I don't want to think about this anymore so I'm going to wrap it here. ;) Hope this helps.