---
layout: post
title: "Drag and Drop on File Inputs in HTML"
date: "2015-01-21T12:50:36+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2015/01/21/drag-and-drop-on-file-inputs-in-html
guid: 5575
---

A big thank you to <a href="http://sarasoueidan.com/">Sara Soueidan</a> for sharing this on Twitter. I've worked with a few web apps that allow for drag and drop file uploads and when it works well, it is really handy. In fact, being able to drag and drop an image onto my Wordpress editor is one of the things I'm most happy about since my migration. But did you know that you can drag and drop a file onto a regular HTML input file field?

<!--more-->

As Sara discovered, and I verified, you absolutely can. It works in Chrome, Firefox, and Safari. I confirmed it myself in Chrome and Firefox. I tested IE11 and - unfortunately - it doesn't work. Both Chrome and Firefox will also support dragging multiple files if you include the <code>multiple</code> attribute in the input field. 

As I said, I didn't test Safari, but Chrome also provides UI feedback during the drag that makes this feature a bit more obvious:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/01/chrome2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/01/chrome2.png" alt="chrome2" width="750" height="341" class="alignnone size-full wp-image-5576" /></a>

Notice how the button becomes highlighted. So - quick show of hands - how many of you knew your browser supported this?