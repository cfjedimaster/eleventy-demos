---
layout: post
title: "Modifying the PhoneGap Template in 3.3 (and higher)"
date: "2014-01-31T07:01:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2014/01/31/Modifying-the-PhoneGap-Template-in-33-and-higher
guid: 5141
---

<p>
This is my third blog entry now on how to modify the default template when creating a new PhoneGap project. Previously you had to find where the default template was installed and modify it there - which also meant that when you updated CLI tools you lost your modifications. In the latest versions of the CLI tooling, <strong>specifically for Cordova</strong>, you now have a --src option to specify a source folder for your project.
</p>
<!--more-->
<p>
In the screen shot below, I've got a folder called source. I've made a new project and told cordova to use that folder as the source of my www folder. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot15.png" />
</p>

<p>
And that's it. Pretty simple, right? I'll be creating a good blank project for my demos and placing it in Dropbox. Note that this option does <strong>not</strong> exist for the PhoneGap CLI at this time. Finally, don't know how to check your version and upgrade? Check my blog entry here: <a href="http://www.raymondcamden.com/index.cfm/2013/9/5/How-do-you-check-and-update-your-PhoneGap-version-in-30">How do you check (and update) your PhoneGap version in 3.0?</a>
</p>