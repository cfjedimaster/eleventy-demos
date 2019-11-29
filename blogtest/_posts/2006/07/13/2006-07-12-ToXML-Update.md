---
layout: post
title: "ToXML Update"
date: "2006-07-13T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/13/ToXML-Update
guid: 1398
---

I'm currently working on the 5.1 version of <a href="http://www.blogcfc.com">BlogCFC</a>. As part of my set of updates, I'm changing the entry editor to use Spry to handle selecting related entries. This worked fine, but I noticed that the speed improvement wasn't what I thought it would be.
<!--more-->
I did some testing with one of the most useful tags out there, <a href="http://www.techfeed.net/cfQuickDocs/?cftimer">cftimer</a>, and discovered that the major slowdown in the process was my toXML code. 

I had forgotten that string manipulation can be a bit slow in ColdFusion. Since I was converting about 800 rows of data to XML, the slowdown wasn't surprising. I changed the code to use Java's StringBuffer class. This is much more efficient when doing a large number of string changes. 

How did it work? I was seeing execution times of 1000 ms to create my XML packet. When I switched to using StringBuffer, the time went to under 100 ms. To me, that's a good improvement. 

I've attached the zip to this entry. For those who don't remember, the purpose of this CFC is to let you convert various ColdFusion datatypes to XML packets. Yes you can do this with <a href="http://www.techfeed.net/cfQuickDocs/?cfwddx">cfwddx</a>, I wanted something that gave me more control over the XML so that I could use it with Spry. Enjoy.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2FArchive2%2Ezip'>Download attached file.</a></p>