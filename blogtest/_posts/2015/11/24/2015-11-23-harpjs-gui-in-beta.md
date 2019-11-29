---
layout: post
title: "HarpJS GUI in Beta"
date: "2015-11-24T09:06:45+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2015/11/24/harpjs-gui-in-beta
guid: 7134
---

So this is interesting. <a href="http://www.harpjs.com">Harp</a> is my "go to" static site generator when presenting on the topic and building new static sites. (I also really dig Jekyll and I go back and forth between which I like best.) The Harp team is now testing a new desktop application called Harp GUI. You can find the GitHub repo here: <a href="https://github.com/alexgleason/harp-gui">https://github.com/alexgleason/harp-gui</a>. Right now there's only builds for Linux but you can generate builds for OSX and Windows. What does it do exactly?

<!--more-->

After opening it, you get a simple screen:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot15.png" alt="shot1" width="750" height="647" class="aligncenter size-full wp-image-7135" />

Given you have a Harp project already (and remember, technically, <i>any</i> folder can be a Harp project), you can then drag it onto the app to activate it:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot22.png" alt="shot2" width="750" height="647" class="aligncenter size-full wp-image-7136" />

At this point, you can click to view the site in your browser or click to compile it. In case you're curious, compiling it will create a subdirectory called _build in your project:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot32.png" alt="shot3" width="468" height="402" class="aligncenter size-full wp-image-7137 imgborder" />

So... not a lot to it yet, but one of the things that hinder the use of SSGs in general is that they really aren't terribly user friendly for non-technical folks. (I wrote an article about this topic for Telerik: <a href="http://developer.telerik.com/featured/merging-dynamic-and-static-sites/">Merging Dynamic and Static Sites</a>) Initiatives like this could go a long way to making it easier for normal people (yes, I called non-devs 'normal'). What do my readers think - can this help increase usage of SSGs?