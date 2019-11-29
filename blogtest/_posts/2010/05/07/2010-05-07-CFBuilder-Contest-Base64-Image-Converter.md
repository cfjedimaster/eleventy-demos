---
layout: post
title: "CFBuilder Contest: Base64 Image Converter"
date: "2010-05-07T15:05:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/05/07/CFBuilder-Contest-Base64-Image-Converter
guid: 3809
---

<img src="https://static.raymondcamden.com/images/cfjedi/cf_builder_appicon.jpg" align="left" style="margin-right:5px" title="ColdFusion Builder FTW!" /> Today's ColdFusion Builder Contest entry comes from Dave Ferguson. Once again - it is a very unique, very interesting extension that I think just goes to show what kind of tools you can build when you have a platform as extensible as CFBuilder. His extension allows you to create Base64 strings out of images. Not only that - you can actually <i>create</i> images with the extension as well!

<br clear="left">
<!--more-->
For those who don't know - you can embed images as strings in both IMG tags and within CSS as well. It's one way to help minimize network calls. Instead of 2 calls (one for HTML, one for an image), you end up with one call (HTML+image data all in one). I did a quick Google for a tutorial on it and this is the first I found: <a href="http://www.websiteoptimization.com/speed/tweak/inline-images/">Inline Image with Data URLs</a>. If anyone has a better recommendation/tutorial, please post it as a comment. 

The first feature of this extension is the ability to right click on an image in your project. I did that and then asked the extension to convert it to base64:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-05-07 at 1.03.29 PM.png" title="Shot one" />

It would be nice if the extension had a way to copy to my clipboard, but as far as I know that isn't an option. I selected all, copied, and pasted into CFBuilder, and had a bit of sluggishness with the super long string. I was able though to add the proper HTML in front: <img src="data:image/gif;base64,long string of stuff here"> and was surprised to see it worked perfectly. 

Along with right clicking on images, you can, supposedly, also right click on a file and the extension will scan it for images. However, the extension told me it didn't support this. Since Dave said it <i>should</i> work, I'm assuming this will be fixed ASAP once he finds out. 

I then tried the 'create an image' support. While you are somewhat limited in what you can make (gradients), the UI for this is slick as heck. For example, there is a very nice color picker:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-05-07 at 11.31.51 AM.png" title="Show deux" />

Nice growl-like error handling (although the growl messages went a bit too quickly for me to take a nice screen shot):

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-05-07 at 11.34.48 AM.png" title="Return of the Shot" />

and the end result is nice as well:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-05-07 at 11.33.48 AM.png" title="The Phantom Shot" />

Code wise - there isn't much to speak to here. I'll note that once again - the developer made use of the Application scope to cache information. I don't know why I struggled so much trying to get sessions to work in my extensions. I was able to "break" his extension again by selecting an invalid file first and then a valid file - but that's really a bug in CFBuilder. I will say I absolutely loved his error handler (and how he made use of his own product within it). Error handling is something I typically <i>don't</i> do in my extensions, but I'm definitely going to think more about it going forward. 

Anyway - what do people think? I mean - so far - I freaking love our submissions. I've been a huge fan of CFBuilder extensions, but seeing the examples so far, I'm even more of a fan boy.