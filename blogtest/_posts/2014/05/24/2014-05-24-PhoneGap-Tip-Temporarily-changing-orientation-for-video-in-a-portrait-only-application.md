---
layout: post
title: "PhoneGap Tip: Temporarily changing orientation for video in a portrait only application"
date: "2014-05-24T17:05:00+06:00"
categories: [javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2014/05/24/phonegap-tip-temporarily-changing-orientation-for-video-in-a-portrait-only-application
guid: 5230
---

<p>
That's probably the longest title I ever used for a blog post. A PhoneGap user came to me recently with an interesting problem. His application was set to be portrait only. In case you weren't aware, you can lock orientation for an application using this config.xml value:
</p>
<!--more-->
<pre><code class="language-markup">&lt;preference name="orientation" value="portrait"/&gt;</code></pre>

<p>
While this works well, he wanted to do videos in landscape mode instead. He had it working fine in iOS but nothing he tried would work for Android. I began by looking for a plugin to allow me to switch orientation dynamically. This one, <a href="http://plugins.cordova.io/#/package/net.yoik.cordova.plugins.screenorientation">http://plugins.cordova.io/#/package/net.yoik.cordova.plugins.screenorientation</a>, worked great. 
</p>

<p>
So at this point - I found the code in the application that fired off the video to go into full screen mode, and added the two simple lines of code to set orientation to landscape.
</p>


<pre><code class="language-javascript">video.addEventListener('playing', function() {
     var so = cordova.plugins.screenorientation;
     so.setOrientation(so.Orientation.LANDSCAPE);
}, false);</code></pre>

<p>
This worked great. All in all this part took me 15 minutes. But then I had a problem - how to <i>leave</i> this mode. Turns out this was pretty difficult. When I looked at the set of <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events">events</a> for media tags, none of them handled the case I needed - the user hitting the back button. I could listen for the video ending, but in theory the user may wish to watch the video twice. I couldn't find any way of noticing the user <i>leaving</i> the video. Then I looked back to the code I had originally modified - the one fired when the video began. The user had entered full screen mode like so:
</p>


<pre><code class="language-javascript">if (video.webkitEnterFullScreen)
    video.webkitEnterFullScreen();
else if (video.webkitRequestFullScreen)
    video.webkitRequestFullScreen();
else if (video.requestFullscreen)
    video.requestFullscreen();
</code></pre>

<p>
I did some digging and discovered you could listen for the user leaving full screen mode, which happened automatically when they hit their back button.
</p>


<pre><code class="language-javascript">jQuery(document).on('webkitfullscreenchange', function(e) {       
    if(!e.currentTarget.webkitIsFullScreen) {
        var so = cordova.plugins.screenorientation;
        so.setOrientation(so.Orientation.PORTRAIT);
    }
}); </code></pre>

<p>
In the example above we check to see if the device is currently in full screen, and if not, i.e. they were leaving it, we go back to portrait. In theory I could use this one event handler to handle switching it to landscape too. 
</p>

<p>
Any way - I hope this helps others!
</p>