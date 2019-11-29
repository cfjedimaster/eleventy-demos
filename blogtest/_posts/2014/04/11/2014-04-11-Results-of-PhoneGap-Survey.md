---
layout: post
title: "Results of PhoneGap Survey"
date: "2014-04-11T16:04:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/04/11/Results-of-PhoneGap-Survey
guid: 5199
---

<p>
Thank you to everyone (all 229 of you) who responded to my PhoneGap/Cordova survey. The survey asked what version of PhoneGap or Cordova you used, how quickly you upgrade, and asked what problems you had (in general) with PhoneGap and Cordova. I've included an Excel sheet of <strong>all</strong> the results below. Let's look at the numerical results first.
</p>
<!--more-->
<p>
First up - what version of Cordova are you using.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot18.png" />
</p>

<p>
I expected to see a set of folks still on 2.9.X as the 3.X change was big, and there does seem to be a set of folks not upgrading, but they are in the minority. This is good to know. Now let's look at the PhoneGap side.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot28.png" />
</p>

<p>
Pretty much the same thing. No surprise there. Next I asked how quickly folks upgraded.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot35.png" />
</p>

<p>
It looks like - for the most part - people upgrade when they can or right away. Which is a good thing I guess. It implies there isn't a strong barrier to upgrading.
</p>

<p>
So that covers the easy stuff. Now what about the problems folks had? If you download the XLS sheet (again, attached below) you can see the full set of comments. What follows is <strong>my</strong> personal take on the results. I do not speak for the PhoneGap team, or the Cordova project. I consider myself a "interested developer" just like y'all so keep that in mind when reading my comments.
</p>

<p>
One big theme was performance. I know this is an issue for older Android browsers. There are definitely steps you can do to improve performance in your Cordova apps, but maybe this needs to be addressed in the docs more clearly? For example, there is a <a href="http://cordova.apache.org/docs/en/3.4.0/guide_appdev_privacy_index.md.html#Privacy%20Guide">privacy guide</a> which is cool, so I think it makes sense to add one for performance as well. My gut tells me this isn't the kind of thing where they can provide a "magic bullet" solution, but I think <i>some</i> direction could be useful here.
</p>

<p>
And speaking of documentation, this also came up quite a bit in the responses. I saw specific mention of the FileSystem (I've gotten a <strong>crap ton</strong> of questions about this lately). I also saw folks call out the docs on new versions. I can say that the teams do blog posts on new versions, typically called out by platform, but you probably don't see that if your first entrance is just docs.cordova.io. Again - can we do something on the docs site perhaps to make it easier to see what has changed?
</p>

<p>
I should point out that by "blog" I mean the "News" section at <a href="http://cordova.apache.org">cordova.apache.org</a>. There is a subscribe link there but it is just RSS. A way to get these items via email would be nice as it would be more direct.
</p>

<p>
Debugging was mentioned a few times, and one user had this to say in particular: "Debugging is still painful - more so on Android, Safari remote inspector on iOS makes that a little more bearable." I wonder if they are aware that you can <a href="http://www.raymondcamden.com/index.cfm/2014/1/2/Apache-Cordova-33-and-Remote-Debugging-for-Android">remote debug</a> Cordova and Android now? Again - perhaps there should be a guide in the main doc table of contents to discuss this?
</p>

<p>
I saw a bunch of remarks about plugins. Some of these were for things out of our control, specifically third-party plugins. If someone makes a cool plugin and never updates it, you need to lean on them, not the PhoneGap/Cordova team. Other comments talked about discoverability. If you aren't aware, the  <a href="http://plugins.cordova.io/">Cordova Plugin Registry</a> got a major overhaul in the past few days. Check it out.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen-Shot-2014-04-11-at-14.38.20.jpg" />
</p>

<p>
Next, there were multiple comments about PhoneGap vs Cordova. This comment was quite interesting: "What the hell is Cordova anyway? Docs just start talking about it like I'm supposed to know, I thought I was using phonegap?" So it looks like not only are there some folks still confused by the split some aren't even aware that there <strong>was</strong> a split. 
</p>

<p>
Speaking for myself... I'm focusing on Cordova. Period. When I present, I mention both CLIs, and I mention the excellent PhoneGap Build. But for all intents and purposes, I'm going to talk on Cordova, blog on Cordova, and pay attention to the Cordova CLI only. That makes it easier, and easier for my readers I think. (And when I say "I will only" - well, honestly, I'll probably screw up too. Heck, look at the title of this blog post.)
</p>

<p>
Finally, here are some comments regarding installation and usage. (As a quick edit - I want to be clear that I respect the fact that people took the time to answer this survey. I feel like I'm coming down on a few people in a somewhat harsh manner. Please know that it isn't personal. I think we can agree to disagree on things and hopefully you expect me to use this blog for my honest, somewhat-unbiased, opinion on things.)
</p>

<p>
"The 3.x installation. Phonegap requires node.js, requires ant, just to install. And then the install doesn't work and gives me cryptic messages. Please make a proper installer."
</p>

<p>
"Having to type things in to a command line. Why no GUI? Not ideal for beginners. The tutorials make too many assumptions. I just want to use PhoneGap Build with Dreamweaver and utilise a few features of PhoneGap to access basic phone functions. I thought I could just put a phonegap.js file into my development folder but now I'm told I need to use node.js and type in commands. I don't get it."
</p>

<p>
"The CLI is hard to setup and to use for web developers, particularly I had to install platform SDK. We need an easy to develop without any platform knowledge and installation."
</p>

<p>
Well, not to be rude, but I think you (and by you, I'm speaking generically of course!) need to get over it. Like it or not, Node, or more specifically, npm, is becoming a default requirement for modern web development. More and more tools make use of it for ease of installation and updates. You can't ignore it. Hell, you don't have to even really <i>learn</i> it per se, but you should get comfortable with using npm to install tools. <strong>It isn't going away.</strong>
</p>

<p>
I <i>do</i> think the 2.9 to 3.0 change could have been addressed a bit nicer for folks (which is why I tried to blog on it as soon as possible - it kind of caught me by surprise as well!). 
</p>

<p>What about the Dreamweaver and PhoneGap Build user? Well, PGB does make it rather easy. Write some code. Upload a zip (or use Dreamweaver's built-in support), and voilà, you get some bits. That's darn useful. That being said, you are going to want to learn how to do it the "manual" way at some point. Building locally is faster, easier to debug, and in the end, you get more control. Even if I were using PGB to handle my builds for a production release, I'd have my local environment set up so I could build locally during development.
</p>

<p>
And finally - the comment about "without any platform knowledge" is not only wrong, it is dangerous. You should not think of Cordova as "write once, run anywhere". Yes, you <i>can</i> write once and spit out builds for multiple platforms! But you need to be aware of every single platform. They all have their own performance considerations, their own UX considerations, and their own feature differences. I make the same argument about hardware. I can build for iOS using the simulator on a Mac. I can build for iOS using my PC and PhoneGap Build. But it would be ludicrous for me to assume that is good enough. I need to buy, and test, on <strong>real hardware</strong> or I am not doing my job. Period.
</p>

<p>
So... there ya go. Two more things I want to leave you with. I'm going to schedule a Google Hangout next week that will be a repeat of my FluentConf session on mobile debugging. If you want to see Remote Debug for iOS and Android, and Weinre too, come check it out. I'll record it for folks who can't attend. Also, the sessions I did in the past over Adobe Connect that were general Q and A worked very well I think. I don't know if a Google Hangout would work well for that, but I definitely plan on hosting an open Cordova QA session soon.
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FCordova%{% endraw %}2DPhoneGap{% raw %}%20Version%{% endraw %}20{% raw %}%28Responses%{% endraw %}29%2Exlsx'>Download attached file.</a></p>