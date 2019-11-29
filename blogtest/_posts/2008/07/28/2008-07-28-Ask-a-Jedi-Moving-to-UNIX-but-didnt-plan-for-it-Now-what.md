---
layout: post
title: "Ask a Jedi: Moving to UNIX, but didn't plan for it. Now what?"
date: "2008-07-28T21:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/28/Ask-a-Jedi-Moving-to-UNIX-but-didnt-plan-for-it-Now-what
guid: 2943
---

Sandeep asks:

<blockquote>
<p>
i have been doing my development on windows machine but now i decided to move to linux .. but when i was writing my code i did not think i would be moving to linux anytime so i was not very careful when i did my includes ... is there any tool that you know of can help me fix cf code... i know i can use dreamweaver replace in a particular folder but still it might be too time consuming.
</p>
</blockquote>

I can't think of a tool out there that will just 'magic wand' this away, but here are some things to consider:
<!--more-->
First, you probably want to lowercase all your file names except for your Application.cfc/cfm files. I assumed there was probably a way to do this at the command line, and there was, from Speaking Unix (<a href="http://www.ibm.com/developerworks/aix/library/au-speakingunix7.html">http://www.ibm.com/developerworks/aix/library/au-speakingunix7.html</a>):

<blockquote>
<p>
rename 'y/A-Z/a-z/' *
</p>
</blockquote>

I don't have a UNIX system handy right now so your mileage may very. (Mac OSX doesn't have rename as a command as is case insensitive for filenames.) You could easily do it in CFML with cfdirectory and cffile. The point is to get all your files (again, excepting the special Application.cfc/cfm file and onRequestEnd.cfm) into lowercase first. 

Now for the code. You actually have two 'areas' of code to worry about. One is the simple html, so for example, covering cases like so:

<code>
&lt;img src="Foo.jpg"&gt;
</code>

You could probably handle this with a URL Rewrite, but that's only hiding the problem.  

Your next area of concern is CFML. You have more to worry about than cfinclude. Anything that touches the file system would need to be updated, including fileExists, cffile, cfdirectory, etc. You could use the manual method for this - as you suggest with Dreamweaver, but it will be sluggish.

Lastly, you have the database side to worry about as well. Consider code that loads a preferred image. If you stored that image filename, then a Dreamweaver code search won't help. For example, it isn't immediately obvious that this can be a problem:

<code>
&lt;body background="#session.mybackground#"&gt;
</code>

As a rule of thumb, I've always tried to use lowercase files <i>everywhere</i> in my code. It just makes it easier to read I think.