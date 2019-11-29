---
layout: post
title: "Ask a Jedi: Handling print format when using custom tags"
date: "2007-12-22T08:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/22/Ask-a-Jedi-Handling-print-format-when-using-custom-tags
guid: 2557
---

Devon asks:

<blockquote>
<p>
I am using custom tags to do my layout and thought this would be great for creating printable pages easily by being
able to just include a different stylesheet if boolean print is true. Then I thought after reading the reporting chapter in WACK 1 why not cfdocument ...well because it moans about unclosed tags and I kinda saw that coming once I opened
my 1st if statement.

So I'll sit this evening and give Ch 25 from WACK 2 a
proper read but I was wondering if it would be possible to print out the content of a custom layout tag using cfdocument and maybe a content variable?
</p>
</blockquote>
<!--more-->
So first off - let's make sure we understand the issue Devon found. You cannot open a cfdocument block inside a cfif. What he tried was probably something like this:

<b>layout.cfm</b>
<code>
&lt;cfif thisTag.executionMode is "start"&gt;
  &lt;cfif structKeyExists(url, "print")&gt;
    &lt;cfdocument format="pdf"&gt;
  &lt;/cfif&gt;
&lt;cfelse&gt;
  &lt;cfif structKeyExists(url, "print")&gt;
    &lt;/cfdocument&gt;
  &lt;/cfif&gt;
&lt;/cfif&gt;
</code>

If you try to run this, you will get an immediate error. So what to do? 

One option is to not worry about changing the custom tag. This is a perfect example of when onRequest would be useful. The onRequest method of Application.cfc would run after the entire request is done, and before anything is sent to the user. You could easily when wrap the output in cfdocument tags. But don't forget that onRequest has the bad side effect of breaking flash remoting/web service calls unless you hack around it. 

You can get it to work inside a custom tag - but it feels a bit hackish to me. Here is an example. First, let's start with a super simple layout custom tag:

<b>layout.cfm</b>
<code>
&lt;cfif thisTag.executionMode is "start"&gt;
	&lt;h2&gt;Header&lt;/h2&gt;
&lt;cfelse&gt;
	&lt;p&gt;
	Footer
	&lt;/p&gt;
&lt;/cfif&gt;
</code>

And now let's look at a modified version:

<b>layout_withprint.cfm</b>
<code>
&lt;cfif thisTag.executionMode is "start"&gt;
	&lt;cfsavecontent variable="header"&gt;
	&lt;h2&gt;Header&lt;/h2&gt;
	&lt;/cfsavecontent&gt;
&lt;cfelse&gt;
	&lt;cfset content = thisTag.generatedContent&gt;
	&lt;cfset thisTag.generatedContent = ""&gt;

	&lt;cfsavecontent variable="footer"&gt;
	&lt;p&gt;
	Footer
	&lt;/p&gt;
	&lt;/cfsavecontent&gt;
	
	&lt;cfif not structKeyExists(url, "print")&gt;
		&lt;cfoutput&gt;
		#header#
		#content#
		#footer#
		&lt;/cfoutput&gt;
	&lt;cfelse&gt;
		&lt;cfheader name="Content-Disposition" value="inline; filename=print.pdf"&gt;
		&lt;cfdocument format="pdf"&gt;
		&lt;cfoutput&gt;
		#header#
		#content#
		#footer#
		&lt;/cfoutput&gt;
		&lt;/cfdocument&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;
</code>

So what did I change? First look at the top half of the code. Notice I no longer output the header. Instead I save it to a variable. In the next part of the custom tag - I first take everything that happened between the first and ending tags, which exists in thisTag.generatedContent, and save it to a variable. I then erase the thisTag value. This will essentially save and remove any output that occurred. I then create a variable for the footer. Lastly, I do one of two things. I check to see if a url.print variable exists. If it doesn't, I simply output my values. Note the header, which was made in the beginning of the custom tag, still exists, even though technically I'm in the second call of the tag now. If url.print does exist, I output the same thing but wrap it with cfdocument tags. 

I think perhaps this could be a bit nicer, but hopefully it gives you some ideas.