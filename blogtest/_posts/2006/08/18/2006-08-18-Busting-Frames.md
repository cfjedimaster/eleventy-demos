---
layout: post
title: "Busting Frames"
date: "2006-08-18T13:08:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2006/08/18/Busting-Frames
guid: 1481
---

I discovered today that my site was being aggregated by Amsay.com. This is ok, but I notice s/he was framing my web pages and showing ads in the left frame. That I don't feel so good about. I quickly added this to my body tag, and I will be adding it to the core blogcfc code.

<code>
&lt;body onload="if(top != self) top.location.href=self.location.href"&gt;
</code>