---
layout: post
title: "Context Menu Example with jQuery Mobile"
date: "2012-05-23T11:05:00+06:00"
categories: [development,html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/05/23/Context-Menu-Example-with-jQuery-Mobile
guid: 4627
---

Yesterday a reader asked me about building context menu support for images within a jQuery Mobile operation. Turns out it's pretty easy. Obviously there is no such thing as a right-click menu on a touch device. That being said - the convention that most mobile applications use is a "taphold" listener. You touch the item with your finger and wait. In a second or two, the context menu pops up. The <a href="http://jquerymobile.com/demos/1.1.0/docs/api/events.html">taphold</a> event is trivial to use in jQuery Mobile (with a caveat I'll get to in a second), but what <i>isn't</i> as trivial is deciding what UI to use. jQuery Mobile will - soon - have a popup UI item. For now though I decided on the excellent <a href="http://dev.jtsage.com/jQM-SimpleDialog/demos2/">SimpleDialog2</a> plugin by JTSage. Let's look at an example.
<!--more-->
<script src="https://gist.github.com/2775669.js?file=gistfile1.html"></script>

I've taken a few simple images and embedded them into the page. Note that each employs a class, touchableImage. 

In the code block at the bottom, I register an event listener for the taphold event and fire off a call to the SimpleDialog2 control. I won't go into a lot of detail over the options, use the link above for details, but I basically wanted a non-modal window with a set of options for the image. (For now those links don't actually do anything, but you get the idea.) You can demo this yourself below. Remember that if you are not on a touch device, you're screwed, unless you use Chrome which allows you to emulate touch events now.


<a href="http://raymondcamden.com/demos/2012/may/23/"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>

Here's a quick screen shot so you can see it in action.

<img src="https://static.raymondcamden.com/images/photo2.PNG" />

Ok, if you want to stop reading now, you can. What follows is an interesting issue I discovered with iOS and tap events and how I debugged it using <a href="http://labs.adobe.com/technologies/shadow/">Adobe Shadow</a>. Still here? Ok, I warned you.

One of the nice features of the SimpleDialog2 control is that you can auto-dismiss it if you click anywhere else in the DOM. The attribute, forceInput, when set to false, allows for easy dismissal of the control. I wanted to use that feature, and it worked great in Android, but on iOS, it did not. As soon as the dialog showed up it went away.

Here's where Shadow comes in. I was using Shadow to load the page and I remembered that I could use the console there too. I added a quick event listener for tap, went back to the iPad, and tested again. I saw my first tap event, I saw the taphold, and when I lifted my finger, I saw another tap event! Apparently this is (I believe) normal for iOS. You can see some discussion of this <a href="https://github.com/jquery/jquery-mobile/issues/3803">here</a>.

So for now, I switched forceInput to true which requires the user to forcibly close the dialog, which isn't horrible I guess. I could - possibly - sniff for iOS/Android and toggle the field depending on the platform, but for now, I'm satisfied with it.

And once again - Shadow helps save the day. I know I sound like a broken record, and I know I work for Adobe, but damn, this is probably one of the best development tools I've used in a long time.