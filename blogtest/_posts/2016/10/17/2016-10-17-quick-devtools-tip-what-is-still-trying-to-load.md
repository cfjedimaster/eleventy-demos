---
layout: post
title: "Quick DevTools Tip - what is still trying to load?"
date: "2016-10-17T14:46:00-07:00"
categories: [development]
tags: []
banner_image: 
permalink: /2016/10/17/quick-devtools-tip-what-is-still-trying-to-load
---

Have you ever loaded a web page, seen that main content render, and then notice that the loading widget seems to rotate (pulsate, etc, every browser is different) for eternity? Obviously there is some network request that is pending, but how do you figure out what that is, especially with a large set of requests to dig through?

<!--more-->

In Chrome, there is a quick way to see this. In your devtools, first ensure the filter field is visible:

![Enable the Filter!](https://static.raymondcamden.com/images/2016/10/cd1.png)

Then type <code>is:running</code> in the form field. Here is an example from GMail:

![An example](https://static.raymondcamden.com/images/2016/10/cd2.png)

In case you didn't know it, that filter field supports both name matches as well as property-type searches like the example above. The field will nicely offer suggestions for these properties as you type, but you can find a complete list here: 

<a href="https://developers.google.com/web/tools/chrome-devtools/network-performance/resource-loading#filter_requests">Filter requests</a>

You should scan that page a bit as I found two interesting tidbits. On Mac/Unix (not sure why not Windows), you can add multiple filters. Also, you can filter by requests larger than a set value. That's a great way to check for fat requests.

I looked for something similar in Firefox, Edge, and Safari, but didn't see anything that would support the same result.