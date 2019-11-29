---
layout: post
title: "Creating watermarked images in PhoneGap"
date: "2012-05-22T11:05:00+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/05/22/Creating-watermarked-images-in-PhoneGap
guid: 4624
---

A reader asked me if it was possible to watermark images (like those taken with a camera) in PhoneGap. This is rather trivial using Canvas (hey, it <i>does</i> have a use!) so I whipped up the following example to demonstrate it in action.
<!--more-->
First - let's look at the code. It's short enough to show all at once:

<script src="https://gist.github.com/2769530.js?file=gistfile1.html"></script>

The UI for the application is just a header and a button. I've got the button initially disabled as I need to ensure some resources load before you start taking pictures. 

Looking at the JavaScript code, you can see that I've created a canvas instance from the DOM and have created a watermark image. When it loads, I'm ready to watermark so I enable the button.

The button's touchstart event ties in to the PhoneGap <a href="http://docs.phonegap.com/en/1.7.0/cordova_camera_camera.md.html#Camera">Camera API</a> to trigger the device to create a new picture. I could allow for gallery photos as well or make use of images from the web. 

Once you take a picture, it's a trivial matter then to load it into an image object and copy it onto the canvas. Note that I place the watermark in the lower right hand corner of the image. That's where most watermarks seem to go so I did the same.

Here's a quick example. Forgive the horrible quality of the Xoom camera.

<img src="https://static.raymondcamden.com/images/device-2012-05-22-095628.png" />

You can do anything you want with the image now, including <a href="http://stackoverflow.com/questions/1590965/uploading-canvas-image-data-to-the-server">getting the bits</a> and <a href="http://www.raymondcamden.com/index.cfm/2011/11/2/PhoneGap-file-upload-to-ColdFusion">uploading it to a server</a>.