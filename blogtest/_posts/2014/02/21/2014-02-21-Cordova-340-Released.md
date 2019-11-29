---
layout: post
title: "Cordova 3.4.0 Released"
date: "2014-02-21T17:02:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/02/21/Cordova-340-Released
guid: 5161
---

<p>
Yesterday was the official release of Cordova 3.4.0. You can read the blog post <a href="http://cordova.apache.org/announcements/2014/02/20/cordova-340.html">here</a> but I thought I'd call out some interesting tidbits.
</p>
<!--more-->
<p>
This is the first release to include support for Firefox OS. You can now add it as a platform and start working on Firefox OS apps! There is an excellent blog post on it that goes into detail: <a href="https://hacks.mozilla.org/2014/02/building-cordova-apps-for-firefox-os/">Building Cordova apps for Firefox OS</a>. On another note, the Mozillians (my term, not theirs) are giving out hardware for folks looking to port to Firefox OS: <a href="https://hacks.mozilla.org/2014/02/firefox-apps-programs-2014/">Wanted: Awesome HTML5 app ports for Firefox OS & the Open Web</a>. Personally I'm holding out for the first tablet. 
</p>

<p>
You can now run "cordova platform check" in a project to see if it can be updated. I did this with a project I created last week and got this:
</p>

<img src="https://static.raymondcamden.com/images/Screenshot_2_21_14__4_41_PM.png" />

<p>
Apparently, and this may have happened earlier, you can now "cordova run ios" to push an app to an iOS device. It takes about 15 seconds to get on the device but then takes a <i>very</i> long time to fire deviceready. The command sits there and you have to cmd+c to stop it, but that keeps the process running in the background and you must kill ios-deploy if you try to run it again. So something tells me this isn't really ready for prime time yet. I posted a note to the Google Group but didn't get a response.
</p>

<p>
Finally, the docs now lead you to the plugins repository for docs. So this thing:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_2_21_14__4_44_PM.png" />
</p>

<p>
Is now this...
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_2_21_14__4_45_PM.png" />
</p>

<p>
Don't fret - the docs are still there - but by pointing directly to the plugin repository it means the Cordova folks don't have to keep copying and pasting documentation when plugins are updated.
</p>