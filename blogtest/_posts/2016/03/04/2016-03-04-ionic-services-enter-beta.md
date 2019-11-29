---
layout: post
title: "Ionic Services enter Beta"
date: "2016-03-04T06:44:00-07:00"
categories: [mobile]
tags: [ionic]
banner_image: /images/banners/ionic_logo.jpg
permalink: /2016/03/04/ionic-services-enter-beta
---

I've done multiple blog posts and presentations on Ionic services, and I'm happy to see that they are (albeit a bit slowly) moving closer to 1.0. While I do not see an "official" launch yet, this week the suite of Ionic services (Push, Analytic, Deploy, Package, and User) all entered Beta. So what's changed?

<!--more-->

Users
--

In the past when I've spoken about Ionic services, I've always described the User system as "Users Light." It was a pretty - well - 'casual' user system. It didn't do authentication. It basically acted as an association system. You say you're user X? Fine - then when I do a push I'll let you target X. When you fire off an analytic event, I'll associate it with X. I would specifically compare it to Parse's excellent User system and say that this was *not* like it at all. 

In the Beta, this has changed completely. While not 100% up to par with what Parse had, it now has proper authentication. If you try to add a new user that already exists, it will recognize that. If you properly handle authentication of a username and password. Not only that, you've got built in support for social network via Facebook, GitHub, Google, Instagram, LinkedIn, and Twitter. You can even set up your own authentication provider on your own server. 

The more I look at it, actually, the more I think it is pretty darn close to what Parse provided. I'm a bit rusty (and frankly, why bother checking since it is on the way out anyway), but I think it may be pretty darn close to feature parity with what I remember. Right now I can't even say what else you would need. 

The important thing to keep in mind though is that it's gone from pretty much an "accessory" service to the 'real' ones to something that feels a heck of a lot more solid and complete. That's awesome! 

Push
--

Push has been updated as well, including code changes and updates to the UI you can use on the Ionic site itself for testing. Especially nice are testing options for the iOS and Android specific push items, like badge numbers and sounds. This was useable before of course, but having it in the UI to test easier makes things - well - easier.

As for the service itself, you can now send a message to everyone or specific users. Error messages and message status reporting has also been improved. 

Security Profiles
--

This isn't new, but had a limited launch recently. Security profiles simply handles certificate information for various services in one convenient location. Currently this integrates with the Package and Push service. Once you've got a security profile setup for your platforms, each of the supported services can make use of your certificates without you having to constantly re-apply them. 

API
--

*Finally!* I've been bugging the Ionic folks about this since the initial release of their services. While they have always had an API behind them, of course, they weren't documented. Now there's documentation for the User, Push, and Deploy APIs. Analytics will come in the future. This lets you create your own dashboards/admins to integrate with your Ionic mobile app. Note that for the supported services, the docs aren't complete yet so more will be coming there as well. 

And more!
--

This is just a quick overview of the updates, and as I said, you can expect an official announcement from the Ionic folks in a few days. Check out the [docs](http://docs.ionic.io/docs) for more information. I'm planning on creating quite a bit of media for their services, but I'll probably wait until the RC or final version is launched. In the meantime though if you have any questions, let me know and I'll try to help. Even better, 
sign up for the [Ionic Slack](http://ionicworldwide.herokuapp.com/) channel to speak to the Ionic folks directly!