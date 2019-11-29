---
layout: post
title: "Ask a Jedi: Various Quickies..."
date: "2005-10-13T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/13/Ask-a-Jedi-Various-Quickies
guid: 848
---

Once again I'm going to try to cover a few Ask a Jedi questions at once. Here is the first one:

<blockquote>
I'm trying to set a "double dynamic" variable. It is currently:

&lt;cfset myXMLDoc.feed.newsletterpubs.file[#LoopCount#].description.XmlText  = "Hello"&gt;

However, the "newsletterpubs" portion is also dynamic (variable is "#ftp_select"). How can I incorporate 2 dynamic portions into this cfset statement?
</blockquote>

You already had half the solution. Bracket notation can be used as many times as you want. So to replace the newsletterpubs with a var, just use another bracket:

<code>
&lt;cfset myXMLDoc.feed[ftp_select].file[LoopCount].description.XmlText  = "Hello"&gt;
</code>

You will also notice I got rid of the # sign in loopCount, it isn't necessary. Next question:

<blockquote>
Can you do a article explaining how to use the application.cfc? I can't figure out how the request method works for the life of me...it'd be great if you could help me out!
</blockquote>

Funny you ask that - as I'm presenting on it at MAX next week. I'll be doing an hour long session on it, and Simon Horwith is doing a 90 minute workshop on it, so you will have two places to learn about the new feature. Kind of a non-answer I realize, sorry. Let's hit another one:

<blockquote>
How do I embed a PDF in a HTML document?
</blockquote>

I assume you may have missed it, but CFMX7 added support for PDF generation with the cfdocument tag. If you don't have CFMX7, there are other options as well. <a href="http://www.activepdf.com/">ActivePDF</a> has been around for quite some time. I've never used them, but they are an alternative. Another option is <a href="http://www.lowagie.com/iText/">iText</a>, a free Java-based PDF generator. I haven't used it either so I can't comment on how well it works.

Lastly, a BlogCFC question:

<blockquote>
Kudos on your BlogCFC code.  Maybe I missed something, but how are you adding pictures to your posts in BlogCFC?
</blockquote>

I'm not doing anything special. I'm just adding IMG html tags. I am looking into ways to make it easier, but it will be after the 4.0 release.