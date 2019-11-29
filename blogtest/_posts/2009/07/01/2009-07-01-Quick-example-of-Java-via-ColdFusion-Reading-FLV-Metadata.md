---
layout: post
title: "Quick example of Java via ColdFusion - Reading FLV Metadata"
date: "2009-07-01T14:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/01/Quick-example-of-Java-via-ColdFusion-Reading-FLV-Metadata
guid: 3417
---

Earlier this week a reader asked if there was a way to read FLV Metadata via ColdFusion. There isn't anything built in (that I know of!) so I did a quick search for a Java solution. I think people forget how easy it is to use Java via ColdFusion. Even if you have no intent, or care, to read FLV Metadata, please read on as the general technique is something I've done many times in ColdFusion, and could be helpful to anyone looking to do something not directly supported via CFML.
<!--more-->
My search for a Java based solution came to this blog post: <a href="http://java-servlet-jsp-web.blogspot.com/2009/06/java-program-to-fetch-flv-metadata.html">Java program to fetch FLV metadata</a> The author kindly provided a simple Java program that provided everything necessary. 

I took his code, saved it as FLVMetaData.java. I removed the main() method because, as far as I knew, that is only useful for command line programs. It probably would have worked fine as is - so you may want to pretend I didn't say that. Once I had a class file, I needed to put it somewhere ColdFusion would recognize. I know there is a folder that ColdFusion uses out of the box, but as I always tend to forget that folder, and because I'd rather store my custom stuff separately, I added a new folder in the ColdFusion Admin:

<img src="https://static.raymondcamden.com/images//Picture 168.png">

Last but not least - I restarted ColdFusion and wrote one line of code to test that I could load the class.

<code>
&lt;cfset ob = createObject("java", "FLVMetaData")&gt;
</code>

And that was it! It just plain worked. Ok, so I did actually try to read some FLV metadata:

<code>
&lt;cfset ob.init("/Users/ray/Desktop/Life-on-Repeat.flv",false)&gt;

&lt;cfdump var="#ob#"&gt;

&lt;cfoutput&gt;
duration=#ob.getDuration()#&lt;br/&gt;
width=#ob.getWidth()#&lt;br/&gt;
height=#ob.getHeight()#&lt;br/&gt;
&lt;/cfoutput&gt;
</code>

and it worked perfectly. So, not rocket science of course, but again, I wanted to remind people how easy it is to extend ColdFusion with Java. I think this is a great example where something not provided by ColdFusion directly was easy enough to add with some Java code.

<b>Example output</b><br/>
<img src="https://static.raymondcamden.com/images/cfjedi//Picture 244.png">

p.s. Why didn't I use <a href="http://javaloader.riaforge.org">JavaLoader</a>? As far as I know, JavaLoader only works with JAR files. I spoke with Mark earlier this week though and he said that class files should also work (but he wasn't 100% sure).