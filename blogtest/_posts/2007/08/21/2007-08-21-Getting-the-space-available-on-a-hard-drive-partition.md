---
layout: post
title: "Getting the space available on a hard drive (partition)"
date: "2007-08-21T14:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/21/Getting-the-space-available-on-a-hard-drive-partition
guid: 2295
---

I'm working on a tutorial for a client involving file uploads (which I'll be sharing on the blog). In the tutorial I talk a bit about monitoring the number of uploads and how much space they are taking. I was curious what methods exist for finding out how much space is being used on a drive and how much space is available.
<!--more-->
Finding out the space used by a directory is possible with CFDIRECTORY and query of query:

<code>
&lt;cfdirectory directory="#expandPath('.')#" recurse="true" action="list" name="allfiles"&gt;

&lt;cfquery name="getSize" dbtype="query"&gt;
select	sum(size) as total
from	allfiles
&lt;/cfquery&gt;

&lt;cfoutput&gt;Total size in bytes is: #getSize.total#&lt;/cfoutput&gt;
</code>

While this works it doesn't tell me how much space is available - just how much space a folder (and it's children) are using. I looked into the Java API and discovered that in  version 6 methods were added to java.io.File just for this purpose. (What I find funny is that it apparently took <b>9</b> years for the feature to be added. I wonder why?)

You have 2 main methods you can use - <a href="http://java.sun.com/javase/6/docs/api/java/io/File.html#getFreeSpace()">java.io.File.getFreeSpace </a> and <a href="http://java.sun.com/javase/6/docs/api/java/io/File.html#getUsableSpace()">java.io.File.getUsableSpace</a>. The docs explain that getUsableSpace is a bit safer than getFreeSpace:

<blockquote>
Returns the number of bytes available to this virtual machine on the partition named by this abstract pathname. When possible, this method checks for write permissions and other operating system restrictions and will therefore usually provide a more accurate estimate of how much new data can actually be written than getFreeSpace().
</blockquote>

You also have available <a href="http://java.sun.com/javase/6/docs/api/java/io/File.html#getTotalSpace()">getTotalSpace</a>, which returns the complete size of the partition. Here is a simple example of these functions:

<code>
&lt;cfset fileOb = createObject("java", "java.io.File").init("/")&gt;
&lt;cfoutput&gt;
freespace=#fileOb.getFreeSpace()#&lt;br&gt;
usablespace=#fileOb.getUsableSpace()#&lt;br&gt;
totalspace=#fileOb.getTotalSpace()#&lt;br&gt;
&lt;/cfoutput&gt;
</code>

Obviously "/" as a path is only going to work on Linux/OSX. (Well, I assume it won't work in Windows. If I'm wrong, let me know.)

p.s. This blog entry was written 3 hours ago. I was about one sentence away from being done when there was a large boom and the house went dark. Our electrical network on this street is made of swiss cheese. Thankfully I had the UPS running so I was able to quickly shutdown. I went over to my local CCs (coffee house) and used the wireless there. Since my mail was all stored on Google I didn't have much downtime. The power is back on... for now.