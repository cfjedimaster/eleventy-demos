---
layout: post
title: "Android, Photo Gallery Widget, and \"Unable to Save Cropped Photo\""
date: "2013-11-04T18:11:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2013/11/04/Android-Photo-Gallery-Widget-and-Unable-to-Save-Cropped-Photo
guid: 5077
---

<p>
Chalk this up to a bug that probably will never hit anyone but me, but I thought I'd blog it on the off chance others encounter it too. This weekend I picked up the new Nexus 7 (as to why, see the end of the post) and was going through the process of setting it up like my old model.
</p>
<!--more-->
<p>
One of the things I had on my last Nexus was three instances of the Photo Gallery widget. I use one each for my kids. I went to set this up again and ran into a problem. I added the widget. Told it I wanted to use one picture. Selected my picture from the gallery. But on the crop screen, when I tried to save the crop I got:
</p>

<blockquote>
Unable to save cropped photo
</blockquote>

<p>
*boggle* That was it. No details. Nothing more. Over on Google Plus John C. Bland II recommended I try the Android tools to see if I could figure out the issue. I loaded up Monitor, connected my tablet, and saw this:
</p>

<pre><code class="language-markup">
11-04 15:32:32.988: W/ActivityManager(519): Permission Denial: opening provider com.android.gallery3d.provider.GalleryProvider from ProcessRecord{% raw %}{423d6d10 910:com.google.android.gms/u0a10021}{% endraw %} (pid=910, uid=10021) requires com.google.android.gallery3d.permission.GALLERY_PROVIDER or com.google.android.gallery3d.permission.GALLERY_PROVIDER 
</code></pre>

<p>
And then...
<p>

<pre><code class="language-markup">
11-04 15:32:33.868: W/PlusEditorActivity(8197): Error writing file! 
11-04 15:32:33.868: W/PlusEditorActivity(8197): java.lang.IllegalArgumentException: Source files specified with content URI must also specify an output URI via the "output" extra. 
(lots more crap here)
</code></pre>

<p>
Unfortunately, I didn't really know what to make of it. But then I noticed something. The image I was using was synced from Picasa. On a whim, I made a SD Card copy of that photo (which is - as far as I can see - impossible from the Gallery - I had a copy of the image in Dropbox and I exported from there) - went back to the Photo Gallery widget and this time had no problem adding the image.
</p>

<p>
So long story - I guess be careful if you are working with Picasa images with Google widgets. 
</p>

<p>
So yeah - the Nexus 7. I was initially very happy to get my first gen Nexus 7 a while ago but I made the mistake of buying the model with the smallest storage. (6 - 8 gigs or some such.) They had a promotion with the new hardware then where every purchase gave you a copy of Transformers 3 (ugh). When I downloaded the movie I ended up with about 90% of my storage gone. When I picked up Grand Theft Auto, I was in a similar bind. Plus, I experienced performance problems and stuttery scrolling that just didn't leave me happy with the hardware.
</p>

<p>
After reading good reviews on the new unit, and seeing that the 32 gig model was <i>far</i> cheaper than the iPad Mini, I decided to go for it. So far, I'm pretty darn happy. The display is incredible. The performance is great. This is definitely going to be my "travel" tablet going forward.
</p>