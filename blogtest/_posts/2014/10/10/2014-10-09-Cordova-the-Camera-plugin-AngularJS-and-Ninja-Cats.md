---
layout: post
title: "Cordova, the Camera plugin, AngularJS, and Ninja Cats."
date: "2014-10-10T10:10:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2014/10/10/Cordova-the-Camera-plugin-AngularJS-and-Ninja-Cats
guid: 5331
---

<p>
Just a random tip for folks who may run into this in the future. I'm working on a mobile app for a client and I'm using both Cordova and AngularJS. The application allows people to select a photo from their gallery or take a new picture. It then renders a thumbnail to the web page. It supports any number of selections so my view simply loops over an array.
</p>
<!--more-->
<pre><code class="language-markup">&lt;img ng-repeat=&quot;pic in groupPics[group.part]&quot; ng-src=&quot;{% raw %}{{pic}}{% endraw %}&quot; ng-click=&quot;removePicture(group.part,pic)&quot; class=&quot;img-thumbnail&quot; style=&quot;width:120px; height: 120px&quot;&gt;</code></pre>

<p>
Pretty simple, right? In my testing I always used the simulator as it doesn't have a real camera, and I typically tested on iOS only since they were testing Android. Also, the camera is pretty simple to use so it just plain works most of the time.
</p>

<p>
But then the client reported something odd. Whenever he selected a picture from the gallery, the image thumbnail would show up broken. I quickly ran it (and since I said quickly you know I used Genymotion and not the Android emulator) and confirmed it failed. Like any other good hybrid developer I fired up my dev tools and checked the console. This is what I saw.
</p>

<p>
<code>
GET unsafe:content://com.android.providers.media.documents/document/image%3A21  
</code>
</p>

<p>
Some Googling turned up this <a href="http://stackoverflow.com/questions/15606751/angular-changes-urls-to-unsafe-in-extension-page">Stackoverflow post</a>. Long story short - it is an Angular security measure. I've run into Angular security stuff before (trying to inject HTML into the DOM) so this isn't the first time I've had an issue like this, but it threw me for a loop since it worked in iOS. If you look at the file URI returned by Camera/Gallery selections though it makes a bit more sense. Here is an example of a file URI returned from iOS (spaces added so it will wrap):
</p>

<pre><code>file:///Users/ray/Library/Developer/CoreSimulator/Devices/ C8202B3B-300B-4819-8CD3-4C4AA690CE7C/ data/Applications/D82BF64E-6DD1-4645-B637-BCF65001FD29/tmp/cdv_photo_003.jpg</code></pre>

<p>
The exact same code on Android returns a file URI like so:
</p>

<pre><code>content://com.android.providers.media.documents/document/image%3A21</code></pre>

<p>
Angular sees this as something weird and says, "No Way Man!". Luckily the fix is simple. In my application's configure block, I added this:
</p>

<pre><code class="language-javascript">$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?{% raw %}|ftp|{% endraw %}mailto|content):/);</code></pre>
       
<p>
So, keep it in mind if you are using the camera in a Cordova/AngularJS application.
</p>

<p>
Ninja cat provided for no good reason.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Ninja_cat.jpg" />
</p>