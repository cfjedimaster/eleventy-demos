---
layout: post
title: "Working with IBM MobileFirst and Ionic - a follow up"
date: "2015-03-30T11:48:05+06:00"
categories: [development,mobile]
tags: [ionic,mobilefirst]
banner_image: 
permalink: /2015/03/30/working-with-ibm-mobile-first-and-ionic-a-follow-up
guid: 5906
---

Last week I <a href="http://www.raymondcamden.com/2015/03/23/working-with-ibm-mobilefirst-and-the-ionic-framework">blogged</a> about using IBM's <a href="http://www.ibm.com/mobilefirst/us/en/">MobileFirst</a> platform and <a href="http://www.ionicframework.com/">Ionic</a>. This is part of a series I'm doing discussing how to use both products together to build awesome mobile apps. (How awesome? Five Lion Robots that can transform into One Giant Robot awesome.) Currently there are a few steps you have to take to modify the default Ionic template to work with MobileFirst. My blog explains those steps and demonstrates it in a video. After discussing things with coworkers, we've come across a few small issues that slightly modify this process. In this post I'll explain the differences, but please be sure to read that first post so this makes sense.

<!--more-->

Ok, first off, you can remove this line from the template: 

<pre><code class="language-javascript">&lt;script&gt;window.$ = window.jQuery = WLJQ;&lt;&#x2F;script&gt;</code></pre>

This line does <strong>not</strong> exist in the Ionic template but <strong>does</strong> exist in the default MobileFirst hybrid project. You don't need it, so just skip that step. 

Second, there is a CSS element for iOS that breaks Ionic - but not all the time. I only noticed it in the tabs layout, not the default which is what I had used for my first post. Check out the screen shot below:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/iOS-Simulator-Screen-Shot-Mar-30-2015-9.22.37-AM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/iOS-Simulator-Screen-Shot-Mar-30-2015-9.22.37-AM.png" alt="iOS Simulator Screen Shot Mar 30, 2015, 9.22.37 AM" width="281" height="500" class="alignnone size-full wp-image-5907" /></a>

Notice how the tabs are missing the bottom portion. This is simple enough to correct. In your initialization routine, simply tell MobileFirst that you do <strong>not</strong> what to show the iOS7 status bar. As you can probably guess, this is only an issue on iOS. Here is the relevant code.

<pre><code class="language-javascript">var wlInitOptions = {
	
	autoHideSplash: false,
	showIOS7StatusBar: false
		 
};</code></pre>

I should point out that Carlos' templates up on GitHub had this fixed already - <a href="https://github.com/csantanapr/mfp-ionic-templates">https://github.com/csantanapr/mfp-ionic-templates</a>. 

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/iOS-Simulator-Screen-Shot-Mar-30-2015-11.46.49-AM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/iOS-Simulator-Screen-Shot-Mar-30-2015-11.46.49-AM.png" alt="iOS Simulator Screen Shot Mar 30, 2015, 11.46.49 AM" width="282" height="500" class="alignnone size-full wp-image-5909" /></a>

Any way, I hope this helps, and later today I'll share another example of Ionic and MobileFirst!