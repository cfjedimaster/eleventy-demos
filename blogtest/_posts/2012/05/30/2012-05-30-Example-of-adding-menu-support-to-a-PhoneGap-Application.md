---
layout: post
title: "Example of adding menu support to a PhoneGap Application"
date: "2012-05-30T15:05:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2012/05/30/Example-of-adding-menu-support-to-a-PhoneGap-Application
guid: 4635
---

Last night a fellow on Twitter asked about how to build in menu-key support in PhoneGap. I promised him a simple application that demonstrated this feature and would - hopefully - give him something to build on. Much like my <a href="http://www.raymondcamden.com/index.cfm/2012/5/23/Context-Menu-Example-with-jQuery-Mobile">earlier blog post</a> on adding a context menu to a jQuery Mobile application, the process breaks down to two parts:
<!--more-->
First - we build in support for noticing the menu button click. Second - we build the UI to create (or hide) a menu. Let's take a look at a simple demonstration of this.

The <a href="http://docs.phonegap.com/en/1.7.0/cordova_events_events.md.html#menubutton">official API docs</a> for the menu button event demonstrates that it is rather trivial to listen for the click. Of course, this only applies to Android and Blackberry devices, but the code is just an event listener: document.addEventListener("menubutton", yourCallbackFunction, false);

I began with an HTML page that simply listened for this button and logged it to the console.

<script src="https://gist.github.com/2838035.js"> </script>

I pushed this to my device and confirmed that I could see when the menu button was clicked. (Need help with that? See <a href="http://www.raymondcamden.com/index.cfm/2012/5/10/Setting-up-console-debugging-for-PhoneGap-and-Android">this blog post</a> on the topic.)

As I said - this part is trivial. Now that I know when the menu button is clicked, I need to create some type of UI element. Remember - I'm where design goes to die. Many Android apps tend to create a squarish menu towards the middle bottom of the application. So I created a div, positioned it, and hid it by default. I then used a tiny bit of JavaScript to either show or hide the div.

<script src="https://gist.github.com/2838060.js?file=index.html"></script>

Nothing too much to it, right? Here's how the application looks when I start it...

<img src="https://static.raymondcamden.com/images/shot12.png" />

And here is it with the menu open:

<img src="https://static.raymondcamden.com/images/shot21.png" />

That's it. Obviously it could look a lot better. Also - my links don't actually do anything. A real application would not only listen out for those clicks but also ensure they dispose of the menu. But hopefully this gives you enough to get started.