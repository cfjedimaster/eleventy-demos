---
layout: post
title: "Are you aware of the MIME/File Upload Security Issue?"
date: "2009-06-30T12:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/30/Are-you-aware-of-the-MIMEFile-Upload-Security-Issue
guid: 3415
---

I had heard a few rumblings of this recently but had not really paid it much attention. Mike emailed me today and described how he was hacked pretty badly by it. I'll share his email and then add some notes to the end.
<!--more-->
<blockquote>
<p>
Over the last week we have had 3 Coldfusion servers hit by a hacker who is uploading .cfm files using upload form fields that are set to accept only images.
</p>
<p>
As a long-term Coldfusion user, I never knew that it is possible to spoof Coldfusion into uploading executable (.cfm) files when it was set to only allow images. This post by Brent Fry explains more: <a href="http://www.cfexecute.com/post.cfm/spoofing-mime-types-with-coldfusion-and-cfhttp">http://www.cfexecute.com/post.cfm/spoofing-mime-types-with-coldfusion-and-cfhttp</a>
</p>

<p>
This has major implications for any web site that allows users to upload images (like dating sites or community sites). You MUST take precautions like adding code to verity the mime type after an upload as discussed by Peter
Freitag in this post: <a href="http://www.petefreitag.com/item/701.cfm
">http://www.petefreitag.com/item/701.cfm</a>
</p>

<p>
In our case, the hacker was able to upload an index.cfm file that provided them with COMPLETE control of our server (I'll send you the hackers page if you'd like -- it is
truly impressive). They were able to install trojans that, among other things, would email China with our username and password every time we logged onto the server.
</p>

<p>
We could not find a scanning program that could identify and remove these trojans. All the Google search results about it were in Chinese. Our servers were so thoroughly compromised that we had no choice but to completely rebuild them.
</p>

<p>
I am hoping that you can warn others about this issue. I am
not aware of any information from Adobe about this, and I have heard very little on the blogs. I'm surprised because I know of MANY other sites who have experienced the same attacked over the past week.
</p>

<p>
I'm hoping that people can learn from our experience and protect themselves now. I have no doubt that this will become a much more common attack in the very near future. The message is clear: if people are able to use an upload file form field on your web site, you too may be vulnerable.
</p>
</blockquote>

Nice (and by nice I mean it in the snarky, oh crap, why can't people be nice version). So, I strongly encourage folks to read both of the linked too articles above. They nicely describe the issue as well as talk about solutions.

I'll add to Peter's <a href="http://www.petefreitag.com/item/701.cfm">post</a> that you can sniff a file for being a valid image by using the new isImageFile(). Ditto for isPDFFile(). Of course, if you are working with something besides images and PDFs then you will need to use another mechanism.

I especially like the suggestion of pushing static files to something like Amazon S3. Not only does this help reduce your security risk, but it also means you don't have to worry about drive space (as long as you can afford it of course). 

I decided not to post the code of the attack script. I don't think it's a risk to post it - I mean, it's not the code that's bad but the fact that someone uploaded it and used it to attack, but I'll err on the side of paranoia here and just not post it. (Although I did not that the hacker didn't properly var scope. Tsk Tsk.)

I think every software project contains red flags - things that you must have but have (potentially) negative side effects in terms of performance and security. Certainly any file upload ability should be considered a red flag and should be documented/reviewed/checked to ensure it can't be abused.