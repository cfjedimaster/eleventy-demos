---
layout: post
title: "TimeTracker updated (again!)"
date: "2008-03-26T22:03:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2008/03/26/TimeTracker-updated-again
guid: 2731
---

Well I'm done. Mostly anyway. I set out when creating this application to get more familiar with SQLite, and I've certainly done that. Today I think the TimeTracker application is finally complete. A lot of folks helped out with it so I definitely can't take all (or most) of the credit. 

In this final build I added a few more features, including, the CSV export, which was pretty fun to build. Creating the CSV string was trivial. I even went the extra step and had the string properly handle data with commas and quotes.

To save the file, I used this excellent <a href="http://www.mikechambers.com/blog/2007/11/06/air-example-html-editor-with-live-preview/">article</a> by Mike Chambers. It's pretty trivial actually to ask a user to pick a file and then save the data. AIR really does make this simple. 

I also added some basic validation to the forms in the application to make it a bit more stable. 

I will warn folks though - I wrote this to learn, and I wrote it as I needed a way to track hours. But frankly, I wouldn't trust my code. If you want to <i>really</i> use it, I beg you to use the CSV export feature to make backups. I don't want to be responsible for someone losing all their data. 

It was also suggested that I put this application up on RIAForge. As I have an "in" with the manager, I was able to get the project approved pretty quickly. You can download both the AIR file and source here:

<a href="http://timetrackerair.riaforge.org/">http://timetrackerair.riaforge.org/</a>

Now on to my next AIR project.