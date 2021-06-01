---
layout: post
title: "Sending a Notification to Alexa when Netlify Builds Your Site"
date: "2019-09-20"
categories: ["development"]
tags: []
banner_image: /images/banners/zerohearts.jpg
permalink: /2019/09/20/sending-a-notification-to-alexa-when-netlify-builds-your-site
description: How to use a custom skill and Netlify webhooks to update Alexa on your site builds
---

This will be a quick post and credit for the idea goes to [Stacey Higgenbotham](https://twitter.com/gigastacey/) and her post from last year, ["How to trigger custom Alexa notifications from a smart home event"](https://staceyoniot.com/how-to-trigger-custom-alexa-notifications-from-a-smart-home-event/). 

In her post, she describes how to use the [Notify Me](https://www.amazon.com/Thomptronics-Notify-Me/dp/B07BB2FYFS/ref=sr_1_1) skill on Alexa to allow for custom notifications. When you add the "Notify Me" skill to Alexa, you get an email with a unique access code. You can then head over to the web site, <https://www.thomptronics.com/about/notify-me>, and check out the docs. At the simplest level, you can just hit a URL like so:

https://api.notifymyecho.com/v1/NotifyMe?notification=Hello%20World!&accessCode=ACCESS_CODE

That's the entire API, seriously. You can pass an additional title attribute and the API is flexible in terms of accepting GET, POST, or PUT. Here's an example of how it looks on my Echo Spot.

<img src="https://static.raymondcamden.com/images/2019/09/notification1.png" alt="Example of Alexa notification being shown" class="imgborder imgcenter">

In this case, the text of the notification is not visible, just the title, but if I ask her for my notifications, I'll hear the full text. 

Given that you've enabled the skill and gotten your access code, then how would you set it up to get notifications on builds? 

Log in to Netlify, go to your site, Settings, "Build &amp; deploy", and then finally "Deploy notifications":

<img src="https://static.raymondcamden.com/images/2019/09/notification2.png" alt="Netlify's list of notifications" class="imgborder imgcenter">

Click the "Add notification" button and select "Outgoing webhook":

<img src="https://static.raymondcamden.com/images/2019/09/notification3.png" alt="Menu for notification optins" class="imgborder imgcenter">

First figure out what you want to be notified on, most likely "Deploy succeeded", and in the URL enter the URL in the form I shared above. Perhaps something like this:

	https://api.notifymyecho.com/v1/NotifyMe?notification=Build%20Done&title=Build%20Done!&accessCode=ACCESS_CODE

Remember that only the title will be visible, but you could include more information in the notification part to provide context, perhaps the name of the site that was deployed.

<img src="https://static.raymondcamden.com/images/2019/09/notification4.png" alt="Example webhook value" class="imgborder imgcenter">

And that's it! If you want you can go to the "Deploys" menu and hit "Trigger deploy" to force a new build. I wish there was a bit more control over the UI of the notification, but for a free service I'll take it.

<i>Header photo by <a href="https://unsplash.com/@prateekkatyal?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Prateek Katyal</a> on Unsplash</i>