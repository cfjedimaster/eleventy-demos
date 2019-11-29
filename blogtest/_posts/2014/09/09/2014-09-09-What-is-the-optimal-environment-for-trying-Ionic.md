---
layout: post
title: "What is the optimal environment for trying Ionic?"
date: "2014-09-09T16:09:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2014/09/09/What-is-the-optimal-environment-for-trying-Ionic
guid: 5303
---

<p>
So earlier today before the OMG A WATCH IT BURNS event, David asked me a question about <a href="http://www.ionicframework.com">Ionic</a> on Twitter:
</p>
<!--more-->
<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p><a href="https://twitter.com/raymondcamden">@raymondcamden</a> Thanks Ray!.. May I know the optimal (perhaps the one you have) dev environment for trying ionic framework?</p>&mdash; David R (@sachindavids) <a href="https://twitter.com/sachindavids/status/509381066402963457">September 9, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<p>
I told him I'd need a bit more than 144 characters to respond so this is my attempt. As always, take what I say with a grain of salt. This is my opinion.
</p>

<p>
First and foremost - David said, "trying" - which to me is a bit different than "working with." If your goal is to see it as quick as possible and you don't really have anything else, then you should be able to get by with just doing what their <a href="http://ionicframework.com/getting-started/">Getting Started</a> guide recommends: <code>npm install -g cordova ionic</code>. This will <strong>not</strong> be enough to test on a device if you don't have SDKs, but you will be able to test in a browser. You can see the UI. You can see the directives being used. I think this will give you a good idea of what you get out of the box to at least let you know if you will like working with their framework. (Spoiler - you will - but I'm biased.)
</p>

<p>
To be clear though, where the Getting Started guide suggests adding the iOS platform, you will not be able to do that if you truly have a virgin machine. Instead you want to use <code>ionic serve</code> which will fire the project up in the browser. Just remember you can't test any device features, but you can test pretty much everything else in Ionic.
</p>

<p>
So that's the quick way. For the <i>optimal</i> setup for someone planning to commit to Ionic, I'd go ahead and ensure you get your SDKs set up. That's covered over at Cordova's web site and is an "involved" process, but deal with it. You can skip that if you want to use <a href="https://github.com/driftyco/ionic-box">Ionic Box</a>, but I'd probably still recommend biting the bullet and doing the SDKs locally.
</p>

<p>
Finally - as much as I like Android, nothing is as fast as iOS. Get a Mac. Seriously. Being able to send to the iOS emulator in about 3 seconds if a <i>huge</i> benefit. You don't have to drink the Apple Koolaid completely but at the end of the day my Macbook Pro has probably been the best development machine I've ever owned. As I said - take this with a grain of salt - and feel free to argue with me in the comments. ;)
</p>

<p>
Ok, I lied. I'm not done. As long as I'm rambling on with other recommendations, here are a few more:
</p>

<ul>
<li><a href="http://brackets.io">Brackets</a> is the best editor for web projects. Get it.</li>
<li>Ionic supports viewing log messages in the console, which is probably good enough for half of your debugging. Outside of that, use <a href="https://www.genuitec.com/products/gapdebug/">GapDebug</a>. It gives you remote inspection for iOS and Android all in one Chrome tab.
<li>For Android development, do <i>not</i> use simulators. Use <a href="http://www.genymotion.com/">Genymotion</a>.
</ul>
</ul>