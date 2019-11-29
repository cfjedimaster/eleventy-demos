---
layout: post
title: "PhoneGap Developer App"
date: "2014-04-21T15:04:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2014/04/21/PhoneGap-Developer-App
guid: 5207
---

<p>
At the end of last week a <i>really</i> interesting new PhoneGap tool was launched - the <a href="http://app.phonegap.com/">PhoneGap Developer App</a>. The PG Developer App is a "shell" application that you can install on a real device (both <a href="https://play.google.com/store/apps/details?id=com.adobe.phonegap.app">Android</a> and <a href="https://itunes.apple.com/app/id843536693">iOS</a> with Windows Phone coming soon) and test with a local copy of your code. You can skip the SDK. You can test iOS on Windows. All you need is the core PhoneGap CLI and you are good to go. Let's take a quick look.
</p>

<p>
First - ensure you have installed the phonegap CLI via npm. Ensure you have the latest version (see my <a href="http://www.raymondcamden.com/index.cfm/2013/9/5/How-do-you-check-and-update-your-PhoneGap-version-in-30">guide</a> if you are new to npm) and then create a new project.
</p>

<p>
<img src="https://static.raymondcamden.com/images/ss14.png" />
</p>

<p>
At this point you do <strong>not</strong> have to add a platform. Next - fire up the server:
</p>

<p>
<img src="https://static.raymondcamden.com/images/ss23.png" />
</p>

<p>
Make note of the IP address. It should be obvious, but this tool requires that your mobile device be able to "see" your development machine. If you aren't on the same network (or on one of those cluttered free WiFi networks) you may have an issue. Ok, now, run the PhoneGap you downloaded to your device. Here's mine running on my iPhone.
</p>

<p>
<img src="https://static.raymondcamden.com/images/ss32.png" />
</p>

<p>
Simply enter your IP address and hit connect. What you're seeing now in the app is the code from <i>your</i> project. If you switch back to your command prompt, you can see a butt load of messages - essentially an access log of requests. Fire up your favorite editor, make a change, and just click save.
</p>

<p>
<img src="https://static.raymondcamden.com/images/ss41.png" />
</p>

<p>
It <i>should</i> update automatically, but if it doesn't, try a four finger tap. But to be clear, you do <strong>not</strong> have to go to the command line and run anything. It just - plain - happens. 
</p>

<p>
Another interesting feature of the Dev App is that will automatically load all the core plugins. So if you want to test the Camera API, you just do it. No need to install the plugin manually. This is cool... but I kinda worry it may trip people up when they <strong>stop</strong> using the Dev App. I tend to be a worry wart though. 
</p>

<p>
Another issue is that you cannot use remote debugging with it. By that I mean Safari Remote Debugging or Chrome Remote Debugging. Weinre works fine with it though.
</p>

<p>
So - thoughts? I've said before that I tend to focus on the Cordova CLI, especially when I teach, but I <strong>definitely</strong> see me demonstrating this next time I present on PhoneGap/Cordova.
</p>