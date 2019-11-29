---
layout: post
title: "ColdFusion S3 Issue with Folders"
date: "2011-02-10T14:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/10/ColdFusion-S3-Issue-with-Folders
guid: 4116
---

Wow, bad week for ColdFusion/S3 bugs. I reported a few days ago about a <a href="http://www.raymondcamden.com/index.cfm/2011/2/7/ColdFusion-S3-Implementation-bug-with-metadata-and-ACLs">ColdFusion/S3 issue with metadata</a>. Today I verified a bug reported by Stefan Richter on cf-talk concerning folders. I'll keep it short and sweet. If you use ColdFusion's cfdirectory tag to list the contents of a bucket that has a subfolder with no lastdate modified value, you will get an error in ColdFusion. How do you end up with a folder with no lastdate modified value? It's simple enough in the S3 Web tool. Just make a new folder. Obviously this folder was <i>never</i> modified so it makes sense.

Unfortunately this is a pretty critical issue. If you use ColdFusion to work with buckets you have no control over, then you will need to use another solution (like perhaps this <a href="http://amazons3.riaforge.org/">open source S3 wrapper</a>) to safely navigate your data. If your ColdFusion application is the only "client" for a bucket, then you probably don't need to worry.

I've filed a bug report <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=86314">here</a> for the issue.

I was about to hit submit on this when I decided to quickly test something. If you use directoryList() instead of cfdirectory, and use listInfo=path, you do not get an error. Unfortunately you don't get information about the results in terms of them being a file or a directory, but if you want to assume anything without an extension is a folder, you are probably safe.