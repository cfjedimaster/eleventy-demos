---
layout: post
title: "Using ColdFusion 9's new FileSeek"
date: "2009-08-21T16:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/21/Using-ColdFusion-9s-new-FileSeek
guid: 3500
---

Another new feature in ColdFusion 9 (and unfortunately not documented) is the new FileSeek ability. The basic idea of seeking in a file is jumping to an arbitrary position. This could be useful for a variety of reasons. For example, certain binary files may store information at the end of a file. Another example is getting the end of a long log file. I <a href="http://www.raymondcamden.com/index.cfm/2009/4/12/Using-ColdFusion-to-get-the-end-of-a-file">blogged</a> about this back in April using Java via ColdFusion. ColdFusion 9 makes this somewhat easier with the addition of FileSeek.
<!--more-->
As I said though, this is currently undocumented. Thanks to Rupesh for sending me the basics which I'll cut and paste right here:

<blockquote>
FileOpen(path, mode, charset, seekable) - If seekable is true, you will be able to call fileSeek() and fileSkipBytes() . returns file handle

FileSeek(fileObj, pos)

FileSkipBytes(fileObject, noOfBytesToSkip)
</blockquote>

Seems easy enough, right? Here is an example that mimics the Java code from my previous example. First, define the file and create a file object for it:

<code>
&lt;cfset theFile = "/Applications/ColdFusion9/logs/server.log"&gt;

&lt;cfset fileOb = fileOpen(theFile, "read", "utf-8", true)&gt;
</code>

Notice the new seekable argument there. Next, let's define a few variables:

<code>
&lt;!--- number of lines ---&gt;
&lt;cfset total = 10&gt;

&lt;cfset line = ""&gt;
</code>

Total is pretty obvious. The line variable will actually store my characters as I read it in. I should have called it buffer, or buffy, or maybe pinkpajamas. 

<code>
&lt;!--- go to the end of the file ---&gt;
&lt;cfset pos = fileOb.size-1&gt;
&lt;cfset fileSeek(fileOb, pos)&gt;
</code>

The next block of code uses the fileSeek. Notice that I define my position as the size of the file minus one. This will let me read a character in the code coming up. 

<code>
&lt;!--- go backwards until we get 10 chr(10) ---&gt;
&lt;cfloop condition="listLen(line,chr(10)) lte total && pos gt 0"&gt;
	&lt;cfset c = fileRead(fileOb, 1)&gt;
	&lt;cfset line &= c&gt;
	&lt;cfset pos--&gt;
	&lt;cfif pos gt 0&gt;
		&lt;cfset fileSeek(fileOb, pos)&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

So this CFML code is pretty much the exact same as the Java-based code. Get a character. Add it to the line. Move backwards, and loop until we hit the beginning of the file or 10 lines. ColdFusion will do this for us, but it is a good idea to close the file:

<code>
&lt;!--- close the file ---&gt;
&lt;cfset fileClose(fileOb)&gt;
</code>

Now we need to manipulate the string a bit. It is both reversed and has an additional character in it:

<code>
&lt;!--- will always have one additional char ---&gt;
&lt;cfset line = trim(mid(line, 1, len(line)-1))&gt;

&lt;!--- reverse it ---&gt;
&lt;cfset line = reverse(line)&gt;
</code>

And that's it! We now have a string with 10 lines from the end of the file. The complete template may be found below.

<code>
&lt;cfset theFile = "/Applications/ColdFusion9/logs/server.log"&gt;

&lt;cfset fileOb = fileOpen(theFile, "read", "utf-8", true)&gt;

&lt;!--- number of lines ---&gt;
&lt;cfset total = 10&gt;

&lt;cfset line = ""&gt;

&lt;!--- go to the end of the file ---&gt;
&lt;cfset pos = fileOb.size-1&gt;
&lt;cfset fileSeek(fileOb, pos)&gt;


&lt;!--- go backwards until we get 10 chr(10) ---&gt;
&lt;cfloop condition="listLen(line,chr(10)) lte total && pos gt 0"&gt;
	&lt;cfset c = fileRead(fileOb, 1)&gt;
	&lt;cfset line &= c&gt;
	&lt;cfset pos--&gt;
	&lt;cfif pos gt 0&gt;
		&lt;cfset fileSeek(fileOb, pos)&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;

&lt;!--- close the file ---&gt;
&lt;cfset fileClose(fileOb)&gt;

&lt;!--- will always have one additional char ---&gt;
&lt;cfset line = trim(mid(line, 1, len(line)-1))&gt;

&lt;!--- reverse it ---&gt;
&lt;cfset line = reverse(line)&gt;

&lt;cfoutput&gt;
&lt;pre&gt;
#line#
&lt;/pre&gt;
&lt;/cfoutput&gt;
</code>