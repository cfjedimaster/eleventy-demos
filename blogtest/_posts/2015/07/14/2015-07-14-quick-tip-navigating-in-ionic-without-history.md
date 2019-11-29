---
layout: post
title: "Quick Tip: Navigating in Ionic without History"
date: "2015-07-14T13:06:11+06:00"
categories: [development,html5,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/07/14/quick-tip-navigating-in-ionic-without-history
guid: 6388
---

Before I start, just a quick note. What I'm describing here is clearly <a href="http://ionicframework.com/docs/api/service/$ionicHistory/">documented</a>, but as I keep reminding myself I've yet to read 100% of the Ionic docs and I really need to. A big thank you goes out to @breakingthings on the <strong>Ionic Worldwide</strong> Slack channel for letting me know about this. So here's the question. Imagine you have an Ionic app with a login screen:

<!--more-->

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-14-2015-12.58.55-PM.png" alt="iOS Simulator Screen Shot Jul 14, 2015, 12.58.55 PM" width="282" height="500" class="aligncenter size-full wp-image-6389 imgborder" />

After logging in, you want to automatically move the user to a new state:

<pre><code class="language-javascript">$state.go('Home');</code></pre>

But when you do, you end up with this in your header:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot2.png" alt="shot2" width="281" height="500" class="aligncenter size-full wp-image-6390 imgborder" />

That link back to the Login view comes from how Ionic handles view history and the header. Most of the time you probably want that, but in this case, I definitely do not want it. Luckily it is rather simple to fix using <a href="http://ionicframework.com/docs/api/service/$ionicHistory/">$ionicHistory</a>:

<pre><code class="language-javascript">$ionicHistory.nextViewOptions({
    disableBack: true
});
$state.go('Home');</code></pre>

Yep, that's it. Nice and simple. And just in case it isn't clear, this modification <i>only</i> impacts the next change.