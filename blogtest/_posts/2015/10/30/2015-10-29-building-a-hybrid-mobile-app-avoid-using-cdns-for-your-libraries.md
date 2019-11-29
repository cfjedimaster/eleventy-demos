---
layout: post
title: "Building a hybrid mobile app? Avoid using CDNs for your libraries"
date: "2015-10-30T10:50:21+06:00"
categories: [development,javascript,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/10/30/building-a-hybrid-mobile-app-avoid-using-cdns-for-your-libraries
guid: 7036
---

I'm reading an (otherwise fascinating) article now on Ionic and came across this snippet of code:

<pre><code class="language-javascript">&lt;script type=&quot;text/javascript&quot; src=&quot;//code.angularjs.org/1.4.3/angular.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;//code.angularjs.org/1.4.3/angular-resource.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;js/services.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;text/javascript&quot; src=&quot;js/index.js&quot;&gt;&lt;/script&gt;</code></pre>

What's wrong with the above code? (And yes, the title mostly gives it away.)

<!--more-->

By using a CDN for libraries in your hybrid mobile app, you've essentially ensured the application will be completely broken when offline. This is obvious, but like most of us doing client-side work, we've become accustomed to using CDNs for libraries. 

Now - you may ask - what if the core functionality of the application requires you to be online? In that scenario, you still want to ensure you gracefully handle the user being offline. If your CDN libraries fail to load, most likely your application is going to crap the bed. If those libraries were stored locally within the application, you can at least still load up, detect the offline state, and then tell the user they can't do anything while offline.

Even better, you can add a simple event listener for when they get back online and then start the application up again. (And of course, you'll have an event listener for when they go back offline. Because that happens. A lot.)

For an example of this in action, see my earlier blog posts: <a href="http://www.raymondcamden.com/2013/05/24/PhoneGap-OnlineOffline-Tip">PhoneGap Online/Offline Tip</a> and <a href="http://www.raymondcamden.com/2015/01/13/phonegap-onlineoffline-tip-2">PhoneGap Online/Offline Tip (2)</a>.