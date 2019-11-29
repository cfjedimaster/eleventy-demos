---
layout: post
title: "Quick tip for installing Bash on Windows 10"
date: "2016-08-11T08:21:00-07:00"
categories: [development]
tags: []
banner_image: 
permalink: /2016/08/11/quick-tip-for-installing-bash-on-windows-10
---

To be honest, I can't remember the last time I wrote a blog post about Windows. I've been a Mac person for about five years now, and while I certainly didn't dislike Windows, I've been happy with OSX and haven't really looked back. But lately I've been more and more interested in Windows (and Microsoft as a whole). I could go on and on about all the cool stuff they've been doing lately, but let me get to the point of this post. The most recent update to Windows 10 - "Anniversary Edition" (can we maybe just do Win10AE for short?) includes the ability to run a Bash shell natively within the OS. I've done that in the past with Cygwin, but I was really excited to test it out as an "official" part of Windows.

I've got a Surface 3, which is a damn nice piece of hardware that has got me seriously considering picking up the Surface Book, and last night I installed the AE update.

There's a bunch of blog entries on how to get the new shell, with this one from How-To-Geek being the one I used: [How to Install and Use the Linux Bash Shell on Windows 10](http://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/) (As an aside, I'm breaking my rule of linking to sites that use coverup modals. I still hate them, but the post *was* helpful.)

I followed the instructions and bash.exe was installed pretty easily, but I ran into a weird problem. Every time I tried to launch it, it would automatically close. I know I've seen Windows command line programs do that in past, but I wasn't sure what to do.

On a whim, I tried running bash.exe from cmd.exe, and from there I got an error about disabling the legacy console. That was the kicker. Go into properties and disable it:

![Legacy console](https://static.raymondcamden.com/images/2016/08/legacy.jpg )

Then I just ran it again and it began another install process:

![Install](https://static.raymondcamden.com/images/2016/08/legacy2.png )

Once done - it works as expected:

![Wooooot!](https://static.raymondcamden.com/images/2016/08/legacy3.png )

As an aside, it looks like cmd.exe was significantly improved as well, which is pretty nice: [Console Improvements in the Windows 10 Technical Preview](
https://blogs.windows.com/buildingapps/2014/10/07/console-improvements-in-the-windows-10-technical-preview/)