---
layout: post
title: "Microsoft WebMatrix - a quick review"
date: "2012-09-13T18:09:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2012/09/13/Microsoft-WebMatrix-a-quick-review
guid: 4731
---

For a while now I've known that Microsoft builds good tools. But I've never really been a MS developer. I've done a bit with VB in the past (the far, far distant past) and have some minor experience with Visual Studio in general, but for the most part I don't tend to look at their tools as they don't typically involve my day to day work. Yesterday I discovered a Microsoft editor I had never heard of - <a href="http://www.microsoft.com/web/webmatrix/">WebMatrix</a>.
<!--more-->
WebMatrix is a free (Windows only!) editor that has some very interesting features to it. What caught my attention today was its support for Node. I've been doing a lot with Node lately and I was curious to see how well MS would support it. After downloading and installing the tool, I was able to create a Node.js application that included Express <i>and</i> Jade as well. (I don't like Jade as a templating engine, but whatever.)

Even cooler - I was able to run the app in my browser immediately. WebMatrix took care of turning the server on for me and handling restarts. That was something that took me a little work to get around when I was running Node at the command line. Don't get me wrong - it took me maybe 30 minutes to get things set up. But WebMatrix did this all in about one minute. I was very impressed by this. MS also included code complete for Node and Express within the editor. 

<img src="https://static.raymondcamden.com/images/ScreenClip118.png" />

Along with basic text editing, you also get a requests panel. It's essentially just a log of each URL request you make, but it's very cool to see it in action. The Time Elapsed could be especially useful while working on improving performance for an application.

<img src="https://static.raymondcamden.com/images/ScreenClip119.png" />

There's more of course. You can browse, and install, a list of extensions right from within the editor itself. This now includes an iPad and iPhone simulator. This simulator includes the ability to toggle orientation as well as a few other features, but things like setting the GPS require the "professional" version. Microsoft made it a bit difficult to chase down the author of the plugin, but I found them at <a href="http://www.electricplum.com">electricplum.com</a>. Looks like the "professional" version comes in at 40 bucks which is frankly cheap as hell. I tend to rely on my Mac and XCode when I simulate iOS devices, but this looks to be a great option for Windows machines.

<img src="https://static.raymondcamden.com/images/ScreenClip120.png" />

WebMatrix also supports publishing to a remote web site. I tried to work with MS Azure, but ran into multiple issues so I just gave up. They support a free 90 day trial, but I wasn't smart enough to figure out how to actually <i>start</i> a virtual server. I'll take the blame for that.

Anyway - I definitely recommend my Windows-using readers give it a quick check, especially if you are interested in Node and perhaps a bit wary of command-line usage.