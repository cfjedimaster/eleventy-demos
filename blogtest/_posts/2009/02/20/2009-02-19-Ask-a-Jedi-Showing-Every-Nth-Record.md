---
layout: post
title: "Ask a Jedi: Showing Every Nth Record"
date: "2009-02-20T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/02/20/Ask-a-Jedi-Showing-Every-Nth-Record
guid: 3246
---

<a href="http://www.revolutionwebdesign.com/blog/">Tony "I Suck at Math" Weeg</a> asked me this over IM and I thought it would be fun to share. (And I know Tony, so don't think I'm giving him too much crap - my math is pretty rusty as well!) Basically, he had a large query (cue that's what she said joke) and wanted to show every nth row. This can be done easily enough using a simple MOD operation. The MOD operation does division on two numbers and returns the remainder. So if you want to show every 5 rows, you want to know when: Current Row divided by 5 has a remainder of 0. Here is a quick example:
<!--more-->
<code>
&lt;cfset people = queryNew("name","varchar")&gt;
&lt;cfloop index="x" from="1" to="342"&gt;
	&lt;cfset queryAddRow(people)&gt;
	&lt;cfset querySetCell(people, "name", "Person #x#")&gt;
&lt;/cfloop&gt;

&lt;cfdump var="#people#" top="10"&gt;
</code>

This creates my fake query with 342 rows. I did a dump just to be sure it was that big. 

<img src="https://static.raymondcamden.com/images//Picture 140.png">

I made my 'every N' logic dynamic using a variable:

<code>
&lt;cfset nth = 6&gt;
&lt;cfloop index="x" from="1" to="#people.recordCount#"&gt;
	&lt;cfif x mod nth is 0&gt;
		&lt;cfoutput&gt;#people.name[x]#&lt;br/&gt;&lt;/cfoutput&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

And that's it. I've used code like this before with tables where you want to show N people per row. In general it is pretty easy, but you normally want to have a 'complete' last row. This involves recognizing where you ended and adding some blank cells to finish the table.

As an example:

<code>
&lt;table border="1"&gt;
	&lt;tr&gt;
	&lt;cfloop query="people"&gt;
		&lt;cfoutput&gt;&lt;td&gt;#name#&lt;/td&gt;&lt;/cfoutput&gt;
		&lt;cfif currentRow mod nth is 0&gt;
			&lt;/tr&gt;
			&lt;cfif currentRow neq recordCount&gt;
			&lt;tr&gt;
			&lt;/cfif&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
	&lt;!--- remainder? ---&gt;
	&lt;cfif people.recordCount mod nth neq 0&gt;
		&lt;cfset padding = nth - (people.recordCount mod nth)&gt;
		&lt;cfoutput&gt;#repeatString("&lt;td&gt;&nbsp;&lt;/td&gt;", padding)#&lt;/cfoutput&gt;
		&lt;/tr&gt;
	&lt;/cfif&gt;
&lt;/table&gt;
</code>

After each cell I see if I'm at the end of my row, and if so, add a closing tr. If I'm not totally done, start a new row. After the loop I see if I had a remainder and if so, padd the table with some empty cells and a closing tr.