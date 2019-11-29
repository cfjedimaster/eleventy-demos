---
layout: post
title: "Quick note for Parse and JavaScript Users"
date: "2013-07-10T19:07:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2013/07/10/Quick-note-for-Parse-and-JavaScript-Users
guid: 4980
---

Forgive the somewhat haphazard nature of this blog post. I've got a limited amount of time before I board a plane but I didn't want to wait till the morning to post. Earlier today a reader (Arcayne - sounds like an early 80s X-Man) posted a comment that led me to discover that Parse's JavaScript API now supports Files. This wasn't possible in the past. You can read the details about it <a href="https://parse.com/docs/js_guide#files">here</a> but for folks who want to see complete demo code, keep reading.
<!--more-->
The first thing I did was build a complete demo using their example of a file upload. I began by creating a simple HTML file:

<script src="https://gist.github.com/cfjedimaster/5971018.js"></script>

Note I've got the Parse library loaded. The HTML just contains a file field and a button. Here's the JavaScript code:

<script src="https://gist.github.com/cfjedimaster/5971025.js"></script>

For the most part this is just what the Parse docs have, but as a complete file, hopefully it is helpful. I can confirm this worked perfectly. In the result object I got a URL to the picture I uploaded. Of course, if I did not pick an image this wouldn't work.  You do have access to the file name so in theory line 14 could easily be made dynamic. 

Ok, I felt bad. The fix was one line:

            var name = file.name;

In the zip I'll be sharing this is corrected. So - that would work in PhoneGap <i>if</i> your mobile client allows for file upload fields. I'm not sure which do. I know iOS lets you capture the camera with one, but I'm not sure if I remember if it lets you select files too. As I said, I'm in a rush. 

My real question though was if this could work with PhoneGap. I built a test to see if I could use the Camera API and upload it to Parse. For my first test I decided to just use Base64. That's one of the options in PhoneGap and it works with Parse as well. Turns out this worked super easy as well. I won't bother with the HTML, just the JavaScript, and I'll just focus on the important part.

<script src="https://gist.github.com/cfjedimaster/5971075.js"></script>

Again - I assume this is all pretty simple, but if it doesn't make sense, let me know. I specified the photo library as I was testing on the iOS simulator.

Woot. So it works. But - I've heard that using base64 for image data in PhoneGap can be a bit memory intensive. Parse supports a binary array too so I built another demo that made use of "real" files as well. That turned out to be a bit more difficult.

First - PhoneGap can save a camera image to the file system. That part is easy. But the File API is not the most... simple thing to use. The PhoneGap API returns a File URI that you have to turn into a File object that you then have to send to a File Reader. Finally you can get an array buffer object but Parse needs a real array instead. (And for that part I need to thank Si Robertson for his help on G+.)

Here is the code I used. It isn't pretty. But it works.

<script src="https://gist.github.com/cfjedimaster/5971113.js"></script>

Anyway - this is <i>very</i> cool and just makes the Parse/PhoneGap combination even cooler. I've attached a copy of my code with my app IDs stripped out. Enjoy!<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fparseuploadtests%{% endraw %}2Ezip'>Download attached file.</a></p>