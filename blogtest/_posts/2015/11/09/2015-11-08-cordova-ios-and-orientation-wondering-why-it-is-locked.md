---
layout: post
title: "Cordova, iOS, and Orientation - wondering why it is locked?"
date: "2015-11-09T10:49:07+06:00"
categories: [development,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/11/09/cordova-ios-and-orientation-wondering-why-it-is-locked
guid: 7076
---

I'm not sure if this is new behavior, but if it isn't, I haven't run into this till last week. I was working on a project with Ionic (<a href="http://www.raymondcamden.com/2015/11/05/cordova-demo-apple-tv-hd-video-viewer">Cordova Demo – Apple TV HD Video Viewer</a>) and ran into something odd. When I rotated the device, the orientation did not change. I quickly made a virgin Cordova project to see if I could confirm it there as well - and I did.

<!--more-->

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/Simulator-Screen-Shot-Nov-9-2015-10.46.48-AM.png" alt="Simulator Screen Shot Nov 9, 2015, 10.46.48 AM" width="700" height="394" class="aligncenter size-full wp-image-7077" />

I knew that Cordova supports a preference to lock orientation, and I checked my config.xml to ensure there wasn't a "lock" there. Turns out, I was half-wrong. 


If you check the docs (<a href="http://cordova.apache.org/docs/en/latest/config_ref/index.html">The config.xml File</a>) you'll discover this little tidbit:

<blockquote>
Orientation (string, defaults to <strong>default</strong>): allows you to lock orientation and prevent the interface from rotating in response to changes in orientation. Possible values are default, landscape or portrait. Example:
</blockquote>

Note the "defaults to default" aspect - that's crucial. 

A bit later in the doc you then see this:

<blockquote>
For iOS, to specify both portrait & landscape mode you would use the platform specific value all
</blockquote>

So to be clear, for iOS, <code>default</code> is portrait only. For Android, <code>default</code> allows for all orientations. In order for your application to support both (well, all four technically) orientations in iOS, you will want to specifically allow that:

<pre><code class="language-markup">
&lt;platform name="ios"&gt;
    &lt;preference name="Orientation" value="all" /&gt;
&lt;/platform&gt;
</code></pre>

Note how the preference is wrapped in a <code>platform</code> tag. Don't forget you can set values just for particular platforms within your config.xml file. 

So as always - when I post stuff like this I'm always curious to know if everyone else knew this but me. Let me know in the comments below. Thanks to @riddlerdev in the Ionic Slack for helping me find this last week.