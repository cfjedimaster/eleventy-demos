---
layout: post
title: "Blocking Web Sites from Prompting for Notifications"
date: "2019-04-17"
categories: ["development"]
tags: []
banner_image: /images/banners/megaphone.jpg
permalink: /2019/04/17/blocking-web-sites-from-prompting-for-notifications
description: Tired of every darn web site prompting you to enable notifications? Here's a quick guide for disabling them.
---

In general, I'm a fan of new capabilities that come to the web platform. Unfortunately, sometimes a new feature is released that is abused as hell by web sites making you wish the feature had never even been considered. In this case, I don't necessarily blame web developers, as I think they already know that a particular feature is being abused, but rather managers who insist that they know what they're doing and "users really want this". 

And hell, I'm old and cranky so maybe I'm just in the minority. If you are too, then this post is for you.

Have you noticed that nearly every damn site you go to prompts you to enable notifications?

<img src="https://static.raymondcamden.com/images/2019/04/webpush.png" class="imgborder imgcenter">
<p style="text-align:center;font-size:12px"><i>Image from <a href="https://support.mozilla.org/en-US/kb/push-notifications-firefox">Mozilla.org</a></i></p>

This is part of the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Push_API">Push API</a> which in itself is a good idea, but apparently 90% of the internet decided that on your very first visit to their web page they were going to prompt you to enable notifications.

This is basically the same as meeting someone for the first time and them asking if they can bring a few things over to put in your bathroom for when they spend the night. 

I wouldn't mind this so much if it wasn't so obtrusive. You could wait till the person has visited a few times, or include UI in the header/footer some place where the user could click to initiate the process. That's never going to happen. Luckily you can disable it.

Thanks go to [Dan Callahan](https://dancallahan.info/) of the Mozilla organization for sharing the following two links. 

First, here is how you disable it in Firefox: <https://support.mozilla.org/en-US/kb/push-notifications-firefox#w_how-do-i-stop-firefox-asking-me-to-allow-notifications>

While you should follow that link in case it changes, the gist is:

* Click `Options` from the menu button.
* Select `Privacy & Security` and scroll to permissions.
* Click `Settings` next to Notifications
* Click the checkbox on `Block new requests to allow notifications`

This is the *global* block and Firefox does allow site by site settings. 

As an aside, Firefox considers this notification spam an issue too and is taking steps to reduce it: [Reducing Notification Permission Prompt Spam in Firefox](https://blog.nightly.mozilla.org/2019/04/01/reducing-notification-permission-prompt-spam-in-firefox/)

And here is how you do it in Chrome: <https://www.ghacks.net/2016/02/19/disable-show-notifications-prompts-in-google-chrome/>

As I said with the Firefox link, you should hit the above URL in case it changes, but the process is:

* Go to `chrome://settings/content`.
* Click `Notifications`
* And then toggle the top setting from `Ask before sending` to `Blocked`. Chrome wants you to think `Ask` is recommended. Screw that.

And finally, believe it or not Safari also supports Web Push. While I couldn't find a URL to share, you can go to `Preferences`, then `Websites`, and click on `Notifications`. They also allow a global "Leave me the frack alone" setting:

<img src="https://static.raymondcamden.com/images/2019/04/safari.png" class="imgborder imgcenter">

That's it. I hope this helps!

<i>Header photo by <a href="https://unsplash.com/photos/ASKeuOZqhYU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jason Rosewell</a> on Unsplash</i>

