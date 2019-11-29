---
layout: post
title: "Capturing camera/picture data without PhoneGap - An Update"
date: "2016-06-03T14:41:00-07:00"
categories: [development]
tags: [javascript]
banner_image: 
permalink: /2016/06/03/capturing-camerapicture-data-without-phonegap-an-update
---

Over two years ago I wrote an article about using the device camera on the web without using PhoneGap ([Capturing camera/picture data without PhoneGap](https://www.raymondcamden.com/2013/05/20/capturing-camerapicture-data-without-phonegap/)). While an old blog entry, it is easily one of the most popular entries on this blog in terms of how much traffic it gets. It is also a great reminder that most of us web developers probably forget just how powerful the platform is. The original article discusses the use of the capture attribute in input fields to allow for camera access. The idea was simple - take a regular input/type=file and add the capture attribute:

<!--more-->

<pre><code class="language-javascript">
&lt;input type="file" capture="camera" accept="image/*" id="takePictureField"&gt;
</code></pre>

When used, the browser would then prompt you to select a picture or take a new one with your camera. You can see the original demo below, and my god, iOS has really come a long way since then.

<iframe width="600" height="450" src="https://www.youtube.com/embed/knU2SpymiaI?rel=0" frameborder="0" allowfullscreen></iframe>

I thought it would be interesting to take a look at this feature and see if it has changed any in the past two years.

I began by checking into the official spec. This proved a bit difficult. While there is a spec for [Media Capture and Streams](https://www.w3.org/TR/mediacapture-streams/), I was more interested in the particulars of the syntax in regards to the `input` tag.

I went to MozDevNet's [input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input) page and it had this to say about the capture attribute:

<blockquote>
When the value of the type attribute is file, the presence of this Boolean attribute indicates that capture of media directly from the device's environment using a media capture mechanism is preferred.
</blockquote>

Note - "this Boolean". When I last worked with this code it wasn't a boolean but rather a value specifying camera. 

To make things even more interesting, this older article from 2013, [Capturing Audio & Video in HTML5](http://www.html5rocks.com/en/tutorials/getusermedia/intro/) used the accept attribute instead:

<pre><code class="language-javascript">
&lt;input type="file" accept="image/*;capture=camera"&gt;
</code></pre>

Back on the MDN page, if you look at the `accept` attribute, nothing about this is mentioned. However, their docs on capture link to a [spec](https://www.w3.org/TR/html-media-capture/#dfn-media-capture-mechanism) that mentions:

<blockquote>
If the accept attribute's value is set to a MIME type that has no *associated capture control type*, the user agent must act as if there was no capture attribute.
</blockquote>

Notice the "associated capture control type"? So that seems to imply that - officially - you should use `capture="true"` along with the `accept` attribute which may or may not specify a particular capture type or may stay nice and vague, i.e. `accept="video/*"`. 

Clear as mud, right? Ok, so let's play with this a bit. I built a demo that tried to hit a few variations of this:

<pre><code class="language-javascript">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
	&lt;meta name="viewport" content="width=device-width"&gt;
	&lt;title&gt;Capture Tests&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;h1&gt;test 1 (capture attr)&lt;/h1&gt;
&lt;input type=&quot;file&quot; capture=&quot;camera&quot; accept=&quot;image/*&quot;&gt;

&lt;h1&gt;test 2 (capture in acc)&lt;/h1&gt;
&lt;input type=&quot;file&quot; accept=&quot;image/*;capture=camera&quot;&gt;

&lt;h1&gt;test 3 (capture bool)&lt;/h1&gt;
&lt;input type=&quot;file&quot; accept=&quot;image/*&quot; capture&gt;

&lt;h1&gt;test 4 (capture bool, video)&lt;/h1&gt;
&lt;input type=&quot;file&quot; accept=&quot;video/*&quot; capture&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

You can see four different input fields. The first uses the capture attribute, while the second uses it as part of the accept attribute and the final two use them both, as I believe the spec dictates. Also note the last is asking for video. So let's see what happens.

Mobile Safari
---

The first and second buttons behave the same way. Consider the screen shot below.

<img src="https://static.raymondcamden.com/images/2016/06/capture0.jpg" class="imgborder">

Notice the "Take Photo" and "Photo Library" options allowing for both a new and old picture. Notice Dropbox. I only see that because I clicked More:

<img src="https://static.raymondcamden.com/images/2016/06/capturemore.jpg" class="imgborder">

I was a bit surprised that Google Photos didn't show up here, but maybe they need to do something to let iOS know they are a "provider" for images. 

While iOS prompted for a picture, I was able to go into the photo library and select a video. I was also able to go into Dropbox and select a file that wasn't media at all. **This is not a bug and I would hope that if you are building an app that accepts any type of upload that you always verify on the server that the right type was sent!**

Here's where things get interesting. My third test, which asks for an image but doesn't specify camera anywhere, had this result:

<img src="https://static.raymondcamden.com/images/2016/06/capture1.jpg" class="imgborder">

As you can see, now it's asking for either a picture or video. Finally, the fourth option - and it's what you expect - prompting for a video:

<img src="https://static.raymondcamden.com/images/2016/06/capture2.jpg" class="imgborder">

Mobile Chrome
---

Mobile Chrome does things a bit differently. The first input opens up the device camera. The second prompts you for an 'action':

<img src="https://static.raymondcamden.com/images/2016/06/capturea.png" class="imgborder">

Camera and Camcorder act as you expect. Documents let me browse my tablet, and notice Dropbox shows up here too.

<img src="https://static.raymondcamden.com/images/2016/06/capturea2.png" class="imgborder">

And just like iOS, I can go into Dropbox and select something that isn't an image or video.

Input #3 acts just like Input #1 - it opens the camera. I honestly can't tell you why. 

Finally, input #4 also opens up the device camera, but sets it in video mode automatically.

Desktop Chrome
---

So for the heck of it, I decided to try a few desktop browers as well. Here is what I saw. 

Like Mobile Chrome (and it shouldn't be surprising), input #1 and #3 act the same. The open a file selection prompt that defaults to Images:

<img src="https://static.raymondcamden.com/images/2016/06/captured1.jpg" class="imgborder">

And notice how you can simply change Format and select non-image files. Input #2 acted as if I didn't want an image:

<img src="https://static.raymondcamden.com/images/2016/06/captured2.jpg" class="imgborder">

Finally, option 4 prompted for video files: 

<img src="https://static.raymondcamden.com/images/2016/06/captured3.jpg" class="imgborder">

Desktop Firefox
---

Firefox acted the exact same way as Chrome. Inputs #1 and #3 selected a format of Image Files, #2 wasn't filtered at all, and #4 set a format of "Video Files".

So at this point - I tried a fifth test. You won't see it in the earlier screen shots, but here it is:

<pre><code class="language-javascript">
&gt;input type="file" accept="image/*;capture=camera" capture&lt;
</code></pre>

This "felt" like it should match the spec best, but both Firefox and Chrome treated it like no particular filter was active. Mobile Chrome prompted for Camera/Camcorder again. Mobile Safari did the prompt thing again, but asked for either a photo or video.

Desktop Safari
---

Safari acted a bit like Chrome/Firefox, but the UI doesn't tell you it's filtering. Instead, it grays out the non-desired options. Like Chrome/Firefox, inputs #1 and #3 acted the same:

<img src="https://static.raymondcamden.com/images/2016/06/captured4.jpg" class="imgborder">

As you can see, only images are available and as an end user, I can't change the option at all. (But of course, don't sit there thinking to yourself that this means you're "protected" from non-image uploads. I can go into Safari's dev tools and modify the code.)

Input #4 acted the same - only my videos were selectable. Finally, the new fifth option acted like Chrome/Firefox - no filters were in place.

Desktop Edge
---

Microsoft Edge doesn't seem to recognize *any* of the options. Of course, it "breaks" perfectly well and still lets me select a file to upload, and since I'd have server-side protections in place, I'm certainly not "broken" in Edge at all.

Wrap Up
---

So on mobile, it looks like this feature still works rather well, with the biggest difference being that Mobile Chrome lets you go right into the camera whereas Mobile Safari is always going to prompt. Safari's prompts seem easy enough so I don't see this as an issue, but obviously user testing would let you know. 

If you want to use my test page yourself, you can find it on Surge at: [http://regular-rod.surge.sh](http://regular-rod.surge.sh)