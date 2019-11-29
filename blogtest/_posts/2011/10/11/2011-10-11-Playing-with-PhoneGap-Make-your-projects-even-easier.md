---
layout: post
title: "Playing with PhoneGap? Make your projects even easier"
date: "2011-10-11T12:10:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2011/10/11/Playing-with-PhoneGap-Make-your-projects-even-easier
guid: 4387
---

The documentation for creating PhoneGap projects in Eclipse is pretty simple (<a href="http://www.phonegap.com/start#android">link</a>), but at 6 or so steps it isn't terribly difficult to make a mistake. While there doesn't seem to be an "official" plugin yet, you should check out the <a href="http://wiki.phonegap.com/w/page/34483744/PhoneGap{% raw %}%20Eclipse%{% endraw %}20PlugIn{% raw %}%20for%{% endraw %}20Android">MDS PhoneGap Eclipse</a> plugin. I installed this just now and it worked great. A few caveats though...

<ul>
<li>The plugin currently ships with PhoneGap 1.0, not 1.1. But if you download PhoneGap and extract it, you can point the plugin to the folder for 1.1 and it will make use of that.
<li>The plugin will also automatically add jQuery Mobile or Sencha Touch. But the version of jQuery Mobile is <i>quite</i> old. I'd skip that option for now.
</ul>

All in all - this took a 10 minute process that I had to pay particular attention to into a 2 minute process that even my kitten can do. 

<b>Edit:</b> One thing I forgot to mention. When you create the project there will be an error. Open AndroidManifest.xml and remove this: android:xlargeScreens="true". That should clear up the bug that appears on project creation.

<img src="https://static.raymondcamden.com/images/kitten-mind-meld.jpg" title="Yes, this picture IS appropriate for the blog entry and is NOT just an excuse to be silly." />