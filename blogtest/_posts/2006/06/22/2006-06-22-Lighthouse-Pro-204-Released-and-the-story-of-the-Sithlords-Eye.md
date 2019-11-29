---
layout: post
title: "Lighthouse Pro 2.0.4 Released (and the story of the Sithlord's Eye)"
date: "2006-06-22T23:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/22/Lighthouse-Pro-204-Released-and-the-story-of-the-Sithlords-Eye
guid: 1350
---

Tonight I'm releasing Lighthouse Pro 2.0.4. This has some features that people have been asking for awhile a now. Updates include:

<ul>

<li>I know finally have a "bug id" for each issue. This is done by using a new incrementing ID for bugs, which is unique per project, and still keeping the UUID for the primary key. Note that you <b>must</b> modify your database and run a one time script to get this update working. This new ID is now shown in various places in the UI. 

<li>Due dates have been added to issues. These are optional dates for an issue to be completed. Right now I don't do much on the UI. I did update the front page to mark overdue bugs, but if folks have other ideas, please feel free to share. 

<li>Todd Sharp shared some code to modify the emails sent out by Lighthouse Pro. Now the emails use a few headers that Outlook will recognize. (And maybe Thunderbird. I plan on testing that later.) I made a few other changes to the email as well. The subject is now more descriptive (shows the issue and the project). 

<li>I fixed a few bugs and did a few other small things not really worth mentioning.

</ul>

As always, you can download Lighthouse Pro from the <a href="http://ray.camdenfamily.com/projects/lhp">project page</a>, and <a href="http://www.amazon.com/o/registry/2TCL1D08EZEYE">donations to the wishlist</a> are appreciated.

So - the Sithlord's Eye: As my readers know, the past 12 months have been crazy for me health wise. I had the poison ivy attack. I had the torn rotator cuff. I had bronchitis. Now I have pink eye. It wouldn't bug me so much if it wasn't my right eye. My left eye is a bit weak so that with the right eye all nice and puffy, I'm operating at like 80% of my normal visual power. My throat feels like I swallowed a few razors and I'm tired all the time. I <i>should</i> be ok by CFUNITED. Worse comes to worse I'll do my three hour preso with a few cups of hot tea, but forgive me if I'm a bit more dim witted then usual and sound like a chain smoker. Oh - and yeah - the eye looks really cool. It's blood red like I'm Darth Maul or something.