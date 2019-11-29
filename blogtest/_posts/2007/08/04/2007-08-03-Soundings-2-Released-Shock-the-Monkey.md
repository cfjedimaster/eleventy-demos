---
layout: post
title: "Soundings 2 Released - Shock the Monkey"
date: "2007-08-04T02:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/04/Soundings-2-Released-Shock-the-Monkey
guid: 2250
---

<img src="https://static.raymondcamden.com/images/cfjedi//logo.gif" align="left" style="margin-right: 10px">

It's very late and I'm very tired, so hopefully I didn't miss anything obvious, but I'm happy to announce the release of <a href="http://soundings.riaforge.org">Soundings 2.0</a>. Soundings is a ColdFusion Survey application. New features include:

<ul>
<li>Pagination. Now if you have a 75 question survey (yes, people did this with Soundings), you won't have 75 pages to go through. Currently the number of questions per survey is globa, but 2.1 will enable you to change this per survey.
<li>Reports can now hide questions. So if your survey has 10 questions, but the first 5 are biographical, you can hide them. I also added PDF as an option for reports.
<li>New logo by Alex McKinney and new admin UI by John Ramon. The front end UI is still rather simple because my assumption is still that folks would want the survey in their own UI.
<li>User system. Instead of just a password, the system now uses users and passwords. Currently all users have the same rights in the admin. Note to MS Access users: Stop using Access. Seriously. Anyway, if you do use Access, the users table is not in the database. If someone wants to add the table and send me the MDB back, it would be appreciated. Be sure to populate it with the default data.
<li>Soundings is a <i>very</i> old application. In 2.1 I may rip out some of my old code just because it is pretty far away from how I code now. Keep that in mind if you look at the code base.
</ul>

So what's with the "Shock the Monkey"? It is my battle cry. If you are a ColdFusion site and you resort to SurveyMonkey, shame on you. (Ok, maybe not shame, but I'm wagging my finger at you!) If you feel like Soundings ain't quite there yet - let me know. 

Ok, thats it for tonight. Tonight's build was brought to you by <a href="http://www.thriftshopxl.com/">Thriftshop XL</a> - my new mashup favorite. Now that Soundings 2 is out the door, I'll be starting work on Galleon 2. Sometime in there I'll get BlogCFC 5.9 done, and than when Galleon 2 is done, BlogCFC 6 will truly begin.

<br clear="left">