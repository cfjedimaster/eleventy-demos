---
layout: post
title: "Mobile developer? Check out Dreamweaver CS 5.5"
date: "2011-05-04T14:05:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2011/05/04/Mobile-developer-Check-out-Dreamweaver-CS-55
guid: 4220
---

Yesterday, as part of the CS 5.5 launch, <a href="http://www.adobe.com/products/dreamweaver.html">Dreamweaver CS 5.5</a> was released to the masses. I don't really know how many of my readers are Dreamweaver users. I've gone from thinking of Dreamweaver as a giant bloated piece of poo (sorry) to a very cool tool but not for me (much like how I can appreciate Photoshop but don't see me using it) to now having it in my start menu and beginning to migrate my HTML/jQuery development to it. I thought I'd share some thoughts and impressions. I am certainly <i>not</i> a Dreamweaver user (not yet), so if I point out something cool that's been in the product for a while, be sure to let me know.
<!--more-->
What got me to install and run DW CS 5.5 was it's jQuery Mobile support. I had seen earlier demos and knew it was pretty cool, but I didn't really appreciate the depth of support until I tried it myself. Here's a simple example of what the workflow is like.

I began by making a site and then making a new file. If you look at the Page from Sample section you can that <i>all</i> of the mobile support is based on jQuery Mobile:

<img src="https://static.raymondcamden.com/images/ScreenClip83.png" />

I selected the PhoneGap version. By default Dreamweaver creates a simple 4 page application (4 pages within one html file). That's nice as it gives you a quick way to see page navigation under the jQuery Mobile framework. But what's really nice is the editor support. Start typing a div tag for example, select data, and you get help for jQuery Mobile:


<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip84.png" />

One of the biggest issues I have with jQuery Mobile now is the lack of a simple reference to the HTML attributes it uses for markup. Don't get me wrong - it's incredibly easy to use. But there's a lot to remember. Having the IDE provide support like this is killer. Even better, you can use an insert menu for common jQuery Mobile items:

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip85.png" />

So as an editor, DW is <b>killer</b> for jQuery Mobile. It's also got HTML5 support which is nice. CFBuilder does not. (Although I'm investigating how to get that working.) Another killer feature is the multiscreen preview. Check it out:

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip86.png" />

I had to shrink down the screen cap a bit but hopefully you can clearly see the mobile versus tablet versus desktop rendering. That's awesome. The more I use tablets the more a tool like this will be crucial for me. It also supports - kinda - synchronized browsing. This was a bit clunky for me, but as I clicked in one, the others followed along. I'm not sure that particular feature works perfectly, but as it stands now it's going to be very useful I think.

Now for the part that I think is epic. You can now use DW to build Android applications. Under the Site menu is a Mobile Applications section. Before using this you have to configure it. I already had the Android SDK installed, but check it - DW can actually download it for you.

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip87.png" />

Once configured, you can then make builds right from DW, and you can make builds and run the emulator. I had defined a few Android virtual devices already and DW let me choose which to push to. This can be a bit slow - but as anyone who has used the emulator will tell you - that's an Android issue - not DW. 

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip88.png" />

I was able to take the build and install it to a real device pretty quickly as well. I don't believe DW supports that just yet, but it's pretty easy from the command line. (Basically "adb install soandsofile.apk")

I am incredibly impressed. Here are a few random comments, warnings, etc.

<ul>
<li>I had issues building when I didn't use a file called index.html. In my first test I had simply made a new file in a folder. I couldn't make a build until I had a new site and a core index.html file. That's how I'd normally do it anyway so it's not a big deal. 
<li>DW's autocomplete support for the latest jQuery. Again, CFBuilder does not, and that's really unfortunate. Aptana, which CFBuilder makes use, supports adding new JS libraries in for autocomplete support, but the version of Aptana bundled with CFBuilder doesn't work well with this. 
<li>Don't forget that DW has "views" - I don't know if that's the right name but it's like perspectives in Eclipse. By default mine was Designer. When I switched it to "Coder" (and "Coder Plus") the UI got a <i>lot</i> slimmer.
</ul>