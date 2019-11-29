---
layout: post
title: "Thoughts on developing for the Nook"
date: "2011-08-20T00:08:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2011/08/19/Thoughts-on-developing-for-the-Nook
guid: 4332
---

The Nook (<a href="http://www.barnesandnoble.com/nookcolor/index.asp">NookColor</a> to be precise) is a pretty nice device. I <a href="http://www.raymondcamden.com/index.cfm/2010/12/10/Review-Nook">reviewed</a> it almost a year ago and since that time it's grown more powerful with the support of an app marketplace. I've worked through the process of getting an app on their market and I thought I'd share a bit of what that experience was like for me. If any of my readers have experience with their app market I'd love to hear their thoughts as well.
<!--more-->
First off - you want to visit the <a href="https://nookdeveloper.barnesandnoble.com/">Nook Developer</a> portal. This is where you will find tools and docs, and it will also be your portal for managing your application and reports. The Nook SDK is not - as far as I know - required for developing AIR apps. (I'll explain why in a second.) It does provide you with the ability to run a Nook simulator, but unfortunately that means you have to suffer through the performance slug known as the Android Emulator. As many people have said before - the best thing you can do when developing for a device is to actually <i>buy</i> the device. (Note - to test applications on your device, you do need to sign up to become a Nook developer.)

The Nook's platform is standard Android, which means you can take your basic Flex Mobile Hello world app and expect it to run. However, the Nook does not have a camera or a GPS. If your application requires that then you're out of luck. If your app makes use of those tools but does not require it, it's a good time to see how well your code handles it. The only trouble I had in migrating my code to the Xoom was in with my layouts. I'm still getting my head wrapped around how Flex 4 handles layout and an application that worked well on my Xoom did not layout quite right on the Nook. To help me test, I went into Flash Builder and added Nook as a new Device Configuration. I specified the Nook resolution (1024x600) and immediately saw that my layout issues were evident in the Flash Builder simulator as well. Once I worked around that though things "just worked" on the Nook.

The really difficult part though was in getting my application moved over to the Nook. The USB drivers did not work for me. Oddly - the tech support from BN recommended external drivers. I eventually got it working with some Googling and trial and error, but it was a bit surprising this wasn't more direct and available right at bn.com. 

So - the good news is that - at least device wise - you can get up and running rather quickly. But what about the process of getting your app into the Nook store? My only other app store experience was with the Android store. I've yet to experience the fun of submitting to Apple. When Google, at least if you are giving the app away for free, the process is pretty simple. The form isn't the most user friendly form I've seen, but it's workable. 

To begin with the Nook App Store, I first had to set up my account. This involved banking details and could certainly be taken care of early in your application development. I <i>believe</i> it took a few days, but I don't remember the exact time frame.

Once I was approved, you then use the Nook Developer site to manage your applications. A nice, tabbed-based form (written in Flex!) is used to manage the process. I found this to be a bit nicer than Google's form. You do not upload your application. Instead you submit metadata about your application first. This is where the store review process comes in. BN will review your application for - well  - I assume appropriateness - and get back to you once approved. When approved, you then actually upload the APK.

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip156.png" />

How long does it take? Well one of the interesting things about their developer site is that it keeps track of the history of your application. Here's how mine went. 

<ul>
<li>June 21 - Submitted metadata
<li>June 21 - my app was rejected. I don't remember what I did wrong, but I was told why.
<li>June 23 - my app was rejected again - my icon didn't have a non-white, non-transparent background. Kinda frustrating, but I got past it.
<li>June 27 - app rejected again - same reason. My fault as I didn't read the last failure reason closely enough. At this point I wish things were moving faster, and that I paid better attention.
<li>June 27 - app metadata approved and I uploaded the APK.
<li>July 7 - app approved. It doesn't show up in the store till the weekend though.
</ul>

So a bit over two weeks. When I uploaded my update (added the new icon from Rachel Lehman!) on August 9th, it was approved August 16th. It took a day or so before it showed up in the store with the nice settings. 

I don't know how this compares to the Apple store, but I believe this is probably pretty similar? If your only experience with app stores is with Android, you definitely want to prepare yourself for the time involved, but I don't think it's unreasonable. 

After your application is approved, what else is there to do? In the developer site, you've got a Reports link and a Marketing link. The Reports are pretty good. You can see units sold and money earned. You can do this for all applications or just one application at a time. You can't yet change the date filters to something more dynamic though (like the whole year, past 2 weeks, etc). The chart is far better than what you get in the Playbook developer portal. It still doesn't report actual number. (Seriously.) I may have to select each month and do simple math with the Nook report, but I can't tell at all how many downloads I've gotten on the Playbook.

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip210.png" />

The Marketing link currently is just a badge generator. You can see the result here:

<!-- Begin NOOK App Badge : Hangman --><a href="https://nookdeveloper.barnesandnoble.com/tools/dev/linkManager/2940043855282" target="_new"><img src="https://nookdeveloper.barnesandnoble.com/tools/dev/badge/2940043855282" alt="NOOK App : Hangman" /></a><!-- End NOOK App Badge -->

There's two big omissions from this area. First - there is no link to your application in the app store. That seems like such a simple thing. Sure you get the badge creator, but if I want to quickly share a link to my app (via IM perhaps), I have to do a search on the store. (Or bookmark it I guess.) 

This lack of a link also brings up another omission - your feedback. The only way to find out feedback on your app is to visit the public link. None of the feedback is rendered in the developer portal. I hope this is added soon. I'd like to be able to see everything about my app in one place. 

So... the million dollar question. Am I getting rich off of my app? Nope. Am I earning money. Yep. Not a lot, but considering that I built the application in a few hours and - really - just as a learning experience - it's a big win for me. I can easily see how someone could make some good money with the Nook if they dedicated themselves to it. Ted Patrick has <a href="http://tedpatrick.com/2011/08/08/live-wallpaper/">detailed</a> his earnings and they are pretty damn impressive. 

If you are interested in learning more, definitely check out the support area (<a href="http://nookdeveloper.zendesk.com/home">http://nookdeveloper.zendesk.com/home</a>). I found BN, and Ted Patrick in particular, to be pretty proactive in responding to questions and problems. To be honest, maybe I'm lucky in that I know Ted personally, but I've seen him work hard to help everyone. Good luck getting that type of response from Google or Apple.