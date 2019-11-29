---
layout: post
title: "The right (and wrong) way to package a ColdFusion Builder extension"
date: "2011-03-10T09:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2011/03/10/The-right-and-wrong-way-to-package-a-ColdFusion-Builder-extension
guid: 4152
---

This has tripped up a lot of people, myself included, and impacts both extension writers and extension users. Have you ever tried to install a ColdFusion Builder extension and gotten this error?

<img src="https://static.raymondcamden.com/images/ScreenClip43.png" />

If you get this, it means the extension writer incorrectly zipped his or her extension. When you create a zip file from an extension folder, it is critical that you zip <b>from the directory itself</b> and not from the parent. Does that make sense? Probably not. Here is the right way to zip an extension in Windows - it should be similar for fruity machines:


<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip44.png" />

It may be a bit hard to see in this screen shot, but I'm <b>inside</b> the extension folder itself. This will create a zip where ide_config.xml is in the root.

The wrong way is to create the zip from above the folder. This is how I <b>always</b> make my zips which I think is pretty natural for folks too. It's also why you keep seeing this mistake happen:

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip45.png" />

Here is another way to see the difference. I opened both up in WinRAR. You can see the one on the left has ide_config.xml in root, while the other has the folder itself.

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip46.png" />