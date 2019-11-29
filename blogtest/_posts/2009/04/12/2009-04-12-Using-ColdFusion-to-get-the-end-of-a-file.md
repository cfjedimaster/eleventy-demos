---
layout: post
title: "Using ColdFusion to get the end of a file"
date: "2009-04-12T19:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/12/Using-ColdFusion-to-get-the-end-of-a-file
guid: 3313
---

A week or so ago I wrote a blog entry on converting ColdFusion logs to RSS feeds (<a href="http://www.raymondcamden.com/index.cfm/2009/3/28/ColdFusion-Logs-to-RSS-with-a-quick-sidetrack-into-zombies">ColdFusion Logs to RSS</a>). In the article I converted lines of a log file into an RSS feed. I mentioned that it was a bit silly to convert the beginning of a log file into RSS since new data is added to the end of a file. How can we grab the end of a file?
<!--more-->
One way would be to simply read in the entire file and just create a new array from the last 10 (or whatever) lines. Consider:

<code>
&lt;cfset l = "/Users/ray/Desktop/cfserver.log.1"&gt;

&lt;cfset lines = []&gt;
&lt;cfloop index="l" file="#l#"&gt;
	&lt;cfset arrayAppend(lines,l)&gt;
&lt;/cfloop&gt;
&lt;cfset tail = []&gt;
&lt;cfloop index="x" from="#arrayLen(lines)#" to="#max(arrayLen(lines)-10+1,1)#" step="-1"&gt;
	&lt;cfset arrayPrepend(tail, lines[x])&gt;
&lt;/cfloop&gt;
&lt;cfdump var="#tail#"&gt;
</code>

I begin by creating a variable, l, that points to my file. Next, I use a loop to read ine ach line of the file. This is new syntax that was added to ColdFusion 8. Notice I don't have to worry about end of line markers or anything like that. It just plain works.

Once done, I create a new array, tail, and populate it by reading backwards from the larger array. When done you get a nice array of lines representing the end of the file.

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 230.png">

The file I used was a bit large, 13 megs, so the operation takes a few seconds to run. Could we do it quicker? In the dusty, foggy part of my brain I remember using some Java about 10 years ago to read in the file backwards. I did some digging in the API docs and figured out that I probably needed <a href="http://java.sun.com/j2se/1.5.0/docs/api/java/io/RandomAccessFile.html">RandomAccessFile</a>. It lets you seek to any position in a file and read in data. Using that, I wrote up a simple UDF that seeks, and then steps back one character a time. This is not very safe - I should probably try/catch the read, but it seemed to work well enough.

<code>
&lt;cfscript&gt;
function tailFile(filename) {
	var line = "";
	var lines = "";
	var theFile = createObject("java","java.io.File").init(filename);
	var raFile = createObject("java","java.io.RandomAccessFile").init(theFile,"r");
	var pos = theFile.length();
	var c = "";
	var total = 10;
	
	if(arrayLen(arguments) gte 2) total = arguments[2];
	raFile.seek(pos-1);

	while( (listLen(line,chr(10)) &lt;= total) && pos &gt; -1) {
		c = raFile.read();
		//if(c != -1) writeOutput("#c#=" & chr(c) & "&lt;br/&gt;");
		if(c != -1) line &= chr(c);
		raFile.seek(pos--);	
	}

	line = reverse(line);
	lines = listToArray(line, chr(10));
	arrayDeleteAt(lines,1);
	return lines;
}
&lt;/cfscript&gt;

&lt;cfset l = "/Users/ray/Desktop/cfserver.log.1"&gt;
&lt;cfdump var="#tailFile(l)#"&gt;
</code>

What was interesting was the speed comparison. Using cftimer, I checked them both. Check out the results:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 322.png">

Pretty significant difference there. (And yes, that's <a href="http://coldfire.riaforge.org">ColdFire</a> in action there.)