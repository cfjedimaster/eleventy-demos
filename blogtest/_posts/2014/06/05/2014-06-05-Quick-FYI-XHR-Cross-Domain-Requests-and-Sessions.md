---
layout: post
title: "Quick FYI: XHR, Cross Domain Requests, and Sessions"
date: "2014-06-05T11:06:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2014/06/05/Quick-FYI-XHR-Cross-Domain-Requests-and-Sessions
guid: 5238
---

<p>
I discovered something new last night, which was painful like all good learning tends to be. I'm building a Cordova application for a client that - like most hybrid apps - can be run via a local web server for most of the development process. This particular project involves a complex dynamic form process that isn't Cordova-related at all. Later on we'll be adding in barcode scanning but for the foreseeable future I'm running it as a simple web page. 
</p>

<p>
My application makes multiple XHR requests to the client's server for various things, and in order to make that work I'm using CORS. I won't need CORS once I switch to a proper hybrid app. I could also use Ripple too. But again - I just don't need this now at this point in the development.
</p>

<p>
Everything was kosher until I began to lock down some of the calls to require a session variable. In all my Cordova apps before I relied on the fact that sessions (cookie-based sessions) "just work" when doing XHR. If your back end server responds with cookies, then your front end code will respect that and send them back on future requests. This enables session management to work on your server. 
</p>

<p>
<strong>Except when I used CORS!</strong> I couldn't understand why I kept getting an error saying that an earlier session variable wasn't defined. Like any good developer, I opened up my dev tools and examined the cookies being sent back and forth in my calls. (And again, if you have no idea how that is done, <strong>speak up</strong> in the comments.) I noticed right away that the session cookies were not sticking. So what was the problem?
</p>

<p>
If you read the docs for <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#section_5">XHR and CORS</a> you discover this little gem:
</p>

<blockquote>
The most interesting capability exposed by both XMLHttpRequest and Access Control is the ability to make "credentialed" requests that are cognizant of HTTP Cookies and HTTP Authentication information.  By default, in cross-site XMLHttpRequest invocations, browsers will <strong>not</strong> send credentials.  A specific flag has to be set on the XMLHttpRequest object when it is invoked.
</blockquote>

<p>
In English, the cookies won't go back and forth. Raise your hand if you knew that. Now lower it you liar. ;) Luckily it is easy enough to fix with a flag in the XHR object. AngularJS exposes it as a property, withCredentials. 
</p>

<p>
But you then may run into yet another issue. My CORS header on the server was using Access-Control-Allow-Origin with a value of *. Basically, anyone and everyone can hit me. When you enable credentials on XHR, this is no longer allowed. Basically the browser is saying, "Sorry, this server is just too promiscuous for me." So for now, I've simply specified my local dev server in the origin. Once I get further down the line I'll probably remove CORS completely as it won't be needed for Cordova.
</p>