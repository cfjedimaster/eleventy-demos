---
layout: post
title: "Some notes on CFFILE/UploadAll"
date: "2009-11-14T07:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/14/Some-notes-on-CFFILEUploadAll
guid: 3604
---

Earlier this week I <a href="http://www.raymondcamden.com/index.cfm/2009/11/11/Important-notes-about-ColdFusion-9s-new-multi-file-uploader">blogged</a> about the new multi-file uploader in ColdFusion 9. While that control handles the front end support for handling multiple uploads, it works hand in hand with a new update to the cffile tag to support multiple file uploads. I did some digging into this and discovered some interesting tidbits.
<!--more-->
First - the docs mention that when using cffile/action="uploadall", you get an array of CFFILE structures. This is true - but you will notice that if you use the multi-file uploader that the array will always contain one item. Why? The front end UI control may upload 2 or more files, but it's only going to upload one at a time. In fact, cffile/action="uploadAll" is kind of pointless with that control. It will always only have one upload at a time.

Second - you certainly can use cffile/action="uploadall" without using the new multi-file uploader. You can use it for hard coded forms like so:

<code>
&lt;form action="test3.cfm" enctype="multipart/form-data" method="post"&gt;
&lt;input type="file" name="file1" id="file1"&gt;&lt;br/&gt;
&lt;input type="file" name="file2" id="file2"&gt;&lt;br/&gt;
&lt;input type="file" name="file3" id="file3"&gt;&lt;br/&gt;
&lt;input type="submit" name="submit"&gt;
&lt;/form&gt;
</code>

In this case, cffile/action="upload" automatically finds all the file fields and processes them in order. Unfortunately you don't get information about the particular form field. The order seems to match the order of the form itself, but I'm not sure that is guaranteed. I'd probably say it is safe to assume it does.