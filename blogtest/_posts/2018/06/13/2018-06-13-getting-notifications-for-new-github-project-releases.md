---
layout: post
title: "Getting Notifications for New GitHub Project Releases"
date: "2018-06-13"
categories: [development]
tags: [development]
banner_image: /images/banners/releases.jpg
permalink: /2018/06/13/getting-notifications-for-new-github-project-releases
---

This is one more post covering something that I assume most folks knew already. I just discovered this a few weeks ago myself. It definitely isn't new, and in fact, you can find a StackOverflow answer covering this from [two years ago](https://stackoverflow.com/questions/20839622/notifications-for-new-github-project-releases). But as I usually do - I share what I learn since I figure I can't be the only one who missed this.

So as the title says - how can you get notifications for new releases of a project at GitHub? Turns out every repo has an Atom feed available at:

https://github.com/(org or user)/(repo)/releases.atom

So for example, here is the feed for one of my favorite new projects, [VuePress](https://vuepress.vuejs.org/):

[https://github.com/vuejs/vuepress/releases.atom](https://github.com/vuejs/vuepress/releases.atom)

And that's really it. Of course, the 'notifications' aspect involves reading the Atom feed and figuring out when something new has been added. Luckily, [IFTTT](https://ifttt.com/discover) has a service for this. If you've never used it, IFTTT is essentially an "automation" service for the web with hundreds of plugins/connections/etc for various services. One of the simplest solutions they have is a "email me on new item in a RSS feed" service. That works great for blogs that don't have a subscription feature and it works great here as well.

Simply [create a new applet](https://ifttt.com/create) and on the first step, select RSS Feed:

![I like arrows](https://static.raymondcamden.com/images/2018/05/ifttt1.jpg)

Then select "New feed item":

![I love arrows](https://static.raymondcamden.com/images/2018/05/ifttt2.jpg)

And then paste in the feed URL:

![Sorry, no arrows](https://static.raymondcamden.com/images/2018/05/ifttt3.jpg)

Click "Create trigger" and then you move onto the "that" aspect (i.e. what should happen when a new item appears in the feed). On the action service page, select email:

![Woot the arrows are back!](https://static.raymondcamden.com/images/2018/05/ifttt4.jpg)

This only gives you one option (so I'll skip the screenshot), "Send me an email". You can now customize the email. I suggest adding a prefix to the Subject to make it obvious what is going on:

![Sigh, no arrows](https://static.raymondcamden.com/images/2018/05/ifttt5.jpg)

You can customize more there too if you want. Finally click "Create action". You'll get to the review page and you want to make sure you then hit the "Finish" button.

And that's it. I hope this is helpful!

<i>Header photo by <a href="https://unsplash.com/photos/TLBplYQvqn0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ankush Minda</a> on Unsplash</i>