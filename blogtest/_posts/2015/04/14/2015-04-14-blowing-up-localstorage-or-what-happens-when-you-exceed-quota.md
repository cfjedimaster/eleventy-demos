---
layout: post
title: "Blowing up LocalStorage (or what happens when you exceed quota)"
date: "2015-04-14T12:00:16+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2015/04/14/blowing-up-localstorage-or-what-happens-when-you-exceed-quota
guid: 6001
---

Based on some discussion earlier today on Twitter, I wanted to take a quick look at what happens when you exceed the quota limit in a browser's LocalStorage system. I knew an error would be thrown, but I was curious about the type, message, etc. I built a quick test and threw some browsers at it. This probably isn't the most scientific test, but here's what I found.

<!--more-->

First, for my test I wanted a quick way to hit the "typical" limit of 5 megs per domain. To do that, I found an image of around one meg in size and then wrote code that would grab the binary bits, convert to base64, and then store it. Here's my test script.

<pre><code class="language-javascript">/*
credit:
http://stackoverflow.com/a/18650249/52160

*/
function urlTo64(u, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', imgurl, true);
  xhr.responseType = 'blob';

  xhr.onload = function(e) {
    if (this.status == 200) {
      // get binary data as a response
      var blob = this.response;
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        base64data = reader.result;
        cb(base64data);
      }
    }
  };
  xhr.send();

}

$(document).ready(function() {

  console.log(&quot;Lets add some stuff&quot;);
  imgurl = &quot;xmax2010.jpg&quot;;
  urlTo64(imgurl, function(s) {
    console.log(&quot;urlTo64 result length&quot;,s.length);
    for(var i=0;i&lt;500;i++) {
      if(i &gt; 0 &amp;&amp; i % 100 === 0) console.log(&quot;A set done&quot;);
      try {
        localStorage[&quot;bigimage&quot;+i] = s;
      } catch(e) {
        console.log(e.toString());
        console.dir(e);
        break;
      }
    }
    console.log(&quot;Done setting big images&quot;);
  });
});</code></pre>

I'm using jQuery here, but I don't really need to. I loaded it up when I began but I didn't end up needing it. This isn't really important but I'm just trying to defend my somewhat shoddy test script. ;) The idea is simple - use XHR to fetch the bits of an image (hard coded to one on my test server), convert it to a DataURL and read in the base64 data. You can see that in the urlTo64 function. I then put this in a loop and tried to store the result. You'll notice my loop goes from 1 to 500. Originally it just went to 5. I'll explain the 500 when we get to Internet Explorer.

So - that's it. Read the binary, convert, store, and on error, print it out and stop working. Ok, so let's look at how different browsers handle this.

<h4>Chrome 41 (OSX)</h4>

Throws an exception with the name QuotaExceedError. The code is 22. The message is nice as it tells you what key it was trying to set:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/chromedesktop.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/chromedesktop.png" alt="chromedesktop" width="850" height="269" class="alignnone size-full wp-image-6002" /></a>

<h4>Firefox 37 (OSX)</h4>

Throws an exception, but with a completely different name/code. The name is NS_ERROR_DOM_QUOTA_REACHED and the code is 1014.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/firefox.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/firefox.png" alt="firefox" width="750" height="283" class="alignnone size-full wp-image-6003" /></a>

<h4>Safari 8.0.5</h4>

Throws the same exception as Chrome (name and code anyway):

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/safari.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/safari.png" alt="safari" width="750" height="332" class="alignnone size-full wp-image-6004" /></a>

<h4>Internet Explorer 11 (Windows 10)</h4>
So, IE really threw me for a loop. When I ran my code (again, I had started with a loop of 5), it didn't throw an error. So I thought, ok, it has a bigger cache. So I added a 0. And then another 0. And another. I got it up to 5K calls and it still worked. That seemed... wrong. I did some Googling and turns out that IE supports a non-standard <a href="https://msdn.microsoft.com/en-us/library/ie/cc197016(v=vs.85).aspx">remainingSpace</a> property. (Non-standard but a good idea imo. Client-storage does <i>not</i> help developers at all in terms of managing space.) When I inspected that value, it never seemed to change no matter how many additional 0s I added. I could inspect localStorage in the console and see all the values just fine.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/ie11.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/ie11.png" alt="ie11" width="750" height="594" class="alignnone size-full wp-image-6005" /></a>

Then on a whim I tried something. I killed IE, re-opened it, and discovered that localStorage only had 2-3 of my images stored. From what I can tell, IE11 stopped storing items, <strong>but never threw an error!</strong> Which is really, really bad. Even worse, if you try to <i>read</i> the value, it reads it just fine, but on restart, it is gone. I'm not exactly sure what to think about that, outside of the fact that "silent fail" is the worst thing to happen to development since starting arrays at 0.

I tried an interesting little test. I checked remainingSpace before and after a set, and when the set fails, you can clearly see the space does <strong>not</strong> change. In theory, you could use this (on IE11 anyway) to confirm a proper save.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/ie112.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/ie112.png" alt="ie112" width="750" height="384" class="alignnone size-full wp-image-6006" /></a>

As an aside, <a href="https://twitter.com/jonathansampson">Jonathan Sampson</a> tried the latest Spartan build with my code and saw the same. 

<h4>iOS Safari and PhoneGap/Cordova</h4>

It throws the exact same error as desktop Safari.

<h4>Android Chrome and PhoneGap/Cordova</h4>

It throws the exact same error as desktop Chrome.

<h4>Takeaway</h4>

So, yeah, what's the <i>practical</i> takeaway from this?

<ul>
<li>Pretty much all client-side storage options suck really bad at quota. I love client-side storage (and have presented on it many times) but this is the biggest area of concern.</li>
<li>Try to keep track of how you use client-side storage. So for example, if you saving the last 10 searches so you can display them to the user, <i>know that</i> and note it somewhere so that when you make use of client-side storage in the future ("Hey, can we cache some fonts?") you can check and see what you've stored already and see if you'll be hitting the limit possibly.</li>
<li>Wrap everything in a try/catch? Um - maybe. ;) The "Super Strict Lets Do Everything Perfect" side of me says yes, but the "Practical I Live in the Real World" says that would probably be overkill. Again, going to my last point, as long as you keep track of what you're doing then I think you will be ok. Obviously I think folks will disagree with me here. Let me have it in the comments.
</ul>