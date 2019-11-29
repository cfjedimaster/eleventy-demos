---
layout: post
title: "Comparing different ways of writing out large amounts of data"
date: "2011-02-08T22:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/08/Comparing-different-ways-of-writing-out-large-amounts-of-data
guid: 4113
---

Jeff sent me an interesting question last Friday involving writing out large amounts of data to a text file in ColdFusion. He had to read in thousands of files and append them to a single file. He was curious about what he could do to speed up this process. I wasn't really sure what to suggest - outside of making sure he used cfsetting requesttimeout to give his script time to process, but he wrote back and said he had some success using Java to write out the file data. This led me to do a bit of digging myself. I know that the new file functions (added in ColdFusion 8) made use of higher performing code behind the scenes. So for example, if you used cffile to read in a multi gigabyte file, than ColdFusion has to store all that data in RAM. But if you make use of fileOpen and fileReadLine, you can suck in parts of the file at a time. Shoot - you can even use fileSeek (in ColdFusion 9) to jump ahead. All of this works very well, but is focused on the <i>read</i> side of the equation. How about writing? I whipped up a simple test to see differently I could write to a file and how differently the approaches would perform.
<!--more-->
<p>

I began my test script by ensuring it would have enough time to run:

<p>

<code>
&lt;cfsetting requesttimeout="999"&gt;
</code>

<p>

Next I output some whitespace junk. I'm going to be using cfflush and discovered that Chrome, like Internet Explorer, likes to get "enough" content before it renders anything.

<p>

<code>
&lt;cfoutput&gt;#repeatString(" ", 250)#&lt;/cfoutput&gt;&lt;cfflush&gt;
</code>

<p>

Here is my first test:

<p>

<code>
&lt;cfset string = repeatString(createUUID(), 10)&gt;
&lt;cfset theFile = expandPath("./data.txt")&gt;
&lt;cfoutput&gt;About to write to #theFile#&lt;/cfoutput&gt;
&lt;p&gt;
&lt;cfflush&gt;

&lt;cfset thisTick = getTickCount()&gt;
&lt;cfloop index="x" from="1" to="200000"&gt;
	&lt;cffile action="append" file="#theFile#" output="#string#"&gt;
	&lt;cfif x mod 1000 is 0&gt;
		&lt;cfoutput&gt;##&lt;/cfoutput&gt;
		&lt;cfflush&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
&lt;cfset finalTick = getTickCount() - thisTick&gt;

&lt;cfoutput&gt;
	&lt;p&gt;Took #finalTick# ms to write.
&lt;/cfoutput&gt;	
</code>

<p>

I created a string based on a UUID repeated 10 times. I set my file name and then loop from 1 to 200,000 using the append form of cffile to write data to the file. That little cfif condition in there is just a simple way for me to monitor the progress of my test. By outputting a hash mark every one thousand iterations I can get an idea of how quickly my test is running. I wrap the meat of this with a few getTickCounts() so I can time the process. 

<p>

<b>This test took 70,222 ms to run.</b>

<p>

Ok, so how about using the new(ish) file functions? Here's my next text.

<p>

<code>
&lt;cfset theFile = expandPath("./data2.txt")&gt;
&lt;cfoutput&gt;About to write to #theFile#&lt;/cfoutput&gt;
&lt;p&gt;
&lt;cfflush&gt;

&lt;cfset thisTick = getTickCount()&gt;
&lt;cfset fileOb = fileOpen(theFile, "append")&gt;
&lt;cfloop index="x" from="1" to="200000"&gt;
	&lt;cfset fileWriteLine(fileOb, string)&gt;
	&lt;cfif x mod 1000 is 0&gt;
		&lt;cfoutput&gt;##&lt;/cfoutput&gt;
		&lt;cfflush&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
&lt;cfset fileClose(fileOb)&gt;
&lt;cfset finalTick = getTickCount() - thisTick&gt;

&lt;cfoutput&gt;
	&lt;p&gt;Took #finalTick# ms to write.
&lt;/cfoutput&gt;	
</code>

<p>

I create a file object opened using append mode. I made use of fileWriteLine to append my text. Finally, I close the file object. So how did this perform?

<p>

<b>This test took 1,622 ms to run.</b>

<p>

Bit faster, eh? Then I tried something else. I thought - what would happen if I built up a large string and just wrote to the file system once. I knew that a normal string operation wouldn't work as string operations in general aren't very performant. I used a Java <a href="http://download.oracle.com/javase/1.5.0/docs/api/java/lang/StringBuilder.html">StringBuilder</a> instead.

<p>

<code>
&lt;cfset theFile = expandPath("./data3.txt")&gt;
&lt;cfoutput&gt;About to write to #theFile#&lt;/cfoutput&gt;
&lt;p&gt;
&lt;cfflush&gt;

&lt;cfset thisTick = getTickCount()&gt;
&lt;cfset s = createObject("java","java.lang.StringBuilder")&gt;
&lt;cfset newString = string & chr(13)&gt;
&lt;cfloop index="x" from="1" to="200000"&gt;
	&lt;cfset s.append(newString)&gt;
	&lt;cfif x mod 1000 is 0&gt;
		&lt;cfoutput&gt;##&lt;/cfoutput&gt;
		&lt;cfflush&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
&lt;cffile action="write" file="#theFile#" output="#s.toString()#"&gt;
&lt;cfset finalTick = getTickCount() - thisTick&gt;

&lt;cfoutput&gt;
	&lt;p&gt;Took #finalTick# ms to write.
&lt;/cfoutput&gt;	
</code>

<p>

<b>This test took 1,658 ms to run.</b>

<p>

Now <i>that's</i> pretty interesting. In every iteration of my test, the StringBuilder version was always very close to the fileWriteLine version. Always slower, but not far enough to really matter. The main difference though is that I've got one variable taking in a large amount of RAM. In theory, this could take <i>all</i> the RAM available to the JVM. (Keep in mind the JVM is <b>not</b> an area I'm strong in. This is where I typically send people to <a href="http://www.cfwhisperer.com/">Mike Brunt</a>. ;)

<p>

I'll include the entire test script below, but the tests verify what I expected. The newer file functions work much better for both reading <i>and</i> writing. Any comments?

<p>

<code>
&lt;cfsetting requesttimeout="999"&gt;
&lt;cfoutput&gt;#repeatString(" ", 250)#&lt;/cfoutput&gt;&lt;cfflush&gt;

&lt;cfset string = repeatString(createUUID(), 10)&gt;
&lt;cfset theFile = expandPath("./data.txt")&gt;
&lt;cfoutput&gt;About to write to #theFile#&lt;/cfoutput&gt;
&lt;p&gt;
&lt;cfflush&gt;

&lt;cfset thisTick = getTickCount()&gt;
&lt;cfloop index="x" from="1" to="200000"&gt;
	&lt;cffile action="append" file="#theFile#" output="#string#"&gt;
	&lt;cfif x mod 1000 is 0&gt;
		&lt;cfoutput&gt;##&lt;/cfoutput&gt;
		&lt;cfflush&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
&lt;cfset finalTick = getTickCount() - thisTick&gt;

&lt;cfoutput&gt;
	&lt;p&gt;Took #finalTick# ms to write.
&lt;/cfoutput&gt;	

&lt;hr&gt;
&lt;cfset theFile = expandPath("./data2.txt")&gt;
&lt;cfoutput&gt;About to write to #theFile#&lt;/cfoutput&gt;
&lt;p&gt;
&lt;cfflush&gt;

&lt;cfset thisTick = getTickCount()&gt;
&lt;cfset fileOb = fileOpen(theFile, "append")&gt;
&lt;cfloop index="x" from="1" to="200000"&gt;
	&lt;cfset fileWriteLine(fileOb, string)&gt;
	&lt;cfif x mod 1000 is 0&gt;
		&lt;cfoutput&gt;##&lt;/cfoutput&gt;
		&lt;cfflush&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
&lt;cfset fileClose(fileOb)&gt;
&lt;cfset finalTick = getTickCount() - thisTick&gt;

&lt;cfoutput&gt;
	&lt;p&gt;Took #finalTick# ms to write.
&lt;/cfoutput&gt;	

&lt;hr&gt;
&lt;cfset theFile = expandPath("./data3.txt")&gt;
&lt;cfoutput&gt;About to write to #theFile#&lt;/cfoutput&gt;
&lt;p&gt;
&lt;cfflush&gt;

&lt;cfset thisTick = getTickCount()&gt;
&lt;cfset s = createObject("java","java.lang.StringBuilder")&gt;
&lt;cfset newString = string & chr(13)&gt;
&lt;cfloop index="x" from="1" to="200000"&gt;
	&lt;cfset s.append(newString)&gt;
	&lt;cfif x mod 1000 is 0&gt;
		&lt;cfoutput&gt;##&lt;/cfoutput&gt;
		&lt;cfflush&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
&lt;cffile action="write" file="#theFile#" output="#s.toString()#"&gt;
&lt;cfset finalTick = getTickCount() - thisTick&gt;

&lt;cfoutput&gt;
	&lt;p&gt;Took #finalTick# ms to write.
&lt;/cfoutput&gt;	
</code>