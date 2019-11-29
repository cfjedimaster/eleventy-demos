---
layout: post
title: "Can't find Cordova plugin docs?"
date: "2015-04-29T08:33:39+06:00"
categories: [development,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/04/29/cant-find-cordova-plugin-docs
guid: 6078
---

With the last big release of Apache Cordova, plugins have now moved to npm. (Details may be found here: <a href="http://cordova.apache.org/announcements/2015/04/21/plugins-release-and-move-to-npm.html">Plugins Release and Moving plugins to npm: April 21, 2015</a>. One <i>temporary</i> side effect of this move is that the documentation is no longer working. So for example, when you go to the <a href="https://www.npmjs.com/package/cordova-plugin-camera">Camera plugin</a> page, you see this:

<!--more-->

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot17.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot17.png" alt="shot1" width="850" height="469" class="alignnone size-full wp-image-6079" /></a>

This is simply a bug and one that will be fixed soon. (And if you're curious, you can track the bug here: <a href="https://github.com/npm/newww/issues/622">Markdown incompatible with GitHub flavour markdown</a>) In the meantime, you've got a simple way to get to the docs.

Click the repo link on the right hand side:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot23.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot23.png" alt="shot2" width="850" height="469" class="alignnone size-full wp-image-6080" /></a>

This takes you to the repo at Apache, which may be a bit weird to you if you've only used GitHub before. Click <code>tree</code> to go to the source tree:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot32.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot32.png" alt="shot3" width="850" height="557" class="alignnone size-full wp-image-6081" /></a>

Then click the <code>Raw</code> link next to README.md. (Note there is also a useful RELEASENOTES.md file as well.)

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot42.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot42.png" alt="shot4" width="850" height="779" class="alignnone size-full wp-image-6082" /></a>

And there ya go - the docs. Obviously this won't be an issue for long, but for folks who may not be familiar with npm and Apache's repo system, I thought this might help.