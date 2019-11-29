---
layout: post
title: "UDF to crop and highlight a block of text"
date: "2009-12-23T16:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/23/UDF-to-crop-and-highlight-a-block-of-text
guid: 3663
---

Here is a little UDF I worked on this morning. I've had code like this in BlogCFC for a while, but I needed it in a UDF for my Picard project so I just whipped it out. The basic idea is: 

You have a block of text of arbitrary text.<br/>
You had searched for something and that something is probably in the text. (I say probably because the search may have matched on another part of the content in question, like the title.)<br/>
You want to highlight the match in the content.<br/>
You also want to crop the content to X characters long, and <b>if</b> a match was found, center the X characters around the first match.<br/>

Make sense? So given a block of text, like the lyrics to Lady Gaga's "Poker Face" (don't ask), I can find/highlight the word poker like so:

<code>
#highlightAndCrop(text,"poker",250,"&lt;b&gt;&lt;/b&gt;")#
</code>

Where text is a variable containing the lyrics, poker is the word to highlight, 250 is the size of the result (which is a bit fuzzy, will explain why in a bit), and the final argument is the "wrap" to use around the result. Here is what the UDF will return:

<blockquote>
... oh, oh, ohhhh, oh-oh-e-oh-oh-oh,<br/>
I'll get him hot, show him what I've got<br/>
<br/> 
Can't read my,<br/>
Can't read my<br/>
No he can't read my <b>poker</b> face<br/>
(she's got me like nobody)<br/>
Can't read my<br/>
Can't read my<br/>
No he can't read my <b>poker</b> face<br/>
(she's got me like nobody)<br/>
<br/> 
P-p-p...<br/>
</blockquote>

So you get the basic idea. Here is the UDF (as it stands now, but there are parts of it I'd like to improve):

<code>
&lt;cffunction name="highlightAndCrop" access="public" output="false" hint="Given an arbitrary string and a search term, find it, and return a 'cropped' set of text around the match."&gt;
	&lt;cfargument name="string" type="string" required="true" hint="Main blob of text"&gt;
	&lt;cfargument name="term" type="string" required="true" hint="Keyword to look for."&gt;
	&lt;cfargument name="size" type="numeric" required="false" hint="Size of result string. Defaults to total size of string. Note this is a bit fuzzy - we split it in two and return that amount before and after the match. The size of term and wrap will therefore impact total string length."&gt;
	&lt;cfargument name="wrap" type="string" required="false" default="&lt;b&gt;&lt;/b&gt;" hint="HTML to wrap the match. MUST be one pair of HTML tags."&gt;

	&lt;cfset var excerpt = ""&gt;

	&lt;!--- clean the string ---&gt;
	&lt;cfset arguments.string = trim(rereplace(arguments.string, "&lt;.*?&gt;", "", "all"))&gt;

	&lt;!--- pad is half our total ---&gt;
	&lt;cfif not structKeyExists(arguments, "size")&gt;
		&lt;cfset arguments.size = len(arguments.string)&gt;
	&lt;/cfif&gt;
	&lt;cfset var pad = ceiling(arguments.size/2)&gt;

	&lt;cfset var match = findNoCase(arguments.term, arguments.string)&gt;
	&lt;cfif match lte pad&gt;
		&lt;cfset match = 1&gt;
	&lt;/cfif&gt;
	&lt;cfset var end = match + len(arguments.term) + arguments.size&gt;

	&lt;!--- now create the main string around the match ---&gt;
	&lt;cfif len(arguments.string) gt arguments.size&gt;
		&lt;cfif match gt 1&gt;
			&lt;cfset excerpt = "..." & mid(arguments.string, match-pad, end-match)&gt;
		&lt;cfelse&gt;
			&lt;cfset excerpt = left(arguments.string,end)&gt;
		&lt;/cfif&gt;
		&lt;cfif len(arguments.string) gt end&gt;
			&lt;cfset excerpt = excerpt & "..."&gt;
		&lt;/cfif&gt;
	&lt;cfelse&gt;
		&lt;cfset excerpt = arguments.string&gt;
	&lt;/cfif&gt;

	&lt;!--- split up my wrap - I bet this can be done better... ---&gt;
	&lt;cfset var endInitialTag = find("&gt;",arguments.wrap)&gt;
	&lt;cfset var beginTag = left(arguments.wrap, endInitialTag)&gt;
	&lt;cfset var endTag = mid(arguments.wrap, endInitialTag+1, len(arguments.wrap))&gt;

	&lt;cfset excerpt = reReplaceNoCase(excerpt, "(#arguments.term#)", "#beginTag#\1#endTag#","all")&gt;

	&lt;cfreturn excerpt&gt;
&lt;/cffunction&gt;
</code>

For the most part this should make sense. I attempt to find the term within the string and use that as a base to create an excerpt. I handle cases where the match isn't found and I also handle cases where the total string is smaller than the crop. Note that the wrap HTML you include will have an impact on the total length of the string, but that shouldn't matter. 

The main part I don't like is the wrap portion. It only supports one set of tags. I may split this into two arguments, a beginWrap and endWrap. For now though it suits my purposes.

p.s. This UDF is ColdFusion 9 <i>only</i> because of the var statements intermingled within the UDF. To use this in earlier versions, simply move the var statements to the beginning of the UDF.