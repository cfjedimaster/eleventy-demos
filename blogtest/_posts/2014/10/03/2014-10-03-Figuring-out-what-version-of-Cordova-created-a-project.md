---
layout: post
title: "Figuring out what version of Cordova created a project"
date: "2014-10-03T17:10:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2014/10/03/Figuring-out-what-version-of-Cordova-created-a-project
guid: 5324
---

<p>
Earlier today a user on Twitter asked how one could determine the version of Cordova used to create a project. As far as I knew there wasn't really a way to determine this, especially since there are <i>multiple</i> versions in play now. But I double checked on the main developer list just to be sure.
</p>
<!--more-->
<p>
Once again, Cordova contributor Michal Mocny chimed in to provide some context. What follows is a summarized version of what he said. It meshes with what I knew as well so that makes it doubly true. ;)
</p>

<p>
While the "main" release of Cordova is (at the time I write this) 3.6.3, there are actually version numbers for the command line interface, each platform, and each individual plugin. In theory you should be more concerned with the platform and plugin versions. If the CLI updates, that may impact what you can do with the CLI (like some new feature), but it isn't changing what your application can do. 
</p>

<p>
You can determine what version was used for your platforms by typing <code>cordova platforms</code>, as seen here:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s125.png" />
</p>

<p>
And of course the same can be done for plugins:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s220.png" />
</p>

<p>
So long story short - your main concern is with the versions of each platform and plugin. 
</p>