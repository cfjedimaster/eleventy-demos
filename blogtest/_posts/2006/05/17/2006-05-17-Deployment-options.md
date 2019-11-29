---
layout: post
title: "Deployment options?"
date: "2006-05-17T11:05:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2006/05/17/Deployment-options
guid: 1273
---

Tom asked, 

<blockquote>
Ray, one topic that I'd love to hear about from the audience on your site is the techniques that are used to send files live on a production environment.  Do people use a program like xcopy or Robocopy, or do they just push them manually
with FTP? What kinds of testing and versioning are commonly used before a file is sent live?
</blockquote>

To be honest I suck at this. Well, I don't know if "suck" is the right term, but I don't do anything fancy. I just use FTP. Typically, once a site has gone live, my only changes are new features and bug reports. (Sorry, "Issue Management.") Since this typically involves one or two files, I just FTP them up to live. This has only been a problem once - with a client that had two boxes, and they had replication set up so even if I did forget to move a file, it was fixed within the hour.

You mentioned versioning as well, and yes, I do use versioning (mostly Subversion now), but it isn't tied yet to my deployment process. (If that makes sense.)

So this is probably not the best answer - but as Tom said, he was looking for a range of answers from my readers. (As a side note - how do folks feel about "discussion" topics like this? I almost didn't blog this as I didn't have an 'authoritative' type answer, but he did request feedback from my 'audience' so I figured it was ok. This blog is certainly more than just me, and I love that, and I think my readers do as well. Anyway, if folks have a problem with entries like this, please ping me via email.)