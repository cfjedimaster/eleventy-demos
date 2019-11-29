---
layout: post
title: "PhoneGap Orientation Example"
date: "2011-11-04T11:11:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2011/11/04/phonegap-orientation-example
guid: 4420
---

This morning I read a post on the Phonegap Google group asking about their support for orientation changes. While PhoneGap has good <a href="http://docs.phonegap.com/en/1.1.0/phonegap_events_events.md.html#Events">event support</a> it doesn't support orientation changes. Why? Because there is no need - turns out the mobile browsers support this themselves. It is probably a good idea to remember that your mobile browsers can do quite a bit themselves. If you find something missing from PhoneGap that you think should be included, ensure the browsers just don't support it already. (And if not, check out the excellent <a href="https://github.com/phonegap/phonegap-plugins">list of plugins</a>.)
<!--more-->
<p>

I did a quick Google and found that both <a href="http://developer.apple.com/library/IOS/#documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html">Safari</a> and <a href="http://stackoverflow.com/questions/1649086/detect-rotation-of-android-phone-in-the-browser-with-javascript">Android</a> support a simple orientation change event listener. With that I whipped up a quick PhoneGap application. I began with a super simple front end:

<p>

<pre><code class="language-markup">&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta name="viewport" content="width=320; user-scalable=no" /&gt;
    &lt;meta http-equiv="Content-type" content="text/html; charset=utf-8"&gt;
    &lt;title&gt;PhoneGap&lt;/title&gt;
	  &lt;script type="text/javascript" charset="utf-8" src="phonegap-1.1.0.js"&gt;&lt;/script&gt;
	  &lt;script type="text/javascript" charset="utf-8" src="main.js"&gt;&lt;/script&gt;

  &lt;/head&gt;
  &lt;body onload="init();" &gt;
  	
		&lt;h2&gt;Orientation Test&lt;/h2&gt;
		&lt;div id="status"&gt;&lt;/div&gt;

  &lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

And my code is then just:

<p>

<pre><code class="language-javascript">function init() {
    window.addEventListener("orientationchange", orientationChange, true);

}

function orientationChange(e) {
    var orientation="portrait";
    if(window.orientation == -90 || window.orientation == 90) orientation = "landscape";
    document.getElementById("status").innerHTML+=orientation+"&lt;br&gt;";
}
</code></pre>

<p>

Two things to notice here.

<p>

<ol>
<li>Notice that I check window.orientation for -90 and 90. Those values represent a landscape view. It also implies you can check for rotating one way versus the other.
<li>My application listens for the <i>change</i>, if you want to know on startup what the current orientation is, just perform the same check. You could abstract out most of orientationChange into getOrientation() and simply call that in you rinit and orientationChange methods.
</ol>

<p>

And here is a quick screen shot of it in action.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/device-2011-11-04-092515.png" />

<p>

p.s. Recently I mentioned a <a href="http://wiki.phonegap.com/w/page/34483744/PhoneGap{% raw %}%20Eclipse%{% endraw %}20PlugIn{% raw %}%20for%{% endraw %}20Android">plugin</a> that significantly improves the experience of creating PhoneGap applications in Eclipse. I began having issues with orientation changes crashing the application. On a whim I decided to check and see if a new version of the plugin existed and indeed there was. Updating fixed everything. I still wish the plugin had a way to output an empty HTML file but it's much easier than building things out by hand.