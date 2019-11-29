---
layout: post
title: "Tip for PhoneGap Users - Modify the WWW template"
date: "2013-01-24T15:01:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2013/01/24/Tip-for-PhoneGap-Users-Modify-the-WWW-template
guid: 4839
---

Now that I've gotten comfortable with PhoneGap's <a href="http://docs.phonegap.com/en/2.3.0/guide_command-line_index.md.html#Command-Line%20Usage">command line</a> I'm finding myself much more productive when building quick demos. The previous link will tell you more, but as a quick example, this is how I'd quickly dump out an IOS project.
<!--more-->
<script src="https://gist.github.com/4627423.js"></script>

"ioscreate" is not the name of a PhoneGap binary, but simply a symbolic link to the create binary from the PhoneGap iOS directory. 

I then CD into the folder, run "subl www" to open the www folder in Sublime, and run "cordova/build && cordova/emulate" to run the build and emulate commands. This pops open the new application in my iOS simulator.

All of this takes about 2 seconds and works great, except for one small nit. By default, the new project has this fancy HTML.

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Jan 24, 2013 2.39.21 PM1.png" />

You can't see it - but the green "Device Is Ready" is pulsating. It's very hypnotic. 

What this means is that I actually spend <i>more</i> time "cleaning" the HTML, JavaScript, and CSS then I do actually creating the new project. 

Luckily there is a quick fix for this. Given your desired platform, go to where you installed PhoneGap and you will see a "bin" folder and beneath that, a "templates" folder. There should be one folder underneath it.

<img src="https://static.raymondcamden.com/images/screenshot59.png" />

See the www folder? Just edit the contents within there to your liking and the next time you create a project, your modifications will be used. Here's my version. 

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Jan 24, 2013 2.46.35 PM1.png" />

Ok, that's kinda boring, but I've got a nice blank HTML, JS, and CSS file ready to go in my editor.