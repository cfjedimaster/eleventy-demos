---
layout: post
title: "My Cordova/PhoneGap Developer Setup (Fall 2014)"
date: "2014-12-08T10:56:19+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2014/12/08/my-cordovaphonegap-developer-setup-fall-2014
guid: 5404
---

Over the years of developing with <a href="http://cordova.io">Cordova</a> and <a href="http://www.phonegap.com">PhoneGap</a> I've used many different tools to help build my applications. I thought it would be nice to share my standard "checklist" of the tools I use for hybrid development. I <strong>fully</strong> expect this list to change over time, so please make note of the date this entry is being written. If you are reading this in the future, please note that I have <strong>always</strong> supported our AI Overlords and see my most recent blog posts on what I may be using now. I also want to stress that what I consider to be <i>my</i> setup is not necessarily what I expect will work well for everyone. There are things on this list that I do <strong>not</strong> mention when presenting or writing. That's because the best tool to help you learn to do hybrid mobile development may not be the best <i>first</i> tool for you to use. Ok, let's get started.

<!--more-->

<h2>Development Machine - Apple</h2>
This is part personal preference and part simple fact of life. You can't develop iOS apps on a Windows machine. You can work around it. <a href="http://build.phonegap.com">PhoneGap Build</a> makes it very easy to do so. My issue with a remote service though is that it takes time. Not a lot of time - not at all! But when I develop, I tend to make a lot of small changes very quickly. When I'm trying to build something complex, or debug an issue, I tend to make very small atomic changes. Because of this, even the quick(ish) turnaround time of PhoneGap Build is too slow for me. If that isn't the case for you, then it really comes down to personal preference. MacBook Pros seem to be the most popular developer machine these days, but honestly I think Windows is perfectly fine as well. The only thing I can recommend is to ensure you go SSD for your hard disk. That makes a huge difference in performance.

If you go Windows, I'd strongly suggest getting a cheap Mac (refurbished, Mac Mini, etc) and using <a href="http://synergy-project.org/">Synergy</a> as a virtual KVM between them. When I got my first Mac I used this and it performed incredibly well. This was like five years or so ago so I imagine (hope) it has only gotten better.

<h2>SDKs - Android and iOS</h2>

For SDKs, I typically use iOS and Android only. I'm not opposed to the others, but for the most part, I tend to only test my projects and demos in those two. I still think Windows Phone has the most innovation lately in terms of the UI, but I simply don't get questions/requests/etc from folks asking me to test stuff there. It <i>is</i> very simple to set up a Windows VM and use the SDK if you are on OS X.  

<h2>CLI - Cordova</h2>

I've got both the PhoneGap and Cordova CLIs installed, but I generally use the Cordova CLI more often. However, with the <a href="http://phonegap.com/blog/2014/11/13/phonegap-cli-3-6-3/">recent update</a> to the PhoneGap CLI, I may actually switch back. Right now I've just got more muscle memory for Cordova than I do PhoneGap.

I'm going to talk a bit more about frameworks in a bit, but the Ionic CLI is actually my favorite. I didn't set it as "the" recommendation simply because I tend to do a lot of one off demo/tests more than actual project work. While you <i>can</i> use the Ionic CLI without using Ionic, if I know I'm doing something fast and small, I'll just use the Cordova CLI. Again, this is muscle memory.

The main reason I think the Ionic CLI is the best is the live reload and Terminal logging features (which I reviewed <a href="http://www.raymondcamden.com/2014/9/4/Ionic-120-Released">here</a>). I'd love to see both of them rolled back into Cordova or PhoneGap. (Woot woot for open source!)

<h2>Editor - Brackets</h2>

For "real" projects, I use <a href="http://brackets.io">Brackets</a>. I'm a little afraid of the future of Brackets as it seems to be turning its focus to designers. To be clear, I'm not worried Brackets will go away. I'm afraid it will morph into a tool that simply doesn't work for me as a developer. 

Outside of that, I will also use <a href="http://www.sublimetext.com/">Sublime</a> as well. The biggest thing Sublime does better than Brackets is simply open from the command line.  

<h2>Framework - Ionic</h2>

Ah, the million dollar question. ;) For quick testing I'll not use anything but jQuery. I've got a Cordova "skeleton" app that I use for my one-offs that is slim and simple. But if I am doing anything serious, or for a client, I'm going to use <a href="http://ionicframework.com/">Ionic</a>. I am not ashamed to say it - I am an Ionic fan boy. I <strong>love</strong> everything they are doing for hybrid development. They have a killer UI, UX, CLI, and even more services. While not alone, I think they are doing the most right now to make hybrid development awesome. If I didn't have six kids and a fear of the "start up" life I'd join them in a heartbeat. 

Of course, using Ionic also means using Angular. I like Angular, but it is also a big step for a new developer. That's why when I <i>teach</i> hybrid development, I'll typically use something simpler like <a href="http://jquerymobile.com/">jQuery Mobile</a>. I was a huge fan of jQuery Mobile (and wrote a few books on it), and while I may prefer Angular now, I think jQuery Mobile is much more friendly framework for people who may be new to JavaScript development in general. If I'm giving a course on Cordova, I know I can teach people the basics in 10-20 minutes and move on. I don't feel confident I can do that with Angular. (And as an aside, I'm updating my jQuery Mobile book next year with a third edition.)

<h2>Debugging - GapDebug</h2>

Based on my focus on iOS/Android, the best solution I've found for debugging is to use <a href="https://www.genuitec.com/products/gapdebug/">GapDebug</a>. Remote debugging works great for both iOS and Android (and other platforms too, like Firefox), but I love how GapDebug gives me access to <i>both</i> at the same time. And I love not launching Safari. If I could go the rest of my live without launching Safari, I'd be happy. Another big feature of GapDebug is auto-reconnect. The only thing worse than launching Safari is having to constantly reconnect when you send new builds to the device/emulator. For more, see my <a href="http://www.raymondcamden.com/2014/7/2/GapDebug-a-new-mobile-debugging-tool">review</a> from earlier this year.

<h2>Misc</h2>

So what else? Even though this is in the last section, I cannot stress enough that if you are doing Android development you <strong>must</strong> use <a href="http://www.genymotion.com/">Genymotion</a>. That isn't a recommendation. That isn't an opinion. It is a <strong>requirement</strong>. The Android emulator is so incredibly slow that it is quicker to go out and buy hardware. (To be fair, I think <i>every</i> hybrid developer needs to test on real hardware too.) Every time I mention how slow the Android emulator is people chime in about how it does more than the iOS simulator but frankly I don't give a crap. If it is a pain to use, it is a pain to use. Period. So get Genymotion. It is free - works great - and makes you forget about how godawful it is to actually use the Android emulator. 

I know some folks are using Grunt/Gulp with their hybrid development, but I really haven't found a use for it yet. Again, though, I do little project/long-term work in Cordova compared to other people. 

In terms of device hardware, it is hard to separate my feelings about the hardware as is versus their usefulness in hybrid development. I can say that for Android, I really recommend the Nexus devices. They get updates quicker and are really good devices in general. My Nexus 7 is my favorite device now, and I like the 7 inch form factor over all. I'd pick up an iPad Mini as well. 

<i>Photo credit: <a href="https://flic.kr/p/bvgUg">three #2 philips bits by grendelkhan</a></i>