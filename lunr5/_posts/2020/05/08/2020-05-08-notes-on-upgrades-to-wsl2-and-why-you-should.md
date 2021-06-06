---
layout: post
title: "Notes on Upgrades to WSL2 (And Why You Should)"
date: "2020-05-08"
categories: ["development"]
tags: []
banner_image: /images/banners/windows1.jpg
permalink: /2020/05/08/notes-on-upgrades-to-wsl2-and-why-you-should
description: My notes on upgrading to WSL2
---

For a few years now (well, it feels like many years), I've been singing the praises of WSL - Windows Subsystem for Linux. It's one of the biggest reasons I switched to Windows after years on OSX. (Not the only reason, but you don't want to hear me rant about Apple.) The only real issue with WSL was the slowness of file operations. There were technical reasons for this of course, but honestly it only really bugged me when doing npm operations. 

As you know, running `npm i something` tends to fetch an incredible amount of files. In my completely unscientific testing, I'd say these operations were 2-5X slower in WSL than in the native Windows shell. Another command that would be slow at times was `git status`. Outside of that though it was just fine. I'm no command line jedi but I definitely preferred the Unix shell to cmd.exe or Powershell.

A while back Microsoft announced a major rework of WSL. You can look up the technical details if you want, but after going through the process of upgrading to WSL2 on two machines now, I can say that I'm absolutely blown away by the speed improvements. 

With that in mind, I wanted to share a few tips on the process and how it impacted my development. This isn't meant to be an introduction to WSL or a complete guide to using it, just what I encountered and what I changed in the process. I had some great help from Microsoft folks on Twitter so I definitely encourage you reaching out if you run into issues as well.

Alright, so start off by going to the [WSL2 Install](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install) guide. You'll note that you need Windows version 18917 or higher in order to use WSL2. I'm currently on the Insider Slow Ring at version 19041.208. Insider Slow Ring gives you earlier access to new Windows features and at least for me has been really stable. If you don't know what version of Windows you're on, just run winver.exe, which by the way you can do from WSL.

As part of the install process, they document how to check your WSL installs. You can do this by running `wsl -l -v`:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/wsl1.png" alt="wsl cli example" class="lazyload imgborder imgcenter">
</p>

To update, you simply run `wsl --set-version Ubuntu 2` where `Ubuntu` is the name of your distro and may be different. You may get prompted to install stuff first:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/wsl2.png" alt="Warning to install stuff" class="lazyload imgborder imgcenter">
</p>

I followed the directions there which basically had you copy and paste stuff into Powershell (be sure to run Powershell as an Administrator). I then ran the command again and got:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/wsl3.png" alt="Even more stuff" class="lazyload imgborder imgcenter">
</p>

Once again, follow the link, do the install, and you should be good. One one machine I had to tweak my BIOS, but on the other the install was good enough.

Now if you run the update command again, you should hopefully get:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/wsl4.png" alt="Final update" class="lazyload imgborder imgcenter">
</p>

On my fancy new laptop, this was rather quick, unfortunately I don't remember how long. On my older desktop, this was *not* quick. I think it took maybe 30 minutes. When done though you can quickly confirm it's been updated:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/wsl5.png" alt="Confirm WSL version" class="lazyload imgborder imgcenter">
</p>

You can also make WSL2 the default by doing this: `wsl --set-default-version 2`. I only run one distro on my machine so this really isn't an issue for me.

Ok, done! But wait, there's some very important things to note. I did some immediate testing the first time I did an update and noticed that npm was *not* faster. I was disappointed, reached out on Twitter, and was reminded that if I'm still using the main Windows filesystem (`/mnt/c`), file IO is still going to be slow. I did some testing under `~/` and right away saw a huge boost. I typically do all my work in `/mnt/c/projects`, but simply set up `~/projects` as my new place to do crap. 

This then quickly led to an issue - how do I edit files there? I've got two answers to that.

First, you can browse your distro file system in Explorer.exe by going to `\\wsl$`:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/wsl6.png" alt="WSL support in Explorer" class="lazyload imgborder imgcenter">
</p>

You'll see your distros there and can work with your file system. In my testing, I've noticed that when I copy files over to Ubuntu, I *sometimes* get a copy with ":Zone.Identifier" in it. This is known and I believe has something to do with AV stuff. You can read more about it here: [Zone.Identifier Files when copying from Windows to WSL filestructure](https://github.com/microsoft/WSL/issues/4609). For now I'm just deleting when I see them, typically before I do a git commit. 

Also, I believe I read that WSL is going to be more tightly integrated into Explorer in the future. So there's that.

The next thing was getting support for Visual Studio Code. This was also pretty easy if you add the [Remote-WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) extension. 

You add that extension, then run "Remote-WSL: New Window". This will open a new window and do a one time download of support stuff. For me it took about 2 minutes I think. When done, you'll have nothing in the file explorer - at first:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/wsl7.png" alt="VSC File Explorer under WSL" class="lazyload imgborder imgcenter">
</p>

Note that it says "Connected to remote" and it has a "WSL:Ubuntu" marker on the lower left corner. Clicking to open a folder will bring up UI on top to browse:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/wsl8.png" alt="File open UI" class="lazyload imgborder imgcenter">
</p>

This was a bit weird to me at first, but once you select a folder, everything returns to normal. So here's a screen shot of my editor right now. You can see the "WSL" marks so I know it's in the Ubuntu file system, but outside of that, everything is "normal":

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/wsl9.png" alt="File UI" class="lazyload imgborder imgcenter">
</p>

But wait - there's one more nit. I was testing with a Vue project and noticed I had "lost" `.vue` file support. Turns out you may have to reinstall some extensions. Basically if an extension does anything UI wise, like color schemes, it will work. Other extensions have to be installed again.

This - and more - is all documented here: [Developing in WSL](https://code.visualstudio.com/docs/remote/wsl). Honestly once I realized what was going on I didn't worry about it. VSCode makes it super easy to install extensions.

So far, that's it. I absolutely recommend upgrading, but as always, do with caution. Everything I'm doing under WSL is Git-based so I could completely lose everything and not really be impacted. Enjoy!

Oh, as a quick note, I strongly suggest you try out the new [Windows Terminal](https://github.com/microsoft/terminal). It's highly configurable, open source, and works great!

<i>Header photo by <a href="https://unsplash.com/@chris_reyem?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Chris Reyem</a> on Unsplash</i>