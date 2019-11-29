---
layout: post
title: "Calling remote services from Ionic Serve"
date: "2015-09-01T14:27:47+06:00"
categories: [development,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/09/01/calling-remote-services-from-ionic-serve
guid: 6709
---

A coworker pinged me today with an interesting question:

<blockquote>
I am sure you may have encountered this error when using IONIC SERVE locally. 

XMLHttpRequest cannot load http://something.mybluemix.net/rest/audit/list. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:8100' is therefore not allowed access.

Essentially I am calling the URL via the $http.get() method from a factory. Ionic appears to have multiple ways to call REST services (1. $http or 2. ngResource).

So my question is do you have a workaround for this problem or a preferred way of dealing with / calling REST services from within Ionic? Any sample code would be appreciated.
</blockquote>

<!--more-->

This is a great question as there are multiple ways you can handle this. Before we begin, let's do a refresher. What is this error and why do we get it? Browsers have a security model in place that prevents an Ajax request from one domain to another. This is what led to the creation of JSON/P, which is essentially a workaround for calling remote services. 

When working with Cordova, you don't have to worry about it. But when using Ionic Serve and running the application in the browser, you have to figure out a way around it. Even though using JSON/P is simple, I tend to try to avoid adding code to my Cordova/Ionic apps that are just for the purpose of making it run on the desktop browser. To be clear, I do it from time to time, but I try to avoid it. (And in fact, one of the answers below will involve just such a modification.) So given that, what are some options?

1) Enable CORS<br/>
Modern browsers support CORS, which is a way for a remote API to say it is acceptable for your code to call it from another domain. If you have access to the API (so you're building both the mobile side and the server side), than it is trivial to enable CORS for your API. How you do that depends on the language of course. I described how to do it in <a href="http://www.raymondcamden.com/2012/10/17/Enable-CORS-for-ColdFusion-Services">ColdFusion</a> and you can enable it with <a href="http://enable-cors.org/server_expressjs.html">Node.js/Express</a> pretty quickly.

2) Hack with an extension<br/>
You can find a Chrome extension (<a href="https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en">Super Long URL to it here</a>) that will modify CORS headers on the fly in your application. Obviously this is Chrome only, but I like that it works with zero changes anywhere at all.

3) Ionic Serve Proxies<br/>
Did you know Ionic Serve itself has a proxy feature? In their <a href="http://ionicframework.com/docs/cli/test.html">Testing in a Browser</a> documentation page, they discuss how you can modify a setting in the ionic.project file to add a proxy. Here is an example.

<pre><code class="language-javascript">{
  "name": "appname",
  "email": "",
  "app_id": "",
  "proxies": [
    {
      "path": "/v1",
      "proxyUrl": "https://api.instagram.com/v1"
    }
  ]
}</code></pre>

Once you've done that, a request to /v1 will be redirected locally through a proxy to api.instagram.com/v1. This is a cool feature, but it does mean your code has to be changed. Note that you can simplify this a bit by checking for the browser platform as described here - <a href="http://ionicframework.com/docs/platform-customization/platform-classes.html">Platform Classes</a> - or by using <a href="http://ionicframework.com/docs/api/utility/ionic.Platform/">ionic.Platform</a>. <strong><u>Oops, scratch that!</u></strong> I naturally assumed if a CSS element was added to mark the browser platform then ionic.Platform would support it as well, but from what I can tell it does not. I filed <a href="https://github.com/driftyco/ionic/issues/4306">issue 4306</a> for this.

Note - I did some quick testing on this, basically console.logging: 

<pre><code class="language-javascript">console.log(document.body.classList.contains('platform-browser'));
console.log(document.body.classList);
</code></pre>

Oddly, inside Ionic's run block, even inside $ionicPlatform.ready, the class does NOT exist. It only exists in my first controller. This seems... wrong to me.

Ok, so more testing. In the docs for <a href="http://ionicframework.com/docs/api/utility/ionic.Platform/">ionic.Platform</a>, they mention a platforms array. You can do: <code>ionic.Platform.platforms.contains("browser")</code> to see if you are on a browser. So my issue 4306 there is a bit wrong. You can check - but it seems like an isBrowser helper utility should perhaps be available.

So - to wrap this up - you've got multiple different ways of handling this - some require some changes to your code, some do not. Find the one that works best for you and roll with it. :)