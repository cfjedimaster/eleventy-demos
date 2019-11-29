---
layout: post
title: "Error resizing a JPG with ColdFusion?"
date: "2009-07-15T09:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/15/Error-resizing-a-JPG-with-ColdFusion
guid: 3441
---

I exchanged a few emails yesterday with Steve concerning an issue he was having creating thumbnails in ColdFusion. He had a query of filenames, many of them, and was looping over each and shrinking them down:

<code>
&lt;cfloop query="employee"&gt;
&lt;cfif len(photo_path)&gt;
&lt;cfimage action="resize"
source="#wwwroot#\photos\#userid#\#photo_path#"
destination="#wwwroot#\photos\#userid#\thumbnail.jpg" overwrite="yes" height="20{% raw %}%" width="20%{% endraw %}"&gt;
&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

This worked consistently until he got to the 12th record. Then he would get the following:

<blockquote>
<p>
<b>Error Occurred While Processing Request</b><br/>
attempt to read data outside of exif segment (index 10080 where max index is 9905)
</p>
</blockquote>

I confirmed the issue on my server with his 'bad' image, but unfortunately didn't have any luck finding a solution with Google. I did find though that ColdFusion 9 worked with the file perfectly. 

Luckily Steve was a better Google Ninja than I, and he found this article from the Webapper folks: <a href="http://www.webapper.com/blog/index.php/2007/10/26/coldfusion-8-exif-error/">ColdFusion 8 EXIF Error</a>

The technique described in the article (getting and deploying an updated JAR) worked perfectly for Steve. Just sharing this in case others run into it as well.