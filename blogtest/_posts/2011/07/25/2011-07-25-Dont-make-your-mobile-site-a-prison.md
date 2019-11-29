---
layout: post
title: "Don't make your mobile site a prison"
date: "2011-07-25T15:07:00+06:00"
categories: [javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/07/25/Dont-make-your-mobile-site-a-prison
guid: 4307
---

I've recently been doing a bit of complaining about Gawker and their network of blogs. I'm not talking about their big redesign (which I hated too but you can at least get out of), but rather their mobile versions. Every time I hit one of their sites on my Inspire or Xoom, I get pushed to their mobile site. I'm ok with that, and my own software does that as well. However, they do not offer any way out of the mobile site. My Xoom is a large tablet. It can handle a "real" desktop web site. Yet Gawker has decided that they know what view is best for my device and refuse to allow me to get out of it. As you can imagine, this bugs me to no end. 

<a href="http://www.blogcfc.com">BlogCFC</a> (the engine that drives this blog) offers a way out of the mobile version. It's session based which means you need to "escape" every unique visit to the site, but it's quick and simple. I noticed last week that my blog aggregators (<a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a>, <a href="http://www.jquerybloggers.com">jQueryBloggers</a>, and <a href="http://www.androidgator.com">AndroidGator</a>) all did the same thing. 

Ok - so time to fix it. Today I pushed out an update that adds a simple "escape" function that mimic's BlogCFC's support. (I also added in the logic where some of the larger tablets, like the Xoom, aren't considered mobile.)

<img src="https://static.raymondcamden.com/images/ScreenClip145.png" />


That spiffy new icon is thanks to <a href="http://www.andymatthews.net/">Andy Matthews</a>. Don't forget that the code base for the aggregator system is open source. I've updated the <a href="https://github.com/cfjedimaster/ColdFusion-Blog-Aggregator">Github repo</a> today as well.