---
layout: post
title: "Calling a PowerShell Script from WSL"
date: "2017-09-25T13:04:00-07:00"
categories: [development]
tags: [windows]
banner_image: 
permalink: /2017/09/25/calling-a-powershell-script-from-wsl
---

Just a quick post to share a few things I learned this morning about PowerShell scripts and Windows Subsystem for Linux. I was trying to find a CLI way to set my screen resolution. I'm going to be recording some videos and wanted a quicker way to enter the right resolution, and then return.

My Googling turned up this blog post, [Hey, Scripting Guy! How Can I Change My Desktop Monitor Resolution via Windows PowerShell?](https://blogs.technet.microsoft.com/heyscriptingguy/2010/07/07/hey-scripting-guy-how-can-i-change-my-desktop-monitor-resolution-via-windows-powershell/). While most of the post didn't really make sense to me, it led me to this this code listing, [Set-ScreenResolution](https://gallery.technet.microsoft.com/ScriptCenter/2a631d72-206d-4036-a3f2-2e150f297515/). I took the code and saved it as `screenres.ps1` and tried to run it via PowerShell, but when I did, nothing happened. 

Turns out - the script was incomplete. It's basically (and this is my take on it) a function that is meant to be the *top* of a script file. The script needs to actually *call* the function before it will do anything. 

So in other words, after saving his code and opening it up in my editor, I then added this to the bottom: 

	Set-ScreenResolution -Width 1360 -Height 768

I saved it as `screenrespreso.ps1` and was good to go. I then edited the width and height for my normal resolution (3840x2160) and saved that as `restorepreso.ps1`. 

Probably obvious to anyone who has used PowerShell scripts before, but definitely confusing for me.

And of course - you can run this from WSL. Just add -File to the command:

	powershell.exe -File "c:\users\ray\Desktop\restorescreenres.ps1"  

Note that you have to include the `.exe` at the end and the path is the "real" Windows path, not the WSL version of it under `/mnt/c`. I could make this easier with aliases of course.