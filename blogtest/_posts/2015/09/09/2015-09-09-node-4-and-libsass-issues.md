---
layout: post
title: "Node 4 and libsass issues?"
date: "2015-09-09T19:32:03+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2015/09/09/node-4-and-libsass-issues
guid: 6748
---

Yesterday I updated to <a href="https://nodejs.org/en/">Node.js 4</a> and today I noticed problems with two apps, <a href="http://harpjs.com">Harp</a> and <a href="http://ionicframework.com">Ionic</a>. Harp was totally broken but Ionic only had issues with the Gulp script. I tried various things, like uninstalling and reinstalling node-sass and Harp itself, but nothing worked. Finally, I found this bug report:

<!--more-->

<a href="https://github.com/sintaxi/harp/issues/436">Error: `libsass` bindings not found when using iojs</a>

I can confirm that by following the steps here I was able to get Harp working, and I reached out to the team at Harp and they said a proper fix will be out very soon. <strong>Update: Harp fixed it.</strong>

As for Ionic, it wasn't an issue with Ionic but with gulp-sass. Luckily there is a document on how to fix that too: <a href="https://github.com/dlmanning/gulp-sass/wiki/Update-to-the-latest-Gulp-Sass">Update to the latest Gulp Sass</a>. I can confirm this fixed my issues with Ionic's gulp script.