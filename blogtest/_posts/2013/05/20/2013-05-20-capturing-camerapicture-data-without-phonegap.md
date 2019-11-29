---
layout: post
title: "Capturing camera/picture data without PhoneGap"
date: "2013-05-20T12:05:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2013/05/20/capturing-camerapicture-data-without-phonegap
guid: 4937
---

<strong>Two years later and this blog post is still highly popular. If you like this content, be sure to <a href="https://feedburner.google.com/fb/a/mailverify?uri=RaymondCamdensBlog&loc=en_US">subscribe</a> to the blog to get the latest updates. You may also want to check out my <a href="http://www.manning.com/camden">Apache Cordova book</a> and the <a href="/about-me">JavaScript videos</a> I have available.</strong>

As people know, I'm a huge fan of PhoneGap and what it allows me to do with JavaScript, HTML, and CSS. But I think it is crucial to remember that you don't <i>always</i> need PhoneGap. A great example of that is camera access. Did you know that recent mobile browsers support accessing the camera directly from HTML and JavaScript? Let's look at an example.
<!--more-->
Over a year ago I wrote a <a href="http://www.raymondcamden.com/index.cfm/2012/1/13/Demo-of-Color-Palettes-and-PhoneGap">blog post</a> in which I created an application called "Color Thief." This application made use of PhoneGap's Camera API and a third party JavaScript library called <a href="http://lokeshdhakar.com/projects/color-thief/">Color Thief</a>. I loved this example because it demonstrated how you could combine the extra power that PhoneGap provides along with existing JavaScript libraries. 

This morning I watched an excellent Google IO presentation (<a href="https://www.youtube.com/watch?v=EPYnGFEcis4&feature=youtube_gdata_player">https://www.youtube.com/watch?v=EPYnGFEcis4&feature=youtube_gdata_player</a>) on Mobile HTML. It was an overview of some of the exciting stuff you can now do with mobile HTML and JavaScript. To be clear, this was all without using wrappers like PhoneGap.

In one of the examples the presenters discussed the new "capture" support for the input/file field type. This is rather simple to implement:

&lt;input type="file" capture="camera" accept="image/*" id="takePictureField"&gt;

If supported (recent Android and latest iOS), the user can then use their camera to select a picture. I decided to rebuild my old demo to skip PhoneGap completely and just make use of this feature. Here's the code:

<script src="https://gist.github.com/cfjedimaster/5613113.js"></script>

For the most part, this is pretty similar to the last version. I no longer wait for the deviceready event, but instead just listen for the document itself to load. Instead of listening for a button click, I've switched to an input field using type=file. I now listen for the change event, and on that, I see if I have access to a file. If  I do, I can then use the URL object to create a pointer to the source and then simply add it to my DOM. After that, Color Thief takes over.

The only tricky part I ran into was that in iOS the URL object is still prefixed. You can see how I get around that in the startup code. To be fair, this isn't 100% backwards compatible, I could add a few checks in here to ensure that things will work and gracefully let people on older phones know they can't use this feature.

But the end result is nearly the exact same functionality in a web page - no PhoneGap, no native code.

<iframe width="600" height="450" src="https://www.youtube.com/embed/knU2SpymiaI?rel=0" frameborder="0" allowfullscreen></iframe>