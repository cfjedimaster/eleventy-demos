---
layout: post
title: "Some examples of Android PhoneGap Config Settings"
date: "2013-02-19T17:02:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2013/02/19/Some-examples-of-Android-PhoneGap-Config-Settings
guid: 4859
---

One thing I don't really play a lot with are config.xml files on Android. The config.xml file is a powerful way to specify settings like icons, splash screens, and the like. You can find the high level docs for this feature here: <a href="http://docs.phonegap.com/en/2.4.0/guide_project-settings_index.md.html#Project%20Settings">Project Settings</a>. A few days ago <a href="http://simonmacdonald.blogspot.com/2013/02/whats-new-in-phonegap-android-240.html">Simon MacDonald</a> wrote up some details about new Android features and specifically called out another blog post by Joe Bowser about new config.xml settings for Android: <a href="http://www.infil00p.org/what-else-is-new-in-cordova-android-2-4-0/">What else is new in Cordova Android 2.4.0</a>
<!--more-->
I took this as an opportunity to really look at the Android-specific config.xml settings. You can see this list below (taken from the <a href="http://docs.phonegap.com/en/2.4.0/guide_project-settings_android_index.md.html#Project{% raw %}%20Settings%{% endraw %}20for%20Android">docs</a>):

<ol>
<li>useBrowserHistory (boolean, defaults to true) - set to false if you want to use the history shim that was used to work around the hashtag error present in Android 3.x prior to the history fix. (Note: This setting will be deprecated in April 2013)

<li>loadingDialog - Display a native loading dialog when loading the app. Format for the value is "Title, Message"

<li>loadingPageDialog - Display a native loading dialog when loading sub-pages. Format for the value is "Title, Message"

<li>errorUrl - Set the error page for your application. Should be located in your Android project in file://android_asset/www/

<li>backgroundColor - Set the background color for your application. Supports a four-byte hex value, with the first byte representing alpha value, and the following three bytes with standard RGB values. (i.e. 0x00000000 = Black)

<li>loadUrlTimeoutValue - How much time Cordova should wait before throwing a timeout error on the application.

<li>keepRunning (boolean, defaults to true) - Determines whether Cordova will keep running in the background or not

<li>splashscreen - The name of the file minus its extension in the res/drawable directory. If you have multiple assets, they all must share this common name in their respective directories.
</ol>

Some of these made sense to me, and some made sense but I had never actually seen them in action. I played a bit with them and took some screen shots I thought I'd share with my readers.

<h2>loadingDialog</h2>

As the docs specify, you literally use a "Title, Message" format. Ie: &lt;preference name="loadingDialog" value="Raymond, Was Here" /&gt;

And here it is in action...

<img src="https://static.raymondcamden.com/images/screenshot66.png" />

<h2>loadingPageDialog</h2>

I assumed this would fire between page loads, but I never saw this actually display. Maybe it only shows up if a page takes more than N seconds to load. I'm just throwing this out there in case anyone <b>can</b> confirm it actually works.

<h2>errorUrl</h2>

The docs say it should be located in file://android_asset/www/. So I made a file, error.html, and tried this:

&lt;preference name="errorUrl" value="error.html" /&gt;

But that doesn't work. You need to use a file-based URL. Maybe that's assumed by the docs, but it wasn't clear to me. This is what works:

&lt;preference name="errorUrl" value="file:///android_asset/www/error.html" /&gt;

I mentioned to Simon that this setting seems a bit extreme. I mean, why would I link to and use the wrong URL, but certainly in a "real" application with some size in it this would be possible. 

<h2>backgroundColor</h2>

Yep, works fine, but only if you don't forget the first value is alpha and accidentally leave it at 0. Here is an example:

&lt;preference name="backgroundColor" value="0xff38c0f4" /&gt;

And the result:

<img src="https://static.raymondcamden.com/images/screenshot67.png" />

<h2>splashscreen</h2>

I had two issues with this, both of which Joe helped me understand. First, why would you use this versus the gap:splash stuff you see documented at PhoneGap Build? Well, mainly because the gap:splash stuff is PhoneGap Build only. The splashscreen setting will work fine without Build. Secondly, you still have to get into the Java code to actually have this show up. Joe discusses this in a <a href="February 15, 2013 at 1:12 pm">comment</a> to me and it is relatively simple to implement. (And as he points out, soon we should able to skip editing the Java as well.)