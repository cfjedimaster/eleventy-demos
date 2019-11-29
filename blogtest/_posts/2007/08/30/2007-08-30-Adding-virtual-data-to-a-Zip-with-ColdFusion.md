---
layout: post
title: "Adding \"virtual\" data to a Zip with ColdFusion"
date: "2007-08-30T14:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/30/Adding-virtual-data-to-a-Zip-with-ColdFusion
guid: 2315
---

I wrapped up the CFZIP portion of my work on CFWACK last night and I came across a cool feature. Did you know that you can add fake/virtual/you get the idea files to a zip? If you use CFZIP to create a zip you can specify a file or folder. This data has to exist on the file system. However - if you make use of the child cfzipparam tag, you can add a file directly from a variable. Consider the following simple example:

<code>
&lt;cfset zipFile = expandPath("./zp.zip")&gt;

&lt;cfzip file="#zipFile#" action="zip"&gt;
	&lt;cfzipparam content="#repeatString('Simple Text',999)#" entrypath="simple.txt"&gt;
	&lt;cfzipparam source="#expandPath('./unzip.cfm')#" entrypath="/sub/unzipfile.cfm"&gt;	 
&lt;/cfzip&gt;
</code>

This code sample adds two entries to a zip file. The first is a string. I used repeatString with a count of 999 so I could test how well it compressed. The second zipparam tag uses a real file name - but note how I change both the name and folder for the file. 

The only thing missing is the ability to store zip data itself into a variable. When making a zip, the file attribute is required. It would be nice if we could specify "name" and have the binary data stored there. Then we could serve up 100% completely virtual zips to users. (Obviously that could be a bit intensive so you would need to use it with care.)