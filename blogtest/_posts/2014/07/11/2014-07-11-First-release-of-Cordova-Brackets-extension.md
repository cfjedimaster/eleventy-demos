---
layout: post
title: "First release of Cordova Brackets extension"
date: "2014-07-11T18:07:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2014/07/11/First-release-of-Cordova-Brackets-extension
guid: 5265
---

<p>
I <a href="http://www.raymondcamden.com/2014/7/8/Proof-of-Concept-Cordova-integration-with-Brackets">blogged</a> about this a few days ago, but I think I'm ready to really release my Cordova Brackets extension. The code is pretty much crap and it's really lacking in providing good feedback while it works, but the initial feature list is complete. Assuming you've got the Cordova CLI installed already, you can, via Brackets:
</p>
<!--more-->
<ul>
<li>Add and remove platforms. Warning - if Cordova needs to grab the bits for the platform (it does this once), it will be slow, and again, my extension isn't providing feedback about the operation until it is done, so, like, don't do anything. Go get coffee.</li>
<li>Emulate for a platform.</li>
<li>Not use run.  It doesn't work, which means I kinda lied when I said the initial feature list was complete, but I'm OK with that.</li>
<li>List plugins, along with the version.</li>
<li>Add plugins, and I've got a nice autocomplete so you can quickly find the right plugin.</li>
<li>Remove plugins too. There are bugs around this, so, be careful.</li>
</ul>

<p>
You can see this in action in this thrilling video below. Oddly it is a bit out of focus for the first few seconds, but then it clears up. I blame gremlins.
</p>

<iframe width="650" height="488" src="//www.youtube.com/embed/-FjyvRe_RBk?rel=0" frameborder="0" allowfullscreen></iframe>

<p>
It is now available via the Extension Manager so you can install it directly from within Brackets. If you want to help work on the source, pull a fork over at <a href="https://github.com/cfjedimaster/Cordova-Extension">https://github.com/cfjedimaster/Cordova-Extension</a>. If you really like it, visit the Amazon wishlist and pick up that Marvel Lego game. ;)
</p>