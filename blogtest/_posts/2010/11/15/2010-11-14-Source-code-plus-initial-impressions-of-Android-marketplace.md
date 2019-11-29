---
layout: post
title: "Source code plus initial impressions of Android marketplace"
date: "2010-11-15T09:11:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2010/11/15/Source-code-plus-initial-impressions-of-Android-marketplace
guid: 4013
---

A long time ago - before MAX (well, it certainly feels like a long time ago), I <a href="http://www.raymondcamden.com/index.cfm/2010/10/21/My-First-Android-Application">blogged</a> about my first AIR for Android application built using the new Flex "Hero" SDK. I couldn't share the code at that point but now that MAX is behind us I can post up the code. Do <b>not</b> consider this 'best practice' mobile development. It was my first experiment. For the most part it was pretty simple. I still need to read up on the new controls for mobile development though. Also - the biggest issue was how to set up my forms so that they worked well on a mobile device. Specifically - drop downs. You can use a normal drop down in a mobile application but it is <i>very</i> difficult to use. Dirk Eismann gave me some code for what I call a "Button/Radio" control. Basically a field that shows up as a button until you click it. At that point it turns into a scrollable list. My gut tells me that issues like that (translating web controls to usable mobile controls) will be the biggest stumbling block for new mobile developers. I definitely plan on sharing more as I learn and build new applications. Anyway, you can find a zip of the project below. I intentionally did <b>not</b> chose a FXP export since not everyone has Burrito installed. I wish more people would do that. Even with Burrito installed I wish I could just extract/open in Notepad to quickly scan the code. I hate having to make a project just to look at source code.

I also tried out the Android Marketplace today. I was pretty shocked how easy it was to publish my application. I already had a Google Marketplace login so maybe that helped, but it took approximately ten minutes. I only ran into two hitches:

<ol>
<li>My application XML file for my AIR application had a version of 0.0.0. Google didn't like this. It wanted a positive integer. Changing it to 1.0.0 worked.
<li>Google was <i>real</i> bitchy about the screen shot size. If you don't match their exact specifications, they won't accept it. I was too lazy to run Photoshop and 'expand' my canvas to make it match so right now my application has no screen shots. I'll do that at lunch I guess. But really - I don't see why they don't allow screen shots <i>smaller</i> than the desired size.
</ol>

Outside of that - the biggest issue is that you can't browse the marketplace on the web. Sorry Google - I know you guys are geniuses, but that's <b>just plain dumb</b>. If you need some help, let me know. I happen to know a programming language that can put your dynamic content online quickly. I get that they want you to use your handheld so you can actually install the application, but there is absolutely no reason why people shouldn't be able to view the application via the web. Anyway, if you have an Android, search for "Death Clock" and give my application a try. (I'd also love any <b>honest</b> ratings!)<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fsrc%{% endraw %}2Ezip'>Download attached file.</a></p>