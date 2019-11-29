---
layout: post
title: "Remove EXIF data with ColdFusion"
date: "2014-01-06T06:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/01/06/Remove-EXIF-data-with-ColdFusion
guid: 5120
---

<p>
Yesterday on Facebook I saw one of those "PLEASE SHARE WITH EVERYONE" type posts involving pictures and GPS data. Apparently there are still people who don't know about the metadata embedded with pictures and how they can be a risk. Fair enough - it's not like your camera typically warns you about this and if you don't know this stuff even exists, you can certainly understand how folks would be surprised when they found out. Given that you may want to help users out with this, how could you use ColdFusion to remove EXIF data from an image?
</p>
<!--more-->
<p>
I <i>thought</i> this would be rather simple, but from what I can see, it is impossible. There is an imageGetEXIFMetadata function in ColdFusion, but no set or clear version. I did some Googling and discovered no solution at all. Brian Kresge blogged about this back in March, 2011 (<a href="http://www.bk-mp.com/exif-data-coldfusion-and-iphones/">EXIF Data, Coldfusion, and iPhones</a>). His solution involved using imagePaste to copy the bits to a new image. I thought - surely - this can't be the only solution - but when I switched to Java I saw people doing something similar. 
</p>

<p>
I hate to say it - but it looks like creating a new image is the only solution. This isn't terrible of course. If you are allowing folks to upload images you are probably doing work on them already - ensuring they aren't too big, possibly resizing them and creating thumbnails, etc. Here is a super simple example of this in action.
</p>

<pre><code class="language-markup">&lt;cfset s = &quot;&#x2F;Users&#x2F;ray&#x2F;Desktop&#x2F;ray.jpg&quot;&gt;
&lt;cfset img = imageRead(s)&gt;
&lt;cfset exif = imageGetExifMetadata(img)&gt;
&lt;cfdump var=&quot;#exif#&quot; label=&quot;Exif Data&quot;&gt;

&lt;hr&#x2F;&gt;

&lt;cfset sNew = &quot;&#x2F;Users&#x2F;ray&#x2F;Desktop&#x2F;ray.clean.jpg&quot;&gt;
&lt;cfset imageWrite(img, sNew)&gt;

&lt;cfset img = imageRead(sNew)&gt;
&lt;cfset exif = imageGetExifMetadata(img)&gt;
&lt;cfdump var=&quot;#exif#&quot; label=&quot;Exif Data&quot;&gt;
</code></pre>

<p>
I'd share a screen shot but all it shows is a big struct and then an empty struct. Keep in mind that if you want to preserve any of the EXIF data, you could. In my sample above I grab the data. You could store it in the database with the image file name. This could be useful data that you don't want to lose.
</p>