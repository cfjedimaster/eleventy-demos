---
layout: post
title: "Cordova's copy-from tip"
date: "2014-11-14T10:11:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/11/14/Cordovas-copyfrom-tip
guid: 5350
---

<p>
Yesterday I was proof-reading a blog post about an update to the PhoneGap CLI (which you should read - <a href="http://phonegap.com/blog/2014/11/13/phonegap-cli-3-6-3/">PhoneGap CLI 3.6.3</a>) and I discovered something interesting. For a while now the Cordova CLI has had the ability to create a new project based on another. This is great because the default Cordova/PhoneGap application annoys the heck out of me. 
</p>
<!--more-->
<p>
You can see this feature by typing <code>cordova help create</code>. Here is how the feature is documented:
</p>

<blockquote>
--copy-from|src=<PATH> ... use custom www assets instead of the stock Cordova hello-world.
</blockquote>

<p>
Ok, nice and simple, right? So I built my own skeleton application with a minimal amount of code and just carried on my happy way. While reading that article about PhoneGap's update though I discovered this feature actually does <strong>two</strong> things.
</p>

<p>
If you point --copy-from at a folder that is <strong>not</strong> a Cordova application, it will copy the assets into the www folder of your new project.
</p>

<p>
If you point --copy-from at a folder that <strong>is</strong> a Cordova application, it will copy the www folder, the hooks folder, and the config.xml file. I had no idea that this was supported, and while I probably won't use the feature that often, it is good to know it exists. (And I'm going to file a bug report right now for the Cordova CLI to update the help text.)
</p>

<p>
p.s. As a reminder, definitely read that <a href="http://phonegap.com/blog/2014/11/13/phonegap-cli-3-6-3/">article</a> about the PhoneGap CLI update. I primarily use the Cordova CLI but the PhoneGap one now has some features that Cordova does not. One of them I really like - if you try to run a platform that doesn't exist, it will simply add it for you. Nice. 
</p>