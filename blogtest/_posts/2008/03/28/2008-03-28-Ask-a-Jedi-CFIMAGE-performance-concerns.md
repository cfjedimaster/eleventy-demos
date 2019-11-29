---
layout: post
title: "Ask a Jedi: CFIMAGE performance concerns"
date: "2008-03-28T15:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/28/Ask-a-Jedi-CFIMAGE-performance-concerns
guid: 2737
---

James asks:

<blockquote>
<p>
I'm hoping you might be able to give me some insight into
performance considerations when using CF8 image manipulation functions. Basically, I have an image upload function where the user can add 5 images into a list and then click a single upload button to upload them. When they click
upload, multiple asyncronous Ajax requests are fired which upload the images to the server (using the Ajax upload code you blogged about recently).

Upon upload, the file upload service then resizes the images to a thumbnail and large size. This is performed via the CF8 image tag.

My concern is that when these 5 images are all being uploaded and processed at the same time my development
server CPU jumps to 100%. Obviously image processing is going to put some strain on the system but I'm a little worried that when the site goes into production
it could be an issue.

Do you think it's wise to upload and process all 5 images simultaneously or should I do them one at a time.
Any idea if CFTHREAD would be useful here.
</p>
</blockquote>
<!--more-->
There are a couple things going on here. So let me try to break this out a bit.

<ul>
<li>The first thing I want to address is the 100% CPU issue. I do <b>not</b> know this for a fact, but from what I remember hearing from smarter folks, is that this is normal behavior, and simply reflects ColdFusion using all the power available because, well, it's available. I would think you would want ColdFusion (or any other process needing resources) to be able to use the full resources of your box. But again - I'm definitely <b>not</b> sure on this.

<li>I definitely agree with you on image processing being intensive. I've seen odd delays in the past with image resize. Typically though this was always with very large images, and you can kind of expect some delays in that area. ColdFusion actually provides <b>17</b> different algorithms for resizing images, so you have a lot of choices there for tweaking quality and performance. By default ColdFusion uses the highest quality resize.

<li>You mentioned CFTHREAD. If you were uploading all 5 at the same time, I'd say sure, do it. But if you are doing an Ajax based upload, you may be doing them all at the same time. I don't know exactly how you are sending the data so you have to tell me, but if you are sending all 5 with one POST operation, CFTHREAD could indeed be useful here to run all the requests at once. You just want to be careful. If you have 250 users all uploaded 5 images at once, you are going to quickly run out of threads you can use. Sorry - I just reread your question and you said you are definitely doing the uploads one at a time, so in that case, I don't think CFTHREAD will help - you already have 5 separate requests.

<li>And lastly, I hope you are <i>keeping</i> those resized images. I assume you do the upload, resize and store. If not - you definitely want to do that. With resize being (possibly) a bit slow, you want to ensure you do it once and save it to the file system.

</ul>