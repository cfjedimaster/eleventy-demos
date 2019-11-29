---
layout: post
title: "PhoneGap 3.0 Released - Things You Should Know"
date: "2013-07-19T17:07:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2013/07/19/PhoneGap-30-Released-Things-You-Should-Know
guid: 4987
---

Today at <a href="http://pgday.phonegap.com/us2013/">PhoneGap Day</a> version 3.0 was released. This is a pretty significant release in terms of the underlying architecture and there are some things you should know.
<!--more-->
First - let's start with a few links you should read:

<a href="http://phonegap.com/blog/2013/07/19/adobe-phonegap-3.0-released">Adobe PhoneGap 3.0 Released</a><br/>
<a href="http://shazronatadobe.wordpress.com/2013/07/19/whats-new-in-cordova-ios-3-0-0/">What's New in Cordova iOS 3</a><br/>
<a href="http://www.infil00p.org/introducing-cordova-3-0-0-for-android/">Introducing Cordova 3 for Android</a>

Second - there is a new command line tool you will use (or can use I should say, the cordova-cli still works), phonegap. The <a href="http://phonegap.com/install/">installation</a> for this is rather trivial if you've got npm already installed:

<blockquote>
sudo npm install -g phonegap
</blockquote>

This may seem obvious, but <strong>phonegap cli is different from cordova cli</strong>. Be sure to use the built-in help and sniff around a bit so you see how it does things compared to cordova. This shouldn't take more than a few minutes and you will probably trip up a few times. Thank you, muscle memory.

One of the coolest aspects of the new command line though is that it fully supports PhoneGap Build. What this means is that you can use the command line to build via your terminal <strong>with and without the SDKs</strong>. Or heck, even if you do have the SDKs and want to use PhoneGap Build, the new PhoneGap cli makes this trivial.

Another useful feature is that if you run phongap as is, you get a quick checklist of what SDKs/platforms you can use locally:

<img src="https://static.raymondcamden.com/images/Screenshot_7_19_13_4_09_PM.png" />

<strong>OK - READ THIS CAREFULLY</strong>

This is the number one thing that I think will trip people up. One of the new things in PhoneGap 3 is a revised plugin architecture. All of the previously core features, like the Camera for example, are plugin based.

When I realized this, my first question was whether a virgin project would include support for the core stuff and expect developers to strip things out (if they cared) or if you would need to implicitly add in support for what you want to use.

Turns out - you need to add in what you want to use. What does that mean practically? As an example, if you try to use navigator.camera.getPicture <strong>it will fail</strong> with the "out of the box" project made at the command line. 

To fix this you can add in the plugin of course. This takes two seconds and can be done via the CLI. This may not be very clear via the docs. First, the <a href="http://docs.phonegap.com/en/3.0.0/guide_cli_index.md.html#The{% raw %}%20Command-line%{% endraw %}20Interface">command line</a> docs do talk about the core features as plugins and give you the commands to use... but for cordova, not phonegap.

So as an example, this is the cordova way to add the plugin: cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git 

And this is how you would do it via phonegap: phonegap local plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git

The net result is that when you start your PhoneGap project, you will want to think ahead of time about the features you need - the previously "just there" features - and add them via the CLI. (As an FYI, it is super easy to remove these plugins too. So if you added the Camera and realize you don't need it, you can quickly remove it.)

For a full list of these plugins, see below. I copied this directly from the link above, so it may change, so please see the link for the most up-to-date version.

Basic device information:<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git

Network and battery status:<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-battery-status.git

Accelerometer, compass, and geolocation:<br/> 
https://git-wip-us.apache.org/repos/asf/cordova-plugin-device-motion.git <br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-device-orientation.git<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-geolocation.git

Camera, media capture, and media playback:<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git<br/> 
https://git-wip-us.apache.org/repos/asf/cordova-plugin-media-capture.git<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-media.git

Access files on device or network:<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-file.git<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-file-transfer.git<br/>

Notifications via dialog box or vibration:<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-vibration.git

Contacts:<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-contacts.git<br/>

Globalization:<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-globalization.git

Splash Screen:<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-splashscreen.git

In-app browser:<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git

Debug console:<br/>
https://git-wip-us.apache.org/repos/asf/cordova-plugin-console.git

p.s. I've not no idea what the debug console is. Going to research.