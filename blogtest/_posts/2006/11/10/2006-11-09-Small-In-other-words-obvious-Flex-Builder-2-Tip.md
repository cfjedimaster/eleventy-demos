---
layout: post
title: "Small (In other words - obvious) Flex Builder 2 Tip"
date: "2006-11-10T09:11:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2006/11/10/Small-In-other-words-obvious-Flex-Builder-2-Tip
guid: 1645
---

One of the things that bugged me about Flex development was the fact that when I wanted to test CSS changes, I had to rebuild the complete application and run it again in the browser. For a large app, that can take a <i>very</i> long if you are just changing a font size attribute.

That is completely unnecessary. All you need to do is view your MXML in design mode. You can then switch to your CSS file, make the changes, return to the MXML tab and hit the little green refresh button.

Duh. I don't know why I didn't find this sooner. I guess I'm still burned by how sucky the Design tab was back in the Studio/Homesite days that I tend to avoid it like a plague. Either way - it works darn good in Flex Builder and is a heck of lot better than doing a complete rebuild.