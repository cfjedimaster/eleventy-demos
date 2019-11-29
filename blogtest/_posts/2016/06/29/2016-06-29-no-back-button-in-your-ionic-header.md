---
layout: post
title: "No back button in your Ionic header?"
date: "2016-06-29T09:51:00-07:00"
categories: [javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2016/06/29/no-back-button-in-your-ionic-header
---

A few months ago I wrote up a quick article about titles not correctly updating in Ionic V1 apps ([Is your Ionic View title not updating?](https://www.raymondcamden.com/2015/12/18/is-your-ionic-view-title-not-updating/)). Today I've run into another little issue with the header. I was working on a *very* quick demo for a presentation tonight and had an app with a grand total of two views - a master list and detail.
<!--more-->
Everything was working fine, but then I noticed I didn't have a back button when looking at the detail view. As far as I could tell, my code was fine. Here's what I had in the index.html file:

<pre><code class="language-markup">
&lt;ion-nav-bar&gt;
		&lt;ion-nav-back-button&gt;Back&lt;/ion-nav-back-button&gt;
&lt;/ion-nav-bar&gt;

&lt;ion-nav-view&gt;&lt;/ion-nav-view&gt;
</code></pre>

And each view was pretty simple as well. You can see the problem in action at this CodePen: [http://codepen.io/cfjedimaster/pen/WxpPap](http://codepen.io/cfjedimaster/pen/WxpPap). (I apologize for the formatting in the code - I was cutting and pasting rather quickly.)

I brought it up in the Slack chat and Mike Hartington came to the rescue rather quickly. Turns out the fix was... applying a class. Seriously. Even though the header has a class by default, if you don't explicitly specify one, then the back button won't show up. Literally - the fix is just this:

<pre><code class="language-markup">
&lt;ion-nav-bar class="bar-royal"&gt;
		&lt;ion-nav-back-button&gt;Back&lt;/ion-nav-back-button&gt;
&lt;/ion-nav-bar&gt;

&lt;ion-nav-view&gt;&lt;/ion-nav-view&gt;
</code></pre>

You can see this working in a CodePen Mike made for me: [http://codepen.io/mhartington/pen/YWZBdK](http://codepen.io/mhartington/pen/YWZBdK). 

Obviously I think this is - well - bunk (grin) - so I'll filed a bug report for it here: [Back button will not show up if you do not specify a class for the nav bar](https://github.com/driftyco/ionic/issues/7124). 

And in case you're curious - here is the "Before" picture of this mission-critical Enterprise demo:

<img src="https://static.raymondcamden.com/images/2016/06/ioniccat1.png" class="imgborder">

And here is the "After" picture:

<img src="https://static.raymondcamden.com/images/2016/06/ioniccat2.png" class="imgborder">