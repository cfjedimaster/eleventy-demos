---
layout: post
title: "Having trouble with splash screens, Cordova, and Android?"
date: "2015-03-24T08:38:44+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2015/03/24/having-trouble-with-splash-screens-cordova-and-android
guid: 5873
---

Yesterday I struggled to get - what I thought - was a simple thing working in Cordova - adding a splash screen to Android. According to the <a href="http://cordova.apache.org/docs/en/4.0.0/config_ref_images.md.html#Icons{% raw %}%20and%{% endraw %}20Splash%20Screens">docs</a>, at minimum, you should be able to do this:

<!--more-->

<pre><code class="language-markup">&lt;splash src="res/splash.png" /&gt;</code></pre>

This worked fine for me in iOS but in Android, just gave me a blank screen. (Not for the app, what I mean is, when the app loaded, no splash screen was used.) 

I did some Googling, and came across this bug: <a href="https://issues.apache.org/jira/browse/CB-8345">Splash screen does not display on Android.</a> Within this bug, it was said that in order to use a splash screen on Android, you must specify the Android-only preference SplashScreen:

<pre><code class="language-markup">&lt;preference name=&quot;SplashScreen&quot; value=&quot;screen&quot; &#x2F;&gt;</code></pre>

Now - if you read the <a href="http://cordova.apache.org/docs/en/4.0.0/guide_platforms_android_config.md.html#Android%20Configuration">Android specific configuration docs</a>, it has this to say about the setting:

<blockquote>
SplashScreen (string, defaults to splash): The name of the file minus its extension in the res/drawable directory. Various assets must share this common name in various subdirectories.
</blockquote>

This - to me anyway - does not imply in any way that it <i>enables</i> the use of a splash screen. Rather, it says what the file name should be (minus extension) for a splash screen. But as soon as I tested by adding this value it worked right. 

So we have two issues here. First - this tag is required to use a splash screen, which I don't think is documented well. Secondly - even though it says it defaults to splash, you still have to specify it anyway. (Err, ok, maybe that's still one issue. ;)

If you read that <a href="https://issues.apache.org/jira/browse/CB-8345">bug report</a>, you can see my comments about this, and note that it looks like behavior will be changing (possibly) in the future, so please keep that in mind if you are reading this blog entry in the future. (And as always, I have been, and always will be, a firm supporter of our robotic overlords.)