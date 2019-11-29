---
layout: post
title: "The Microsoft Surface Book - Part Three"
date: "2016-10-16T14:02:00-07:00"
categories: [development]
tags: [windows]
banner_image: /images/banners/msdev.jpg
permalink: /2016/10/16/the-microsoft-surface-book-part-three
---

Welcome to my third post on my experience with the Microsoft Surface Book and Windows 10. As a reminder, this unit was given to me by Microsoft so I could test and share my experiences. You can (and should) read <a href="https://www.raymondcamden.com/2016/09/26/the-microsoft-surface-book-part-one/">part one</a> and <a href="https://www.raymondcamden.com/2016/10/03/the-microsoft-surface-book-part-two">part two</a>. I began this series talking about the hardware itself. My last post was on Windows. Now I'm going to try to describe how the SB (and Windows of course) performs as a developer machine.

<!--more-->

Regular readers of my blog already know where I spend most of my time, but I think it will be helpful to give new readers some context as to what I actually do. (And no, it doesn't involve finding cute pictures of cats. Mostly.) In general, most of my time is spent:

* Building Node.js apps with a special focus on <a href="http://loopback.io/">LoopBack</a> for building APIs. That's my main day to day job at IBM.
* Building hybrid mobile applications with <a href="http://cordova.apache.org">Apache Cordova</a> and usually <a href="http://ionicframework.com/">Ionic</a>. I'm also doing stuff with <a href="https://www.nativescript.org/">NativeScript</a>.
* Building/exploring/testing/etc the web. Yeah, that's kinda vague. Basically, as someone who lives and breathes on the web, I love to test out HTML, JavaScript, and even sometimes CSS stuff. I build a heck of a lot different demos and proof of concept apps. My main purpose for these is to help learn things for myself but I also turn most of those experiments into blog posts. 
* While I don't do it very often, I'll still do a bit of ColdFusion development. I have refused to install ColdFusion on this Windows machine as I can get by just fine with <a href="http://lucee.org/">Lucee</a> and <a href="https://www.ortussolutions.com/products/commandbox">CommandBox</a>. After near 15 years of pushing ColdFusion I've moved on and recommend other folks to do the same. (But that's for another post.)

Ok, so that's what I do. And of course, that's just what I do in front of a computer. My real passion is actually talking to developers about all this and that's where I have the most fun!

The Command Prompt
---

I think it makes sense to start off with the command prompt since that's where so much of my work starts. In general, I'll use the command prompt to prepare my project and then switch over to my editor to get stuff done. I like OSX's Terminal just fine, especially now that it supports tabs. I "prefer" Unix commands to Windows, always have, but to be honest, it's basically a "If I can choose between the two I'll prefer Unix slightly more." 

As much time as I spent in the command prompt, the native commands I use come down to - basically, <code>ls</code> and <code>cd</code>. Oh, and <code>mkdir</code>. I can say - easily - that's 95% of my usage. Of course I know there is a heck of a lot more and I use a few more commands, but honestly, I'm mainly going around the file system and that's it. I've got an Evernote entry for a few OSX commands I find useful but can't remember as I don't use them often enough.

So landing in Windows I found myself forgetting to use <code>dir</code> a few times and then got over it. In terms of the environment, I'm meh. It's not better or worse, it just plain works and I'm fine with that. I did play a bit with PowerShell where you can run ls just fine. I know PowerShell does a heck of a lot more, but again, I'll never use it.

The one thing missing that bugs me is the lack of tabs. I'm trying <a href="http://cmder.net/">cmder</a> right now, and I like how it looks (and it supports tabs), but it is a bit annoying. Sometimes the <code>ls</code> command takes 2-3 seconds to run, which isn't terribly long, but you sure as hell notice it. Also, when I open a new tab, it doesn't default to the same directory, which is what I want 95% of the time. You can try to tell it to use the same directory, but it always ignores me. (Turns out this is a <a href="https://github.com/cmderdev/cmder/issues/1001">known issue</a>.) I'm close to returning back to PowerShell just for that problem alone.

Of course, you may be wondering - what about that new Bash shell? Yes, it works. See:

<img src="https://static.raymondcamden.com/images/2016/10/wind1.png">

It works. But... I don't know. The first thing you discover is that this isn't just a shell, but a miniature VM. (Virtual Machine isn't the right term actually, it is some kind of magical 'layer' on the Windows OS.) Ok, no big deal, it runs hella fast, but that means it can't (currently) run Windows programs. So not a big deal. You can install Node (this is a great post on that: <a href="https://aigeec.com/installing-node-js-on-windows-10-bash/">Installing basic Node.js dev env on Windows 10 bash</a>) and then npm anything you need. But this will be separate from your Windows OS so if you don't dedicate yourself to using Bash you have to install stuff twice. Node stuff is generally smallish, but I was concerned about the Android SDK as I know the VMs can be large. (More on that later.) 

However, what really stopped me was when I realized I couldn't run my editors from Bash. As I said above, I use the command line to start up new projects, fire off Node crap, run Ionic, etc, but do most of my work in my editor. I'll use <code>code .</code> or <code>subl .</code> to fire up my editor from my current working directory. I do that <em>a lot</em>. This was enough to stop me from using Bash. It seems petty, but it was enough. The good news is that this is actually one of the <a href="https://wpdev.uservoice.com/forums/266908-command-prompt-console-bash-on-ubuntu-on-windo/suggestions/13284702-let-us-launch-windows-processes-from-bash">most requested features</a> and if I had to bet, I think we'll see it added soon. At that point I may return to Bash. In theory, I can run my Android VMs from the main Windows OS and Bash will be able to see it. Maybe.

All in all, the Bash feature is *damn* cool and I'm happy to see Microsoft working on it!

Working with Node
---

Yeah, it just works. I wrote a few Node scripts just for my blog and I ran into some issues where things I had on the Mac worked differently here on Windows, but they were my fault. (Hey, I'm still new to Node!) LoopBack runs just fine, but the <code>slc</code> command is oddly a bit slower on Windows than OSX. Not overall, just the initial response after typing it in and hitting enter. (I just ran across <a href="https://www.reddit.com/r/node/comments/4op7ey/npm_is_incredibly_slow_on_windows_10/">this post</a> which suggests AV may be slowing down Node and npm, so I've just added that to my exclusions. We'll see if it helps.) 

Everything I've tried so far that makes use of Node also just works, which is what I expected (ok, hoped) and has made the transition from OSX to Windows that much easier. <code>nodemon</code> works great too. 

Working with Hybrid
---

Trying to get Android running well was probably my biggest headache on Windows. For the life of me, I couldn't get virtual machines to run. They required Hyper-V or some such which required a driver that apparently wasn't signed which caused Windows to complain and it just went around and around. I wish I had kept proper notes, but it took maybe two hours of fiddling around to get things working. I had issues with the Hyper-V stuff on the Mac too, but there I could disable it - or just <a href="https://www.genymotion.com/">Genymotion</a>. But even Genymotion failed me on Windows. I got stuff working, but I had to run an un-verified Intel driver or some such. Now I get a nice red bar when booting up Windows but meh, it works. My Android VM is nice and fast, Genymotion runs well too. This smells more like an Android SDK issue than Windows, but I could be wrong.

Of course, I didn't have to worry about installing the iOS SDK. ;)

<img src="https://static.raymondcamden.com/images/2016/10/wind2.png">

"The Web"
---

My web work is 100% the same as it was on OSX. I use Visual Studio Code as my primary editor. I also use Sublime from time to time. I use httpster as my web server. I use Chrome mostly, but I'm trying to give Edge a good workout too. I didn't expect things to be a problem here and it isn't. Firefox runs just fine too. I have seen slowdowns, but mostly just the web version of TweetDeck which is also grouchy on OSX. (I'm thinking of switching to a native client on Windows. Any suggestions?)

Oh - and I forgot that Chrome syncs settings, and extensions, across installs. That's cool. I believe Firefox does as well, but that's not a feature I use (yet).

Wrap Up
---

I went into this assuming that I wouldn't have many problems. With so much of my work being web-based, or web-related, I would have been surprised to have difficulty switching platforms and therefore I really wasn't surprised. Obviously I have a heck of a lot of years of muscle memory/visual recognition that impact me using Windows, especially if I'm using both in the same day. Don't even get me started on copy/paste issues when I'm switching back and forth. But yeah, as probably everyone should expect, Windows is just fine for web developers and the SB itself is a damn fine machine to do it on. 

I want to leave off with this resource: <a href="https://github.com/felixrieseberg/windows-development-environment/blob/master/README.md">Setup Windows 10 for Modern/Hipster Development</a>. This is a great resource of dev resources for Windows users. This is how I discovered that there is a Windows package installer called <a href="https://chocolatey.org/">Chocolatey</a>. I haven't used it a lot yet, but it's pretty impressive so far.

Finally - I definitely have some overall thoughts on the SB, Windows, Apple, etc, but I'm holding off since we will apparently get news on hardware refreshes for both platforms rather soon.

Photo credit: <a href="https://www.flickr.com/photos/m-i-k-e/6020157534/">Michael Kappel</a> via <a href="https://visualhunt.com">VisualHunt</a> / <a href="http://creativecommons.org/licenses/by-nc/2.0/">CC BY-NC</a>