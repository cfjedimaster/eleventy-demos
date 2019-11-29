---
layout: post
title: "ColdFusion 8: New Looping Constructs"
date: "2007-06-05T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/05/ColdFusion-8-New-Looping-Constructs
guid: 2091
---

ColdFusion 8 adds a few cool new tricks to the venerable CFLOOP tag. This includes looping over files and and arrays. Let's take a look at file looping first.
<!--more-->
You have two ways to loop over a file. In both cases however you simply add the new file attribute to the cfloop tag. Consider this first example:

<code>
&lt;cfset filename = expandPath("./imageuploadform.cfm")&gt;

&lt;cfloop file="#filename#" index="line"&gt;
	&lt;cfoutput&gt;#htmlEditFormat(line)#&lt;br /&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

I supply a filename, and the index attribute will automatically be set to one line of the file. Note that I don't need to worry about file decimeters. ColdFusion handles that for me. Another <b>very</b> important tip - ColdFusion reads the file line by line. If you run this over a 200 meg file, ColdFusion doesn't have to read the entire file in - it just reads the portion it needs to. This is much better than using cffile to read the file and list functions to loop.

Another interesting variation on this is the characters attribute. The characters attribute lets you specify how many characters to read from the file at a time. If you have a file with a particular format, this can make it easier to get the data you need. Con sider this version:

<code>
&lt;cfloop file="#filename#" index="snip" characters="10"&gt;
	&lt;cfoutput&gt;#htmlEditFormat(snip)#&lt;br /&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

Unlike the first example - this one will display 10 characters from the file each iteration, until the file is completely read.

One thing you can't do - and I'm hoping they add this to a future release - is just ahead in a file. Imagine that 200 meg file I mentioned earlier. Now imagine it is a log file and you want to show the last 100 lines. It would be nice if we could "seek" into the file before looping.

So lastly - cfloop also adds an array attribute. I believe this has already been mentioned on my blog. Basically it lets you loop over an array:

<code>
&lt;cfset foo = [1,2,3,4,5,6,7,8,0]&gt;
&lt;cfloop array="#foo#" index="x"&gt;
	&lt;cfoutput&gt;#x#&lt;br&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

All handy stuff, and that frankly is one of the reasons I love ColdFusion 8. So many of the new features are just so darn handy.