---
layout: post
title: "Reminder on using Ionic for the Web"
date: "2016-09-13T15:16:00-07:00"
categories: [mobile]
tags: [ionic]
banner_image: 
permalink: /2016/09/13/reminder-on-using-ionic-for-the-web
---

Earlier today the Ionic folks published an article about Ionic 2 and PWA (Progressive Web Apps) - ["Announcing PWA support in Ionic 2"](http://blog.ionic.io/announcing-pwa-support-in-ionic-2/). The gist is that - you guessed it - Ionic 2 apps will support PWAs out the box. You don't have to actually make use of PWA of course, but if you want to build an Ionic 2 app for the web, and *not* hybrid mobile, then Ionic has done some of the grunt work to get you started down that path. I thought it might be useful to remind folks how you can build an Ionic web apps instead of hybrid mobile apps.

<!--more-->

First and foremost, if you've been playing with Ionic V2 apps, most likely you've been using the beta version of the Ionic CLI. A few weeks ago the CLI was updated to 2.0 and you should no longer be using the beta version. To be clear, while the Ionic CLI is at version 2, the Ionic framework itself still defaults to version 1 (and Angular 1). To work with V2 apps, you need to pass the `--v2` flag when creating your application. 

To work with a web app, not Cordova, you should add another flag: `-w`. This tells the CLI to not add platforms and other Cordova-related stuff. 

So to summarize - you can create your new app like so:

<code>
ionic start noHybridNoProblem --v2 -w
</code>

Once done, you've good to go. But then you may wonder - how in the heck do you actually *view* your app? Normally I use `ionic emulate ios` to see my builds in the simulator. Since we aren't using Cordova, that's not an option.

Instead - you'll want to use the Gulp script included in the project. Don't worry if you aren't familiar with Gulp, it's basically a simple automation library for projects. To "build" your app into something you can browse, simply do:

<code>
gulp build
</code>

You should see output like so:

![](https://static.raymondcamden.com/images/2016/09/ionic1.png)

And you can then see the results in your `www` folder. When I tested, I used `httpster` to fire up a little web server. Everything worked as expected, but you want to remove the line including `cordova.js` in your index.html file since it won't exist.

Finally, if you want the code to build automatically while you edit, use:

<code>
gulp watch
</code>

That's it. Enjoy.