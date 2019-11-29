---
layout: post
title: "Dealing with ColdFusion Binds and JavaScripts"
date: "2007-12-11T07:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/11/Dealing-with-ColdFusion-Binds-and-JavaScripts
guid: 2529
---

One of the cool things in ColdFusion 8 is how easy bindings are. You can tie a cfdiv, window, or other item to a form field and when the user changes it, the cfdiv will automatically note the change. This all happens with the magic of bindings. One problem you run into however is setting the form field via JavaScript. If you do this - you will notice the bindings don't fire like you would expect.

Rakshith, who works on the ColdFusion team for Adobe, has two articles on this subject I just discovered. (He asked me to add his blog to <a href="http://www.coldfusionbloggers.org">CFBloggers.org</a>.)

The first blog entry, <a href="http://www.rakshith.net/blog/?p=35">Fire the onchange event the browser independent way</a>, describes how to fire events in general from JavaScript. The second, <a href="http://www.rakshith.net/blog/?p=36">cfwindow url binding: bind on window source</a>, shows an example with ColdFusion.