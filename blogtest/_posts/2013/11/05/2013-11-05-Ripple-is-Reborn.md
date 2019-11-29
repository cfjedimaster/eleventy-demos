---
layout: post
title: "Ripple is Reborn!"
date: "2013-11-05T22:11:00+06:00"
categories: [development,html5,mobile]
tags: []
banner_image: 
permalink: /2013/11/05/Ripple-is-Reborn
guid: 5079
---

<p>
<b>Edit: As I find more things, I'll post them to the bottom of this blog post.</b>
</p>

<p>
For folks who have seen me present on PhoneGap/Cordova, you know I'm a huge fan of Ripple. Ripple was (is, see details) a Chrome extension that allows you to run PhoneGap/Cordova applications in the browser. Ripple included a UI that gave you a pseudo-mobile view of your application and a way to emulate various features including the camera and the accelerometer. While not as good as a real device, it was <i>incredibly</i> useful for development.
</p>
<!--more-->
<p>
Unfortunately, sometime around the PhoneGap 2.6 timeframe, something went wrong. Whether it be a Chrome issue or something different in PhoneGap, Ripple stopped working properly. For the last few months, a new developer, <a href="https://github.com/gtanner">Gord Tanner</a>, has been working on an update to the Ripple project at Apache. Previously, Ripple was a Chrome extension and was managed by some folks from Blackberry. Now you can find Ripple at Apache:<a href="http://ripple.incubator.apache.org/">http://ripple.incubator.apache.org/</a>.
</p>

<p>
In this blog post, I'm going to describe how to use Ripple. Please read this carefully. <strong>Ripple has changed.</strong> It is still very cool, but how you interact with it and PhoneGap has been changed.
</p>

<p>
First and foremost - you must remove the Ripple Chrome extension if you have it installed. Leaving it installed will conflict with the new Ripple. If you don't know how to do that, simply go to your Chrome Extensions page, find Ripple, and disable or remove it. If you still see the little blue Ripple icon to the right of the URL bar than you haven't done it right.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_11_5_13__9_28_PM.jpg" />
</p>

<p>
Next - go to the command line. If you don't have npm, then please install it by installing Node. If you have done <i>anything</i> with PhoneGap or Cordova in 3.0 then you already have this. If not, now is the time to fix it. If you have npm installed, then install ripple-emulator:
</p>

<p>
<pre><code>npm install -g ripple-emulator</code></pre>
</p>

<p>
Next, create a new Cordova project. (This should work in PhoneGap too.)
</p>

<p>
<pre><code>cordova create foo</code></pre>
</p>

<p>
CD into your new project, add Android as a platform, and prepare it so the files are laid out.
</p>

<p>
<pre><code>cordova platform add android
(lots of stuff output here...)
cordova prepare</code></pre>
</p>

<p>
<img src="https://static.raymondcamden.com/images/21.jpg" />
</p>

<p>
Ok, this is where Ripple acts differently. I mentioned earlier that you needed to remove the old extension. So how do you use Ripple? From the root of your project, you can run the ripple command. You need to tell Ripple where your Android code exists. You can do this by running it from (yourproject)/platforms/android/assets/www or by passing a path argument:
</p>

<p>
<pre><code>ripple emulate --path platforms/android/assets/www</code></pre>
</p>

<p>
And just to mix things up a bit - a screenshot from OS X to go with the Windows shots above:
</p>

<p>
<b>Edit as of 12:14AM - thanks to Jonathan Rowny:</b> You do not need to specify a path. If you do "ripple emulate" in the root, it just plain works.
</p>

<p>
<img src="https://static.raymondcamden.com/images/31.jpg" />
</p>

<p>
At this point, Ripple actually fires up Chrome for you and opens it to your application:
</p>

<p>
<img src="https://static.raymondcamden.com/images/41.jpg" />
</p>

<p>
And that's it! There's a bit more detail at the <a href="http://ripple.incubator.apache.org/">project home page</a>. Check it out and let me know if you run into any issues. I've successfully run it now on Windows and OS X.
</p>

<p>
<b>Additional Notes on Nov 5 (yes, about 30 minutes after I posted):</b> Yes, if you want to use plugins (i.e. any core feature), you still have to install them the normal way even if you are using Ripple. Don't forget that. Secondly - every time you edit your code, you're going to need to re-prepare your project. What I recommend is - use a tab to fire up Ripple and another tab to simply run the prepare. You can even use a Grunt watcher to handle this for you.
</p>

<p>
<b>Additional Notes on Jan 2, 2014:</b> If you ever launch Ripple and see this in the display: Error: static() root path required (lots more crap beneath) it may be that you only added iOS support to your project and Ripple defaults to an Android device. Just switch to an iOS device and it should remove the error. Obviously if you add Android as a platform as well it will go away.
</p>

<p>
<b>Additional Notes on Jan 11, 2014:</b> A caveat to the first note. When you edit your code, you do <b>not</b> need to run cordova prepare. Ripple does it for you. But you do need to rerun "ripple emulate" to refire the simulator. If you just reload the browser tab it won't show the latest changes. So you have a choice. You can either keep running "ripple emulate", or do "cordova prepare" in another Terminal tab so you can reload the same tab. (Or use the Grunt task idea.)
</p>