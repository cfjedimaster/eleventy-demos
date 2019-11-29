---
layout: post
title: "Determining installed plugins at runtime for Cordova and PhoneGap applications"
date: "2014-11-19T14:11:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/11/19/Determing-installed-plugins-at-runtime-for-Cordova-and-PhoneGap-applications
guid: 5353
---

<p>
Earlier today on Twitter a user asked an interesting question: How can I tell - via JavaScript - if a particular plugin is installed in a Cordova/PhoneGap application. I responded by asking <i>how</i> you wouldn't know since it is your own app, but then he mentioned that his code base was stand alone and would be used within other projects. (So basically - just JavaScript code that other Cordova/PhoneGap applications would use.)
</p>
<!--more-->
<p>
There are a couple of different ways to handle this. The first, and simplest, is to look for the "hook" the plugin adds. For example, the <a href="http://plugins.cordova.io/#/package/com.phonegap.plugins.barcodescanner">barcode plugin</a> adds methods to a cordova.plugins.barcodeScanner object. It would be trivial to see if that exists. Cool, problem solved, right?
</p>

<p>
Well in his case he was using <a href="http://plugins.cordova.io/#/package/org.apache.cordova.inappbrowser">InAppBrowser</a>. This plugin simply modifies window.open so it isn't something you can really (as far as I can see) introspect. I did some more digging and found something interesting.
</p>

<p>
If you look at the platform build version of your www code, you will notice it includes a cordova_plugins.js file:
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot30.png" />
</p>

<p>
If you open it up, you will see a list of any plugins you have installed. I opened up cordova.js (honestly, I don't look at it often, but I should) and saw that cordova_plugins.js was being loaded in dynamically and parsed. My assumption is that this has to happen before deviceready fires so you can safely use any plugins you've got installed. On a whim then I tried the following code inside my deviceready:
</p>

<pre><code class="language-javascript">var md = cordova.require("cordova/plugin_list").metadata;</code></pre>

<p>
The <code>metadata</code> part came from what I saw in cordova_plugins.js. While the rest of the file has random stuff based on the plugins installed, metadata appears to be <i>just</i> a list of your plugins. I confirmed that this worked well:
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot214.png" />
</p>

<p>
So - that's it. I should note that I spoke with <a href="https://shazronatadobe.wordpress.com/">Shazron</a> and he mentioned that if you used browserify, it <i>might</i> mess with how the JS file is generated. I'd say use with caution and let me know (via the comments) how it works for you.
</p>