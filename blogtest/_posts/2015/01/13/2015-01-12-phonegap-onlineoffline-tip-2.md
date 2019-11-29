---
layout: post
title: "PhoneGap Online/Offline Tip (2)"
date: "2015-01-13T09:32:16+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2015/01/13/phonegap-onlineoffline-tip-2
guid: 5547
---

A while ago I posted an article discussing how to handle offline and online events in Cordova/PhoneGap (<a href="http://www.raymondcamden.com/2013/05/24/PhoneGap-OnlineOffline-Tip">PhoneGap Offline/Online Tip</a>). While working on my <a href="http://manning.com/camden/">book</a> I came across some differences to this behavior that I wanted to document.

<!--more-->

As a reminder, the idea is simple. Your PhoneGap/Cordova app should be network aware if it makes any use of remote resources. While the <a href="http://plugins.cordova.io/#/package/org.apache.cordova.network-information">Network Information</a> plugin isn't perfect (and I'll be showing an example of that in a second), there really is no excuse to not add <i>some</i> type of support for this in your application. Having an application that just silently fails is unprofessional - especially considering how easy it is to fix.

Read the <a href="http://www.raymondcamden.com/2013/05/24/PhoneGap-OnlineOffline-Tip">earlier entry</a> first - I'll wait.

Now that you've seen an example, there are a few changes you should be aware of.

At the time I wrote the entry, I recommended putting the event listeners in the document ready block if you were using jQuery. Now the recommendation (and this is documented) is to place them in the deviceready listener. 

The good news is that the handlers still works as my other blog entry says. They will fire automatically on application startup. The bad news though is that your code needs to be a bit more intelligent about any warnings it may use. What do I mean? My sample code alerted the user when they went offline and online. It makes sense to warn the user immediately if the application starts up offline. It does not make sense to do the same if the application is online. So you need a work around for that. The good news is that the workaround also meshes nicely with a bug.

Cordova <a href="https://issues.apache.org/jira/browse/CB-7787">issues 7787</a> describes a bug where in Android, the event listeners may fire multiple times. What that means is that when you test putting your device offline, the event may fire twice or more. If you are using an alert, then that's a problem. 

To get around this I used a simple hack. It is harmless on iOS and actually addresses the "starting up online" issue as well. Consider this pseudo-code:

<pre><code class="language-javascript">
document.addEventListener("deviceready", init, false);
var lastStatus = "";

function init() {

  //listen for changes
  document.addEventListener("offline", disableForm, false);
  document.addEventListener("online", enableForm, false);

}

// stuff

function disableForm() {
  $("#searchButton").attr("disabled", "disabled");
  if(lastStatus != 'disconnected') {
    lastStatus = 'disconnected';
    navigator.notification.alert(
      "Search is disabled while you are offline.", 
      null, 
      "Offline!");
  }
}

function enableForm() {
  $("#searchButton").removeAttr("disabled");
  if(lastStatus != 'connected' && lastStatus != '') {
    lastStatus = 'connected';
    navigator.notification.alert(
      "Search is now enabled.", 
      null, 
      "Online!");
  }
}
</code></pre>

Basically, I set a global variable to see if I've switched from one state to another. That handles the Android issue and like I said is harmless on iOS. Notice the enableForm method called in online. This will fire if the application starts online, but we add a check (<code>lastStatus != ''</code>) that handles the good startup case and suppresses the alert. (The line removing disabled is harmless too.) 

Anyway, I hope this helps!