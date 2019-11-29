---
layout: post
title: "Why you will never read my blog again..."
date: "2007-04-19T11:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/19/Why-you-will-never-read-my-blog-again
guid: 1968
---

I was cleaning up my "testingzone" folder today when I ran across some pretty darn old code. (My testingzone folder is where I put all my random tests. My thinking was that it would keep the rest of my web root clean. Of course now my testingzone folder is almost unreadable.) This application was created in 1998, back when IE was the best browser (well in my opinion Netscape had really begun to slip) and ColdFusion was still at version 4.

Oh - and its back when I thought code in all caps was really cool and actually readable.
<!--more-->
So first check out the demo:

<a href="http://ray.camdenfamily.com/demos/drconfusion/">Dr Confusion</a>

Check out the browser requirements. Check out the "Team Allaire". Talk about ancient history! The application works on a very simple keyword basis. I set it up so that you would create a group of keywords (dogs,dog,canine,etc) and a list of responses. When a match to a keyword was made, a random response is picked.

Back when I wrote this there was no XML parsing so I made the dubious choice of using line breaks for my data structure. Here is a snippet from the data file:

<code>
paranoia
paranoid

You're not paranoid if they really &lt;I&gt;are&lt;/I&gt; out to get you.
Who is that behind you?

fear
scared
afraid

You must learn to overcome your fears.
Fear is natural, we must learn to accept our fears if we are to truly enjoy life.
Fear is a four letter word.

you

Let's talk about you, not me.
You would find my life very boring, let's talk about you instead.
Who is the doctor here?
This conversation is about you, not me.
</code>

Notice how the logic is - list of keywords, blank line, list of responses. Not what I'd consider best practice. Back in CF4 I believe they had INI file functions. I would have used that if I had thought it out better. 

Now for some code. Here is what I wrote to parse in the data file:

<code>
&lt;!--- Static Variables ---&gt;
&lt;CFSET ELIZADAT = "eliza.dat"&gt;
&lt;CFSET OVERRIDE = TRUE&gt;

&lt;CFIF NOT IsDefined("Application.KEYWORDS") OR OVERRIDE&gt;
	&lt;CFFILE ACTION="Read" FILE="#ExpandPath(ELIZADAT)#" VARIABLE="BUFFER"&gt;
	&lt;CFSET Application.KEYWORDS = ArrayNew(1)&gt;
	&lt;CFSET Application.RESPONSES = ArrayNew(1)&gt;
	&lt;CFSET Application.NULLRESPONSES = ""&gt;
	&lt;CFSET Application.NOTHINGRESPONSES = ""&gt;
	
	&lt;CFSET NL = Chr(10)&gt;&lt;CFSET NL2 = Chr(13)&gt;
	&lt;CFSET NEWLINE = NL2 & NL&gt;
	&lt;CFSET DOUBLE_NEWLINE = NEWLINE & NEWLINE&gt;
	&lt;CFSET BUFFER = Replace(BUFFER,DOUBLE_NEWLINE,"@","ALL")&gt;
	&lt;CFSET ONKEY = TRUE&gt;
	&lt;CFSET LASTKEY = ""&gt;
	&lt;CFSET CURRX = 0&gt;
	&lt;CFLOOP INDEX=CURRLINE LIST="#BUFFER#" DELIMITERS="@"&gt;
		&lt;CFSET CURRLINE = Replace(CURRLINE,",","&COMMA;","ALL")&gt;
		&lt;CFSET CURRLINE = Replace(CURRLINE,NL,",","ALL")&gt;
		&lt;CFIF ONKEY&gt;
			&lt;CFSET LEN = IncrementValue(ArrayLen(Application.KEYWORDS))&gt;
			&lt;CFSET Application.KEYWORDS[LEN] = CURRLINE&gt;
			&lt;CFSET CURRX = CURRX + 1&gt;
			&lt;CFIF CURRLINE IS "NULL"&gt;&lt;CFSET Application.NULLX = CURRX&gt;&lt;/CFIF&gt;
			&lt;CFIF CURRLINE IS "NOTHING"&gt;&lt;CFSET Application.NOTHINGX = CURRX&gt;&lt;/CFIF&gt;
		&lt;CFELSE&gt;
			&lt;CFSET LEN = IncrementValue(ArrayLen(Application.RESPONSES))&gt;
			&lt;CFSET Application.RESPONSES[LEN] = CURRLINE&gt;
		&lt;/CFIF&gt;
		&lt;CFSET ONKEY = NOT ONKEY&gt;
	&lt;/CFLOOP&gt;
&lt;/CFIF&gt;
</code>

Wow - I think my eyes are actually bleeding. I'm not sure why I left override on (it's off now). I just noticed - I used caps for tags, normal case for functions. I seriously must have been on crack back then.