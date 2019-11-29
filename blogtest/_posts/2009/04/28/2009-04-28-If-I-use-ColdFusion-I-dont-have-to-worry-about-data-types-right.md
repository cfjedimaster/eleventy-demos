---
layout: post
title: "If I use ColdFusion, I don't have to worry about data types, right?"
date: "2009-04-28T14:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/28/If-I-use-ColdFusion-I-dont-have-to-worry-about-data-types-right
guid: 3332
---

One of the nicer things about ColdFusion is that it takes a simple approach to variable types. When it comes to the simple types (non-array, structs, etc), you don't have to worry about specifying the type of data ahead of time. So for example, this code runs just fine:

<code>
&lt;!--- Look, a number! ---&gt;
&lt;cfset x = 9&gt;
&lt;!--- oh oh, now its a string ---&gt;
&lt;cfset x = "foo"&gt;
&lt;!--- holy crap, now its a date even! ---&gt;
&lt;cfset x = now()&gt;
</code>

While I wouldn't recommend writing code like that, it certainly will run just fine in ColdFusion. It's actually kind of handy when it comes to 'temp' variable, like loop iterators and the such.
<!--more-->
So with ColdFusion being loose in terms of variable types, it is easy to forget that most of the rest of the programming world isn't so easy. Every now and then that come bite you in butt. Here is a great example. I recently fixed a bug in <a href="http://seeker.riaforge.org">Seeker</a> involving a hand-made query. The query was created using queryNew and had supplied the optional list of column types to tell ColdFusion what each column represented data wise. Unfortunately, after this change, the Score column began returning 0 for every match? Why? The values were all between one and zero while the column type was defined as integer. Consider this code block:

<code>
&lt;cfset numbers = [0.314159,0.921,0.000001,9.9]&gt;

&lt;cfset q = queryNew("col1,col2","integer,decimal")&gt;

&lt;cfloop index="n" array="#numbers#"&gt;
	&lt;cfset queryAddRow(q)&gt;
	&lt;cfset querySetCell(q, "col1", n)&gt;
	&lt;cfset querySetCell(q, "col2", n)&gt;
&lt;/cfloop&gt;

&lt;cfdump var="#q#"&gt;
</code>

I've got 3 numbers, all with decimals, and I copy them into a query where the first column is defined as integer and the second as decimal. When dumped, check out the first column totally changes the values:

<img src="https://static.raymondcamden.com/images//Picture 153.png" title="cfdump of code example above">

In the same week this happened, another user wrote in with a similar issue. She was inserting phone numbers into a query and had not specified column types. When you do that, ColdFusion makes a guess to the right column type. In her case, ColdFusion guessed wrong and treated phone numbers like numbers. There were some numbers with a 0 in front and they ended up having the 0 removed. Supplying the varchar type definition for the column took care of it. 

Oh, and how about a third example? Not exactly ColdFusion related, but while working on <a href="http://gameone.coldfusionjedi.com">GameOne</a>, I accidentally set the column type for Funds to a type that users easily reached. Ugh. Sometimes it takes a few hits to get it through the noggin, eh?