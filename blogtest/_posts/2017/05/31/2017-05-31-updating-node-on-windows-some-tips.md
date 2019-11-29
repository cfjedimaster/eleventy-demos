---
layout: post
title: "Updating NodeJS on Windows - Some Tips"
date: "2017-05-31T08:15:00-07:00"
categories: [javascript]
tags: [nodejs]
banner_image: 
permalink: /2017/05/31/updating-nodejs-on-windows-some-tips
---

I love Node, but I swear every time I go to update it I end up running into one problem or another. And this has been true for both Windows and OSX. I went through an update yesterday for the [release of Node 8](https://nodejs.org/en/blog/release/v8.0.0/) and I thought I'd share what I ran into and how I corrected it. Please, *please* do not take this as the best recommendation. I simply want to point out a bug I ran into, how I got around it, and what I used to get me back up and running.

I'm going to divide these tips into two sections, one for the "main" Windows OS and one for WSL, the Windows Subsystem for Linux. I spend most of my time in WSL and I really recommend it for most devs, but I use the main Windows terminal for Cordova-related testing so I wanted it updated as well. 

Windows Subsystem for Linux (WSL)
===

I'm going to start with the WSL because, as I said, it is my preferred environment. For my first attempt at upgrading (I've got two Windows machines), I [downloaded](https://nodejs.org/en/download/current/) the Linux Binary (x86/x64) and copied it into my shell via the Terminal. I extracted (using `tax xf thefile.xz`) and then sudo copied the node and npm executable from the extracted file. I then tested with `node -v` and `npm -v` and while Node worked, npm pooped the bed. I then went into that bin folder, ran npm from there, and did: `sudo npm uninstall -g npm` followed by `sudo npm install -g npm`. The first time I ran the install it threw up an error so I did it again because, why not, and it worked.

All in all this felt like an all around bad idea even though it seemed to work. When I got to my second machine, I came across this good blog post: [My Bash on Windows Dev Environment](http://daverupert.com/2017/03/my-bash-on-windows-developer-environment/) where the author suggested using a tool called `n`. The command he suggested specifically did not work for me because I had Node already installed, but when I went to the [project page for n](https://github.com/tj/n), they suggested simply installing via npm and that worked fine. 

Once `n` is installed, it's pretty easy to update: `sudo n latest`. And of course, like `nvm` it allows you to install other versions as well if you need to switch back and forth.

![Node via WSL](https://static.raymondcamden.com/images/2017/5/node8.png)

Windows Terminal
===

So as I said, I spend most of my time in WSL, but I still wanted Node at v8 for my "main" Windows, ie what I get via cmd.exe and PowerShell. To upgrade I decided to take the easy route and just get the installer. I figured that would be a no-brainer. But then I ran into an odd issue. After installing, my Node was at v8, but my npm was at v4.5.0. 

What the heck???

I uninstalled, reinstalled, uninstalled again and ensured the folder was gone and my recycle bin was empty, and it just didn't work. So I filed a bug ([13311](https://github.com/nodejs/node/issues/13311)) thinking that perhaps it was a simple installer issue. 

Let me just state that as a first time bug-poster on the Node project, I was really impressed by the support I got. I had multiple folks offering to help, and coworkers as well. (I know we have IBMers helping develop Node, but it didn't even occur to me to ask on our local Slack.) It was their help that fleshed out the issue.

User @refack suggested I run `where` to find any `npm` commands that may still be around. When I tried `where` in Powershell, it didn't work, so I just assumed it didn't work, but running it in cmd.exe revealed the issue right away:

![Oops](https://static.raymondcamden.com/images/2017/5/node82.jpg)

See the npm in `C:\Users\ray\AppData\Roaming\npm`? Sometime in the past I must have updated npm by using `npm install -g npm`, which copied the file there and left it after uninstalling. (I'm going to report that.) I corrected this by simply doing `npm uninstall -g npm` and that left the "new" npm to be the only one found on my system.

![Woot](https://static.raymondcamden.com/images/2017/5/node83.png)

Also note that you can run nvm for Windows: [nvm-windows](https://github.com/coreybutler/nvm-windows). I didn't bother with this since WSL is my main environment and I don't see updating the core Windows version of Node very often.