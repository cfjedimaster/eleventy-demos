---
layout: post
title: "Quick Note: PhoneGap Build issue"
date: "2012-06-25T16:06:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2012/06/25/Quick-Note-PhoneGap-Build-issue
guid: 4657
---

The more frustrated I get with Android and tooling on my machines the more I fall in love with <a href="http://build.phonegap.com">PhoneGap Build</a>. It is - without a doubt - the easiest way to pump out native installable apps for your mobile projects. I've been working on a simple app for a friend of mine and when I finally switched from Eclipse-based builds to the Build service it just made everything better. Even easier - he could get downloads from Build whenever he wanted and share it with others. 

I did run into one issue though that I wanted to make people aware of. For my application, I'm using the upload as zip option. In order for the correct cordova.js file to be included in your binary installers, you need to use a script tag like so:

&lt;script src="cordova.js"&gt;&lt;/script&gt;

The Build process will take care of ensuring the right file is included with the bits. However, if you are testing your application on the desktop while you build the project, you will most likely have a copy of the JavaScript file in your folder. You can't test device-specific functionality, but I had a copy of the JavaScript file there just to prevent Chrome from complaining about it.

When I created a zip of my code and uploaded it to Build, the normal behavior of replacing the JS file was <i>not</i> done. I think Build probably made the right decision and said, "If you specifically included this file then you must know what you're doing."

As soon as I tested my code on a real device I got errors on startup.

For me - the solution was to skip creating a zip of the entire www folder. Instead, I went into the folder, did a quick select all, and deselected the cordova.js file. 

Hopefully this will help others if they run into the same issue. For this project I'm not using a public SVN/Git repo so I'm not sure if it would be an issue there.