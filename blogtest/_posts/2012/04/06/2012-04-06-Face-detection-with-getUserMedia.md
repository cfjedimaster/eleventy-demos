---
layout: post
title: "Face detection with getUserMedia"
date: "2012-04-06T16:04:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/04/06/Face-detection-with-getUserMedia
guid: 4584
---

There are quite a few interesting APIs evolving in the "modern web", but not all of them are going to be things you would use in most projects. I've been very public about my feelings concerning canvas for example. Great for games and charting - but not much else. That doesn't make it a bad feature. It just makes it one I won't use terribly often. Whenever I read about some new cool feature being developed, my mind starts trying to figure out what they could be used for in a <i>practical</i> sense. Obviously what's practical to you may not be practical to me, but figuring out how I would actually use a feature is part of how I learn it.
<!--more-->
<p>

One such feature is getUserMedia (<a href="http://dev.w3.org/2011/webrtc/editor/getusermedia.html">W3C Spec</a>). This is a JavaScript API that gives you access to (with permission) the user's web cam and microphone. getUserMedia is currently supported in Opera and Chrome (I believe it is in version 18 now, but you may need to grab Canary. You also need to enable it. Instructions on that <a href="https://sites.google.com/site/webrtc/running-the-demos">here</a>.) Once you get past actually enabling it, the API is rather simple. Here's a quick request for access:

<p>

<script src="https://gist.github.com/2322128.js?file=gistfile1.js"></script>

<p>

The first argument to getUserMedia is the type. According to the spec, this is supposed to be an object where you enable audio, video, or both, like so: {% raw %}{audio:true, video:true}{% endraw %}. However in my testing, passing a string, "video", worked fine. The demo you will be seeing is based on another demo so that line possibly came from an earlier build that still works with Chrome. The second and third arguments are your success and failure callbacks respectively.

<p>

You can see in the gist where the success handler assigns the video stream to an HTML5 video tag. What's cool then is that once you have that running you can use the Canvas API to take pictures. For a demo of this, check out Greg Miernicki's demo:

<p>

<a href="http://miernicki.com/cam.html">http://miernicki.com/cam.html</a>

<p>

If this demo doesn't work for you - then stop - and try following the instructions again to enable support. (Although I plan on sharing a few screen shots so if you just want to keep reading, that's fine too.)

<p>

Based on Greg's demo, it occurred to me that there is something cool we can do with pictures of our web cams. (Cue the dirty jokes.) I remembered that <a href="http://www.face.com">Face.com</a> had a <i>very</i> cool API for parsing pictures for faces. (I <a href="http://www.raymondcamden.com/index.cfm/2011/11/7/Facecom-API-released">blogged</a> a ColdFusion example back in November.) I wondered then if we could combine Greg's demo with the Face.com API to do some basic facial recognition. 

<p>

Turns out there are a few significant issues with this. First - while Face.com has a nice REST API, how would we use it from a JavaScript application? Secondly - Face.com requires you to either upload a picture or give it a URL. I know I could send a canvas picture to a server and have my backend upload it to Face.com, but is there a way to bypass the server and send the picture right to the API?

<p>

The first issue actually turned out to be a non-issue. Face.com implements <a href="http://dvcs.w3.org/hg/cors/raw-file/tip/Overview.html">CORS</a> (Cross-Origin Resource Sharing). CORS basically allows a server to expose itself to Ajax calls from documents on other domains. It's a great feature and I hope more services enable it. 

<p>

The more complex issue then was taking the canvas data and sending it to Face.com. How can I fake a file upload? Turns out there's another cool new trick - FormData. Fellow ColdFusion blogger Sagar Ganatra has an excellent <a href="http://www.sagarganatra.com/2011/07/submitting-form-using-formdata-object.html">blog entry</a> on the topic. Here's how I used it:

<p>

<script src="https://gist.github.com/2322265.js?file=gistfile1.js"></script>

<p>

Let's look at this line by line. First off - I need to get the binary data from the canvas object. There's a few ways of doing this, but I wanted a Binary Blob specifically. Notice the dataURIToBlob method. This comes from a <a href="http://stackoverflow.com/a/8782422/52160">StackOverflow post</a> I found a few weeks back. 

<p>

I create a new FormData object and then simply begin setting my values. You can see I pass in a few API requirements but the crucial parts are the filename and file object itself. 

<p>

Below that you can see the simple jQuery Ajax call. Face.com has a variety of options, but I basically just asked it to return an estimated age, gender, mood, and whether or not the person was smiling and wearing glasses. That's it. I get a nice JSON packet back and format it.

<p>

Now obviously no API is perfect. I've had different levels of results from using the API. Sometimes it's pretty damn accurate and sometimes it isn't. Overall though it's pretty cool. Here are some scary pictures of yours truly testing it out.

<p>

<img src="https://static.raymondcamden.com/images/s1.png" />
<img src="https://static.raymondcamden.com/images/s2.png" />
<img src="https://static.raymondcamden.com/images/s3.png" />
<img src="https://static.raymondcamden.com/images/s4.png" />

<p>

Ok, ready to test it yourself? Just click the demo button below. For the entire source, just view source! This is 100% client-side code.

<p>

<a href="http://www.raymondcamden.com/demos/2012/mar/29/test1.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

For another look at getUserMedia, check out these examples:

<p>

<ul>
<li><a href="http://html5doctor.com/getusermedia/">It's Curtains for Marital Strife Thanks to getUserMedia</a></li>
<li><a href="https://sites.google.com/site/webrtc/running-the-demos">Testing WebRTC on Chrome</a></li>
<li><a href="http://www.tricedesigns.com/2012/02/02/bleeding-edge-html5-webrtc-device-access/">Bleeding Edge HTML5, WebRTC & Device Access</a></li>
<li><a href="http://www.html5rocks.com/en/tutorials/getusermedia/intro/">Capturing Audio &amp; Video in HTML5</a></li>
</ul>

<b>Edit on May 23:</b> Chrome recently modified the getUserMedia API to match the spec (I believe) which requires you to pass an object of media you want, so instead of "video", I used {% raw %}{video:true}{% endraw %}.