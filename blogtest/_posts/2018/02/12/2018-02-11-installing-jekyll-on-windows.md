---
layout: post
title: "Installing Jekyll on Windows"
date: "2018-02-12"
categories: [static sites]
tags: []
banner_image: /images/banners/windowsjekyll2.jpg
permalink: /2018/02/12/installing-jekyll-on-windows
---

Before I begin, please note that this post is not a guide or anything like that. I'm literally just blogging this to help save others the hours of crap I went through trying to get Jekyll to run on Windows. [Jekyll](https://jekyllrb.com/) is - or I should say - was my favorite static site generator. But getting it to work under Windows, or even Windows Subsystem for Linux - has been a complete and utter crap fest. I did go through the directions here:

[Jekyll on Windows](https://jekyllrb.com/docs/windows/)

But nothing worked well for me. I've added a few posts to the Jekyll forum asking for help, but then I noticed this towards the bottom:

<blockquote>
Optionally you can use [Autoinstall Jekyll for Windows](https://github.com/KeJunMao/fastjekyll#autoinstall-jekyll-for-windows).
</blockquote>

This led me to a [repo](https://github.com/KeJunMao/fastjekyll) that basically said, "clone this and run the bat file." 

Doubts... I had them.

![So much cute, so much doubt](https://static.raymondcamden.com/images/2018/2/doubt.jpg)

And of course, as soon as I ran the BAT file, it failed. But I noticed that the failure seemed to be a simple typo (and I've already filed a [bug report and PR](https://github.com/KeJunMao/fastjekyll/issues/2)) on it. I fixed it - ran it - and oh my freaking god it worked:

<img src="https://static.raymondcamden.com/images/2018/2/jekyllfrak.jpg" title="I didn't say frak in my head" class="imgborder">

And there you go. So yes, I'm officially done with Jekyll. It worked well for [CFLib](https://cflib.org/) but I'm going to find me a new engine that is Node based. For folks curious, I use Hugo for this site, but I really don't like Hugo either. However, it processes incredibly quickly which is something I need for my nearly 6K pages.

<i>Photo by <a href="https://unsplash.com/photos/uWwN03Mg4Wg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jeff Sheldon</a> on Unsplash</i>