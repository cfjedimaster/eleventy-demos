---
layout: post
title: "Working with the battery in a PhoneGap application"
date: "2012-01-13T09:01:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2012/01/13/Working-with-the-battery-in-a-PhoneGap-application
guid: 4494
---

One of the interesting things added in PhoneGap 1.3.0 (and something I missed until fairly recently), was support for <a href="http://docs.phonegap.com/en/1.3.0/phonegap_events_events.md.html#batterycritical">battery events</a>. Using these events is pretty simple so I thought I'd whip up a quick demo.
<!--more-->
<p>

Before going any further, note that there is currently a <b>documentation bug</b>. While the API as described works perfectly, you will not be able to use these events unless you do two things:

<p>

1) Edit your plugins.xml file to include this: &lt;plugin name="Battery" value="com.phonegap.BatteryListener"/&gt;. You normally only edit this file when adding additional plugins. I'm betting that the PhoneGap devs forgot to update the default plugins.xml file. 

<p>

2) The second thing you need to do I was able to skip as my project already had it. You must ensure the BROADCAST_STICKY permission is enabled in AndroidManifest.xml. Again, for my project this was already done.

<p>

Big thanks to <a href="http://hi.im/simonmacdonald">Simon Mac Donald</a> for letting me know both of the above. Once I had these in (and fixed a stupid JavaScript error on my part, hint, avoid "status" as a variable name), my demo worked.

<p>

There are three main events you can listen to:

<p>

<ul>
<li>batterystatus: Fired when the battery level changes or if the device is plugged in/removed. 
<li>batterylow: Fired when the battery is low. The definition of "low" is device dependent. 
<li>batterycritical: Ditto the above.
</ul>

<p>

Note that there is no generic way to get the status of the battery <i>right now</i>. In my testing, batterystatus seemed to fire immediately. So it's probably safe to use it to get your status on application startup, but keep in mind it may not be immediate for you.

<p>

All three events pass a simple object containing two keys: level and isPlugged. level is a numeric percentage value. isPlugged is a boolean representing if the device is plugged in or not.

<p>

Here's a simple demo:

<p>

<pre><code class="language-markup">
&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta name="viewport" content="width=320; user-scalable=no" /&gt;
    &lt;meta http-equiv="Content-type" content="text/html; charset=utf-8"&gt;
    &lt;title&gt;Minimal AppLaud App&lt;/title&gt;

	  &lt;script type="text/javascript" charset="utf-8" src="phonegap-1.3.0.js"&gt;&lt;/script&gt;
	  &lt;script type="text/javascript" charset="utf-8"&gt;
		var statusdiv;

		var drawStatus = function(info){
			var s = "&lt;p&gt;&lt;b&gt;Battery Status&lt;/b&gt;&lt;br/&gt;";
			s += "Level is "+info.level + "&lt;br/&gt;";
			s += "Plugged in is "+info.isPlugged;
			s += "&lt;/p&gt;";
			statusdiv.innerHTML = s;
		};
				
      	var battCrit = function(info) {
			navigator.notification.alert("Your battery is SUPER low!");
			drawStatus(info);
		};

      	var battLow = function(info) {
			navigator.notification.alert("Your battery is low!");
			drawStatus(info);
		};

      	var battStat = function(info) {
			drawStatus(info);
		};
	  
        var onDeviceReady = function() {
			//listen for battery events
			window.addEventListener("batterycritical", battCrit, false);
			window.addEventListener("batterylow", battLow, false);
			window.addEventListener("batterystatus", battStat, false);
        };

        function init() {
            document.addEventListener("deviceready", onDeviceReady, true);
			statusdiv = document.getElementById("status");
        }   
	  &lt;/script&gt;  
  &lt;/head&gt;


  &lt;body onload="init();"&gt;

    &lt;h2&gt;Battery Tester&lt;/h2&gt;

	&lt;div id="status"&gt;&lt;/div&gt;

  &lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

As you can see, I've got listeners for all three events, with the low and critical going out of their way to warn the user that bad times are ahead. Here's a quick screen shot to give you an idea of how it renders.

<p>

<img src="https://static.raymondcamden.com/images/device-2012-01-13-083400.png" />

<p>

So obviously you wouldn't typically need to show the battery status at all times. I could definitely see using the low/critical events to warn the user to save their work or perform some other safekeeping measures in case the device suddenly shuts down.

<p>

p.s. I can't post this blog entry without a quick shoutout to one of my coworker's recent PhoneGap demo. Batteries are boring. Multiple screens are freaking cool: <a href="http://www.tricedesigns.com/2012/01/12/multi-screen-ios-apps-with-phonegap/">Multi-Screen iOS Apps with PhoneGap</a>