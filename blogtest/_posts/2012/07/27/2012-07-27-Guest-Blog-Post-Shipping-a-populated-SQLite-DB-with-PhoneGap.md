---
layout: post
title: "Guest Blog Post: Shipping a populated SQLite DB with PhoneGap"
date: "2012-07-27T18:07:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2012/07/27/Guest-Blog-Post-Shipping-a-populated-SQLite-DB-with-PhoneGap
guid: 4687
---

This is my second "Guest Blog Post" for the month. Sorry I've been a bit slow on my own content lately! Today's post comes from Scott Buckel. He and I shared a conversation earlier this month about databases and PhoneGap. PhoneGap makes it pretty darn easy to create and work with a database in your application. What isn't so trivial is actually shipping a prepopulated database with the app itself. I wasn't able to help him as much as I'd like - but he worked at it until he came up with a solution. Here is what he discovered.
<!--more-->
These instructions are very raw, and not optimized.

<ol>
<li>I used this plugin: <a href="https://github.com/chbrody/Cordova-SQLitePlugin/">https://github.com/chbrody/Cordova-SQLitePlugin/</a>

<li>Copy your sqlite db file to /assets folder of PhoneGap.

<li>Then, follow instructions here:  <a href="http://gauravstomar.blogspot.com/2011/08/prepopulate-sqlite-in-phonegap.html">http://gauravstomar.blogspot.com/2011/08/prepopulate-sqlite-in-phonegap.html</a> to copy the file to native storage.  Change  this.copy("Databases.db","/data/data/"+pName+"/app_database/");
<ol>
<li>Instead of Databases.db, use your database filename.
<li>Instead of app_database, use "databases"
<li>You'll probably want to delete the file from /assets, since it is duplicated and no longer needed.  My app was double the size it needed to be.
</ol>

<li>(Not sure if this step is necessary, I'm getting out of the office for the day).  Edit SQLitePlugin.java
<ol>
<li>Lines 176, I edited 1==1 so that if statement is always executed.  Line 179 I changed this.setStorage(appPackage, false); to  this.setStorage(appPackage, true);
</ol>
<li>You can then use the following command to open the DB and use it as any other PhoneGap database
<ol>
<li>var db = window.sqlitePlugin.openDatabase("[full_database_name_including_extension]", "1.0", "PhoneGap Demo", 200000);
</ol>
</ol>

10 hours of work later, I have a working database!

Feel free to use this information on a blog, I feel it would help a LOT of people out.  Step #4 is weird, I'm sure there's a "prettier" way to do it.  If used, just give Scott Buckel @ <a href="www.corporatezen.com">Corporate Zen</a> credit please :).