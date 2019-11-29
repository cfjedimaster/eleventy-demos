---
layout: post
title: "Announcing CFAM - ColdFusion Administrator Mobile"
date: "2010-07-28T17:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/28/Announcing-CFAM-ColdFusion-Administrator-Mobile
guid: 3891
---

So <a href="http://www.cfsilence.com">Todd Sharp</a> and I have been dropping hints over Twitter the last few days about a secret project. Today at CFUNITED I showed it off for the first time. CFAM, or ColdFusion Administrator Mobile, is a mobile optimized version of the ColdFusion Administrator. Imagine that you're at a bar. Your client calls to tell you the site is down. You open the site with your mobile device and confirm that - yes - the site is down. It would be helpful to be able to hit up the CF Admin and check various things to diagnose what the problem is. CFAM provides a nice mobile optimized version of the CF Administrator focused on the more common tasks you may do while debugging. Features include:

<ul>
<li>List DSNs and provide a verification button
<li>Enable/Disable Trusted Cache and allow you to clear it
<li>Enable/Disable Server Monitor and view settings
<li>Tail Logs
<li>View email in the Undelivered folder and respool it
<li>And much more more
</ul>

This is still a work in progress so we aren't quite ready to release it, but here are some screen shots to give you an idea. This is built in jQTouch and runs fine on the Android or iPhone. 

<img src="https://static.raymondcamden.com/images/Screen shot 2010-07-28 at 3.34.46 PM.png" />
<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-07-28 at 3.35.09 PM.png" />
<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-07-28 at 3.35.20 PM.png" />

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-07-28 at 3.35.35 PM.png" />

FYI - that chart up there is "live" - it updates every 4 seconds. You can also watch a video of the app in action <a href="http://www.screencast.com/users/jedimaster/folders/Jing/media/2e45e047-da09-485c-9bcf-9f8eb8b0c8fd">here</a>. Note that this is a bit out of date from what is currently supported. 

This will be free, open source, and hosted up on RIAForge. It is written for ColdFusion 901.