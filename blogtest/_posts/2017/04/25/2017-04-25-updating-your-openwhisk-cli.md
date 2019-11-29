---
layout: post
title: "Updating Your OpenWhisk CLI"
date: "2017-04-25T11:29:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/04/25/updating-your-openwhisk-cli
---

This is just a quick reminder that the [OpenWhisk](https://developer.ibm.com/openwhisk/) CLI tool updates often, and unfortunately, doesn't provide a warning when it has become out of date. I've yet to see things break, of course, but obviously as a developer you want to ensure you have the latest and greatest installed.

First - you can get information about your install by running `wsk property get`:

![Version info](https://static.raymondcamden.com/images/2017/4/owcli1.png)

You can see the CLI version highlighted above. You can compare this against the binaries hosted here: 

https://openwhisk.ng.bluemix.net/cli/go/download/

Just today I saw a newer version was released. I downloaded the binary, copied it over, and verified the update:

![OMG NEW CLI HOTNESS](https://static.raymondcamden.com/images/2017/4/owcli2.png)

Kinda icky for those of us used to doing everything via `npm`, but hopefully it will get a bit nicer in the future. With OpenWhisk stuff updating rapdily, I've been checking for updates once a week or so.

p.s. And as a total random aside, those screenshots are from the Windows Bash Unix subsystem which is running *really* freaking good.