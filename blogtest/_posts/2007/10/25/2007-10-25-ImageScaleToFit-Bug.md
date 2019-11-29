---
layout: post
title: "ImageScaleToFit Bug"
date: "2007-10-25T11:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/25/ImageScaleToFit-Bug
guid: 2433
---

I just ran into an interesting imageScaleToFit bug. I was writing some code to handle scaling an uploaded image when I got this error:

<blockquote>
For gray scale images the interpolation argument must be one of: NEAREST {% raw %}| BILINEAR |{% endraw %} BICUBIC {% raw %}| HIGHESTQUALITY |{% endraw %} HIGHQUALITY {% raw %}| MEDIUMQUALITY |{% endraw %} HIGHESTPERFORMANCE {% raw %}| HIGHPERFORMANCE |{% endraw %} MEDIUMPERFORMANCE
</blockquote>

According to the <a href="http://www.cfquickdocs.com/cf8/?getDoc=ImageScaleToFit">docs</a>, the default interpolation is highestQuality so I don't quite get what CF is thinking I'm using. Specifying the interpolation made the error go away of course and then works just fine for grayscale or non-grayscale images. (I filed a bug report for this already.)