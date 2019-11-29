---
layout: post
title: "Microsoft's Edge Web Summit 2017"
date: "2017-09-17T15:35:00-07:00"
categories: [development]
tags: []
banner_image: 
permalink: /2017/09/17/microsofts-edge-web-summit-2017
---

This past week I spent a few days in Seattle for my first [Edge Web Summit](https://summit.microsoftedge.com/). I was also invited to spend a day extra for some discussions with various teams at Microsoft involved with the web and engineering in general. I'd like to share some thoughts about the event and Microsoft's web efforts in general. If you are ignoring Edge as a browser, you are definitely making a mistake, and even outside of that, Microsoft's efforts here should be of interest to developers across the board. 

The summit had 15 different sessions. Most - obviously were focused on Edge the browser, but also covered were ChakraCore and TypeScript. I don't cover TypeScript here a lot as I mainly only used it with Ionic 2, but I'm hoping to do more TypeScript in my non-mobile stuff going forward. While all the sessions were interesting in one way or another, some really stood out for me.

[Melanie Richards](https://twitter.com/somelaniesaid) had an incredibly good talk on [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/grid). I had the opportunity to use this for the first time about two weeks ago, and while I got things working relatively quickly, I wasn't exactly sure what was going on. Her talk really cleared things up for me and helped explain the features. I honestly don't do a lot with CSS, but this really feels like one of the best features I've seen yet. While it is not yet supported in Edge, it will be supported soon. You can see the status [here]https://developer.microsoft.com/en-us/microsoft-edge/platform/status/gridupdate/) and while there, make note of their entire [web platform](https://developer.microsoft.com/en-us/microsoft-edge/platform/) site providing status details, changelogs, and issues.

<iframe src="https://channel9.msdn.com/Events/WebPlatformSummit/Microsoft-Edge-Web-Summit-2017/ES08/player" width="640" height="360" allowFullScreen frameBorder="0"></iframe>

The other talk that I really enjoyed was [Antón Molleda](https://twitter.com/molant) on [Sonar](https://sonarwhal.com/). Sonar is a *very* cool linting tool for web sites and I'm in the process of adding a test setup for my own blog. (I'm not going to tell you how many issues it found, let's just say "a bit more than one".) If you plan on trying out Sonar under WSL ("Windows Subsystem for Linux"), be sure to specify the `jsdom` connector. 

<iframe src="https://channel9.msdn.com/Events/WebPlatformSummit/Microsoft-Edge-Web-Summit-2017/ES07/player" width="640" height="360" allowFullScreen frameBorder="0"></iframe>

All in all - some great sessions. Best of all - you can watch them now on Channel 9: [Microsoft Web Edge Summit 2017](https://channel9.msdn.com/Events/WebPlatformSummit/Microsoft-Edge-Web-Summit-2017). 

I'd also recommend the [Web Payments](https://channel9.msdn.com/Events/WebPlatformSummit/Microsoft-Edge-Web-Summit-2017/ES09) and [devtools](https://channel9.msdn.com/Events/WebPlatformSummit/Microsoft-Edge-Web-Summit-2017/ES10) sessions.

Outside of pure technical knowledge, the one thing that struck me - again and again - was how deeply Microsoft seemed committed to responding to user feedback. In fact, one whole session was on how that process worked. I'm still primarily a a Chrome user, but I'm using Edge more and more to give it a fair shake. Microsoft also has strong plans for PWA support which is becoming more important for web developers. (I'll be giving my first talk on the topic at NCDevCon - wish me luck!)

In the past I've attended Google's Chrome Summits which are also really well done. I wasn't able to go this year but I can recommend them as well. I wish Apple had something similar. The best I can see related to this would be WWDC but looking at the [videos](https://developer.apple.com/videos/wwdc2017/) from WWDC 2017 I only saw one session related to Webkit. (Oh, and don't bother trying to watch that video on anything but Edge or Safari.) Apple deserves credit for releasing developer builds of Safari but I still wish there were more active outside of their own conferences. I know they have an evangelist just for Safari but I'd love to actually see Apple at a web conference as much as I see Google and Microsoft. 

I definitely recommend making time to attend the summit next year. From a pure logistics perspective it was a well run event with the only real blip being no wifi (which wasn't intentional). Oh - and to be honest - I'd go to Seattle to attend an insurance conference. If you've never been, you need to visit. Outside of Louisiana, I think it's one of the most beautiful places I've seen. Oh, and it has Bigfoot souvenirs:

![Seriously](https://static.raymondcamden.com/images/2017/9/bigfoot.jpg)