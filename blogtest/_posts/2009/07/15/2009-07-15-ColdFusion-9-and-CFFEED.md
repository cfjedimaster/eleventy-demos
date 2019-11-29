---
layout: post
title: "ColdFusion 9 and CFFEED"
date: "2009-07-15T22:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/15/ColdFusion-9-and-CFFEED
guid: 3444
---

I've complained (quite a bit) about some of the warts around the CFFEED tag. Looks like my complaining may have helped a bit. ColdFusion 9 adds a new feature to CFFEED that I think is pretty darn nice. 

Previously, if you tried to create a feed and it contained "bad" characters (Microsoft Smart Quotes, etc), then you ended up with invalid XML. Here is a simple example.
<!--more-->
First, I'll create a feed with one entry. The entry content is contained in a file called bad.txt:

<img src="https://static.raymondcamden.com/images//Picture 174.png">

Here is the code I used to include and create a feed from the text file.

<code>

&lt;cfscript&gt; 
// Create the feed data structure and add the metadata. 
myStruct = {}; 
mystruct.link = "http://www.coldfusionjedi.com"; 
myStruct.title = "My Blog"; 
mystruct.description = "It wears sunglasses at night"; 
mystruct.pubDate = Now(); 
mystruct.version = "rss_2.0"; 

/* Add the feed items. A more sophisticated application would use dynamic variables 
and support varying numbers of items. */ 
myStruct.item =[];
myStruct.item[1] = {}; 
myStruct.item[1].description = {}; 
myStruct.item[1].description.value = fileRead(expandPath("../bad.txt")); 
myStruct.item[1].link = "http://www.cnn.com";

myStruct.item[1].pubDate = Now(); 
myStruct.item[1].title = "Title"; 

&lt;/cfscript&gt; 

&lt;cffeed action = "create" 
name = "#myStruct#" 
escapechars="false"
xmlVar = "myXML"&gt; 

&lt;cfoutput&gt;
#htmlCodeFormat(myXML)#
&lt;/cfoutput&gt;
</code>

This is standard CFFEED stuff, so I won't describe each line. I don't normally make feeds this way though - normally I create it from a query. Note that I've included escapechars, and set it to false, which makes it match ColdFusion 8 behavior. The result is a bit funky:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 247.png">

Switching escapechars to true though results in:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 332.png">

Nice. There are other ways to handle this but this is certainly a bit simpler. 

There is another new ColdFusion 9 that indirectly helps CFFEED as well. One of the things I do at <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a> is called a <a href="http://www.coldfusionjedi.com/index.cfm/2007/10/15/Doing-HTTP-Conditional-Gets-in-ColdFusion">HTTP Conditional Get</a>. This is basically a 'smart' HTTP call in that I can say: "Hey URL, I last hit you at 5PM, if you haven't updated, send me a nice short message, otherwise send me all your data." This helps streamline some of the network traffic I incur when fetching 500+ RSS feeds. However, there is a problem. If the data is new, and I get the RSS XML back, I have it in a variable. CFFEED only supports parsing URLs and files, it doesn't support parsing a string. This is a bit silly, but, it is what it is. 

However - in ColdFusion 9 we now have a RAM based file system called the VFS (Virtual File System). I can use this as a temporary storage for the XML, and point CFFEED at it. Here is a trivial example:

<code>
&lt;cfset source = "http://feedproxy.google.com/RaymondCamdensColdfusionBlog"&gt;
&lt;cfhttp url="#source#"&gt;
&lt;cfset randFileName = "ram:///#createUUID()#.txt"&gt;
&lt;cfset fileWrite(randFileName, cfhttp.filecontent)&gt;

&lt;cffeed action="read" source="#randFileName#" query="feed"&gt;
&lt;cfdump var="#feed#" top="1"&gt;

&lt;cfset fileDelete(randFileName)&gt;
</code>

I begin by grabbing my RSS feed. I want to save it to the VFS and so I just pick a random file for the name. I then point CFFEED at it and convert the RSS into a query. At the end, I clean it up by deleting the file.