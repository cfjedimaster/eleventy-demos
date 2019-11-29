---
layout: post
title: "ColdFusion 8: Working with PDFs - A Problem"
date: "2007-07-12T14:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/12/ColdFusion-8-Working-with-PDFs-A-Problem
guid: 2191
---

So you may have noticed I didn't post a new CFPDF post last night. Problem was - well, I ran into a few problems. I'd like to describe one of them now as I'm sure other people will run into this as well.

Consider the following simple code:

<code>
&lt;cfdocument format="pdf" name="mydocument"&gt;

	&lt;cfloop index="x" from="1" to="15"&gt;
	&lt;p&gt;
	lorem upsom doloras paris hilton is my hero loreum ipsom dsoio foom an to dht end of the world
	will anyone actually read this probably not but let me put more realtext in so it flows a bit nicely
		&lt;cfloop index="y" from="1" to="#randRange(1,9)#"&gt;This sentence will appear a random amount of time.&lt;/cfloop&gt;
	&lt;/p&gt;
	&lt;/cfloop&gt;

&lt;/cfdocument&gt;

			
&lt;cfcontent type="application/pdf" reset="true" variable="#mydocument#"&gt;
</code>

This code takes some random text and simply feeds it to a cfdocument tag. Nothing special, right? But if I decide to manipulate the PDF? I'll be covering page deleting in full later on, but for now, look at this slightly modified version:

<code>
&lt;cfdocument format="pdf" name="mydocument"&gt;

	&lt;cfloop index="x" from="1" to="15"&gt;
	&lt;p&gt;
	lorem upsom doloras paris hilton is my hero loreum ipsom dsoio foom an to dht end of the world
	will anyone actually read this probably not but let me put more realtext in so it flows a bit nicely
		&lt;cfloop index="y" from="1" to="#randRange(1,9)#"&gt;This sentence will appear a random amount of time.&lt;/cfloop&gt;
	&lt;/p&gt;
	&lt;/cfloop&gt;

&lt;/cfdocument&gt;


&lt;cfpdf action="deletepages" pages="1" source="mydocument" name="mydocument"&gt;
			
&lt;cfcontent type="application/pdf" reset="true" variable="#mydocument#"&gt;
</code>

This example simply takes the PDF, removes page one, and then serves it up again. But when you run this, you will get: 

<blockquote>
coldfusion.pdf.PDFDocWrapper is not a supported variable type. The variable is expected to contain binary data.
</blockquote>

So this kind of makes sense I guess. My initial variable was binary data. When I used CFPDF to manipulate it, ColdFusion converted it into a PDF variable (like images, PDFs are a native data type in ColdFusion), and when I tried to use it as binary data in cfcontent, it complained. Now I think it would be nice if cfcontent would give me a hand here and just deal with it, but luckily there is an easy work around - toBinary:

<code>
&lt;cfdocument format="pdf" name="mydocument"&gt;

	&lt;cfloop index="x" from="1" to="15"&gt;
	&lt;p&gt;
	lorem upsom doloras paris hilton is my hero loreum ipsom dsoio foom an to dht end of the world
	will anyone actually read this probably not but let me put more realtext in so it flows a bit nicely
		&lt;cfloop index="y" from="1" to="#randRange(1,9)#"&gt;This sentence will appear a random amount of time.&lt;/cfloop&gt;
	&lt;/p&gt;
	&lt;/cfloop&gt;

&lt;/cfdocument&gt;


&lt;cfpdf action="deletepages" pages=1 source="mydocument" name="mydocument"&gt;
			
&lt;cfcontent type="application/pdf" reset="true" variable="#toBinary(mydocument)#"&gt;
</code>

The only change in this last version was to wrap my mydocument variable in a toBinary call.

Make sense? Anyone else get tripped up by this?

<b>Edit</b> - I am ashamed to admit I forgot to thank the person who pointed this out to me - Greg Oberlag. This whole entry is based on what he taught me.