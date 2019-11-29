---
layout: post
title: "My weekend experiment - PebbleJS"
date: "2014-08-24T14:08:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2014/08/24/My-weekend-experiment-PebbleJS
guid: 5294
---

<p>
Apparently everyone is expecting the announcement of the iWatch in a few weeks, and wearables are going to be "The Thing" for the next few years. But I've been rocking a <a href="https://getpebble.com/">Pebble</a> for a while now and I really dig it. It isn't as sexy as some of the newer smart watches, and who knows how it will compare to whatever Apple is doing, but it is affordable (reasonably affordable) and simple. If you are considering picking up a smart watch, definitely check it out. 
</p>
<!--more-->
<p>
There has been an SDK for the device since it came out, allowing developers to create watch faces and apps with C. You can read more about that on their <a href="https://developer.getpebble.com/2/guides/">developer guide</a> site. Recently though an alternative way to develop for Pebble was released - <a href="https://github.com/pebble/pebblejs">PebbleJS</a>. As you can imagine, this lets you use JavaScript to create Pebble applications. I thought I'd take it for a spin this weekend.
</p>

<p>
For the most part, it works pretty easily, especially if you make use of their <a href="https://cloudpebble.net/">CloudPebble</a> service. (Why, oh why, must everything be "Cloud" something...) I'm not a big fan of browser-based IDEs, but their editor worked decently enough. The editor has JSHint built in so you get real time syntax and best practices warnings. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/s119.png" />
</p>

<p>
Sending the application to your watch is also pretty easy. Remember to enable the developer connection via the mobile app. One thing that tripped me up though was getting CloudPebble to recognize my device. It knew about my <i>original</i> connection via the iPhone app, but it didn't recognize that I had switched to using Android as my primary phone. If you go to the <strong>Compilation</strong> page of CloudPebble, you can enter the IP address of the phone:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s216.png" />
</p>

<p>
But I wasn't sure <i>how</i> to get my IP. I was about to hit one of those "what is my IP" web pages when I checked the mobile app again. On the Developer panel was my IP:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_2014-08-24-12-33-01.png" />
</p>

<p>
Another issue I ran into was random transfer errors. This seemed to get worse as I worked on my project, and it <i>may</i> have been related to my app being selected in the Pebble app on my device. Switching to another app, then running my compilation, seemed to help, but I wasn't able to ever figure out exactly what made the process fail. It just slowed me down a bit though.
</p>

<p>
One cool aspect is that you can view console.log messages directly from the web site. This became more and more useful as I went past the starter app and really began to code something.
</p>

<p>
For my project I thought I'd build a version of the Death Clock. I figured that kinda made sense on a watch anyway. It is here though that I ran into the biggest problem with PebbleJS - setTimeout and setInterval are discouraged. Now - maybe I'm crazy - but I can't imagine what you could build on Pebble that would actually be useful without having <i>some</i> form of interval based processing. I suppose you could build an app, but any type of watch face or game just wouldn't make sense. There <i>is</i> a good reason for this. From the <a href="https://developer.getpebble.com/2/guides/javascript-guide.html">JavaScript guide</a>:
</p>

<blockquote>
The JavaScript code is part of the Pebble app and bundled in your pbw file. The phone extracts and installs this code when you install your app on Pebble.<br/>
Your JavaScript is executed in a sandbox inside the Pebble mobile app.<br/>
Your JavaScript is started by a request from the Pebble app. It will be killed when the user exits your application.<br/>
The Pebble mobile app will attempt to keep your app running as long as your Pebble app is running. However, under certain circumstances, the phone may kill the Pebble app and your app. If this occurs, the Pebble mobile app will be automatically restarted.
</blockquote>

<p>
So - yeah - it is actually being run from the mobile app, not the device. This also has one more <strong>huge</strong> issue. Because the app runs from the mobile app, any user who is using iOS for Pebble will not be able to download your application until the company resubmits their app to Apple. I guess that's not really their fault, but, honestly, it is enough for me to <strong>not</strong> recommend using this library. To be clear, I think developing for the Pebble is probably worth your while, but I don't think I can suggest using their JS solution. Maybe for prototyping, but nothing more.
</p>

<p>
Despite the fact that setInterval was discouraged, I figured, why not go ahead and build it anyway:
</p>

<p>
<img src="https://static.raymondcamden.com/images/pebble-screenshot_2014-08-23_15-34-12.png" />
</p>

<p>
You can actually download this right now if you are on Android, and, in up to ten days, iOS as well. Unfortunately, there is no public web interface for the Pebble app library. <strong>That is a mistake.</strong> Hopefully this will be corrected in the future. Other people have made their own libraries though - basically scraping the same data that the mobile app uses. I used this one - <a href="http://pas.cpfx.ca/">http://pas.cpfx.ca/</a>.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s38.png" />
</p>

<p>
And yes - that looks kinda lame, but that's my fault, not Pebble's. I whipped up the marketing assets in about 2 minutes. In case you're curious, this is what the code looks like. And again, I wrote this rather quickly and this does not demonstrate all the different aspects of what you can do.
</p>

<pre><code class="language-javascript">&#x2F;**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 *&#x2F;

var UI = require(&#x27;ui&#x27;);
var Vector2 = require(&#x27;vector2&#x27;);
var Settings = require(&#x27;settings&#x27;);

var timeLeft = 2022491029;
var hb;

var wind = new UI.Window();
var textfield = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: &#x27;gothic-24-bold&#x27;,
    text: &#x27;Time to Live:\n&#x27;+String(timeLeft),
    textAlign: &#x27;center&#x27;
  });
  wind.add(textfield);

var splash = new UI.Card({
  title: &#x27;Death Clock&#x27;,
  body: &quot;&quot;
});
splash.show();

function decrCounter() {
  timeLeft--;
  if(timeLeft &gt; 0) {
    textfield.text(&#x27;Time to Live:\n&#x27;+String(timeLeft));
  } else {
    textfield.text(&quot;Time is up!&quot;);
    clearInterval(hb);
  }
}

setTimeout(function() {
  
  splash.hide();
  wind.show();
  var birthDayStr = localStorage[&quot;birthday&quot;];
  if(birthDayStr) {
    console.log(&quot;got from local storage&quot;);
    var bdParts = birthDayStr.split(&quot;&#x2F;&quot;); 
    var bDate = new Date(bdParts[0], bdParts[1], bdParts[2]);
    console.log(&#x27;using bdate of &#x27;+bDate);
    timeLeft = calculateTimeToDie(bDate);
  }
  hb = setInterval(decrCounter, 1000);
  
}, 2000);

Pebble.addEventListener(&quot;showConfiguration&quot;, function() {
  console.log(&quot;showing configuration&quot;);
  Pebble.openURL(&#x27;http:&#x2F;&#x2F;static.raymondcamden.com&#x2F;deathclockform.html&#x27;);
});

Pebble.addEventListener(&quot;webviewclosed&quot;, function(e) {
  console.log(&quot;configuration closed&quot;);
  &#x2F;&#x2F;http:&#x2F;&#x2F;forums.getpebble.com&#x2F;discussion&#x2F;15172&#x2F;pebblejs-cloudpebble-unexpected-token-c-at-object-parse-json-error
  if(e.response !=&quot;CANCELLED&quot;) {
      var options = JSON.parse(decodeURIComponent(e.response));
      console.log(options.day);
      console.log(&quot;Options = &quot; + JSON.stringify(options));
      var dayToSave = options.year + &quot;&#x2F;&quot; + options.month + &quot;&#x2F;&quot; + options.day;
      localStorage[&quot;birthday&quot;] = dayToSave;
      var bDate = new Date(options.year, options.month, options.day);
      console.log(&#x27;going to test for &#x27;+bDate);
      timeLeft = calculateTimeToDie(bDate);
  }
});

&#x2F;&#x2F;Given a date, return # of seconds left to live
function calculateTimeToDie(born) {
  var now = new Date();
  var timeAlive = Math.floor((now.getTime() - born.getTime())&#x2F;1000);
  console.log(&#x27;time alive is &#x27;+timeAlive);
  &#x2F;&#x2F; 75 years
  var avgTime = 2365200000;
  var timeLeft = avgTime - timeAlive;
  return timeLeft;
}        
</code></pre>

<p>
Again - I'm not sure I can recommend folks use PebbleJS for their "production" apps, but it was an interesting experiment and kinda cool to see something showing up on my watch so quickly. 
</p>

<p>
One more quick note - I can say that I was impressed by the developer forums at Pebble. Even on a Saturday I got pretty quick answers to my questions.
</p>

<p>
<strong>Edit on August 25:</strong> In regards to my note about how PebbleJS required you to wait for an App Store resubmission, it looks like I was wrong. A few hours ago, Jonathan Stark shared this with me:
</p>

<blockquote class="twitter-tweet" lang="en"><p><a href="https://twitter.com/raymondcamden">@raymondcamden</a> FYI - Even C apps for <a href="https://twitter.com/Pebble">@Pebble</a> have the &quot;wait for next update&quot; limitation on iOS :(</p>&mdash; Jonathan Stark (@jonathanstark) <a href="https://twitter.com/jonathanstark/statuses/504055779855704064">August 26, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<p>
So... on second thought - maybe my "Cool but not recommended" summary needs to be amended to "Cool and ... maybe!" That's a bit wishy washy still but I'm more open to the possibility of doing more with it now.