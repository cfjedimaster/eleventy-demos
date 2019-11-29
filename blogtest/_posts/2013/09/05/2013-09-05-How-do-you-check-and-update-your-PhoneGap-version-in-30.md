---
layout: post
title: "How do you check (and update) your PhoneGap version in 3.0?"
date: "2013-09-05T16:09:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2013/09/05/How-do-you-check-and-update-your-PhoneGap-version-in-30
guid: 5029
---

A tip of the rage wolf to fellow Adobian Brian Leroux for his help with this blog post. And by help, I mean he basically explained it all to me and I'm just making it pretty. 

One of the big changes to PhoneGap 3.0 is in how you install it. Previously you would download a zip file, expand it, and have all the bits you need. Now the installation process has you use npm (Node Package Manager) to grab the bits.
<!--more-->
I've been using Node and npm for a while, but I'm definitely still a bit unsure of how it works. The question I had was - how would I be able to tell when a new version was released and how would I get my copy updated?

First, remember that the phonegap CLI has a -v argument that tells you the current version you have installed:

<img src="https://static.raymondcamden.com/images/bp1.jpg" />

Currently the PhoneGap site only mentions 3.0 and not anything more specific, so to compare your version to the latest in npm, you would do "npm info phonegap version". This is demonstrated below:

<img src="https://static.raymondcamden.com/images/bp2.jpg" />

In this case, my version is the same, but if I wanted to update, I'd run: npm update -g phonegap. I always use sudo in front but you may not have to do that (especially on Windows ;).

<img src="https://static.raymondcamden.com/images/bp3.jpg" />

Hope this helps. Tomorrow morning I'll be blogging about how plugins have changed.