---
layout: post
title: "Seeing two geolocation prompts in a PhoneGap/Cordova application?"
date: "2013-11-02T13:11:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2013/11/02/Seeing-two-geolocation-prompts-in-a-PhoneGapCordova-application
guid: 5076
---

<p>
Are you using geolocation in your PhoneGap/Cordova application and seeing two prompts?
</p>
<!--more-->
<p>
I was. Even more odd was the fact that one had the "nice" application name and one was the full path to the index.html. See the screen shots below.
</p>

<p>
<img src="https://static.raymondcamden.com/images/good.png" />
</p>

<p>
<img src="https://static.raymondcamden.com/images/bad.png" />
</p>

<p>
In all my Googling for this issue, all I could find were warnings about using geolocation before the deviceready event had fired. I definitely had not made <i>that</i> mistake, so I was truly confused. Also - none of these reports mentioned <i>multiple</i> prompts. To make things even more confusing - if I reran my application I would only get the second, ugly, prompt. An application is supposed to remember that you gave it permission, so what the heck, right?
</p>

<p>
Turns out that I made the same mistake others have made with Cordova 3.0 - I forgot to add the geolocation plugin!
</p>

<pre><code class="language-markup">cordova plugin add org.apache.cordova.geolocation</code></pre>

Even without the plugin you are still able to use geolocation. I have no idea why it prompted twice (I'm sure some of the engineers could explain it), but as soon as I added the plugin the second prompt went away.