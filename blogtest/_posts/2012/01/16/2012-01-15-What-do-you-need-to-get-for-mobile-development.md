---
layout: post
title: "What do you need to get for mobile development?"
date: "2012-01-16T09:01:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2012/01/16/What-do-you-need-to-get-for-mobile-development
guid: 4496
---

Nerudo asked me:

<blockquote>
I am looking to start out in Mobile App dev. I was wondering what is your setup or what set-up would you advise I get. By setup I mean "test devices, and develeopment tools."
</blockquote>

Here is my list - and I'd love to know what my readers would add/change/modify.
<!--more-->
First, let's talk hardware. At minimum you will want a Mac. I can't believe I'm saying that, but, you really do need a Mac. Why? While you can develop for iOS on Windows (you can do so via Flash Builder and you can make use of <a href="http://build.phonegap.com">PhoneGap Build</a>), you really want a native Mac environment to cover your bases. If you can only have one computer, then make it a Mac. In my office, my primary machine is a Windows 7 box and I've got an older Mac I can use just for builds. Android development can be done in any OS, so your stuck with at least one Mac machine. (I say "stuck" but obviously, if you prefer Mac, this is a win for you.)

You mentioned test devices, which is a good thing. Both Android and iOS let you simulate running applications, and sometimes that's good enough to get started, but you will need a real device before you release your application. Actually, let me clarify that. Technically you do not <b>need</b> a real device. You can write your app, test your app on the simulator, and release, but you are taking the risk that your app will not work the same on a real piece of hardware. 

So what devices? If you are just developing for one platform, then get a respective piece of hardware for that platform. For iOS, you're lucky in that your choices are relatively simple. Get an iPhone or an iPad, or both, depending on where your app is meant to run. There <i>are</i> multiple versions of the iPhone and iOS, but how much that is an issue - again - depends on what your doing. For Android, it's a bit more chaotic. You've got multiple versions of Android out there and multiple types of hardware capabilities. If you aren't running a game, than the performance issues shouldn't be as much of a big deal.

One thing I'll add here. Even if you are building an app for a phone device, you should at least take a look at how your app is rendered on a tablet. Folks <i>will</i> run your apps on their tablets. 

But the critical point here is - you really, really, <i>really</i> want to test on a physical device, even if it's your own phone.

On the software side, you need Eclipse and related tools (free) for Android and XCode for iOS. You can use other editors, of course, and for Eclipse at least everything can be command line driven, making it easier for other IDEs to build stuff out. For iOS, I'm just not sure if you can skip XCode completely. 

This is just a high level list (and it doesn't talk about the various charges you to get to pay to publish your applications), but hopefully it gives you a basic idea.


<img src="https://static.raymondcamden.com/images/old_mobile_phone.jpg" />