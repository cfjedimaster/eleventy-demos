---
layout: post
title: "Ask a Jedi: Getting all the link labels from a string in ColdFusion"
date: "2007-11-07T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/07/Ask-a-Jedi-Getting-all-the-link-labels-from-a-string-in-ColdFusion
guid: 2458
---

A reader asked me how they could use regex to find all the link labels in a string. Not the links - but the label for the link. It is relatively easy to grab all the matches for a regex in ColdFusion 8, consider the following code block:

<code>
&lt;cfsavecontent variable="s"&gt;
This is some text. It is true that &lt;a href="http://www.cnn.com"&gt;Harry Potter&lt;/a&gt; is a good
magician, but the real &lt;a href="http://www.raymondcamden.com"&gt;question&lt;/a&gt; is how he would stand up
against Godzilla. That is what I want to &lt;a href="http://www.adobe.com"&gt;see&lt;/a&gt; - a Harry Potter vs Godzilla
grudge match. Harry has his wand, Godzilla has his &lt;a href="http://www.cfsilence.com"&gt;breath&lt;/a&gt;, it would
be &lt;i&gt;so&lt;/i&gt; cool.
&lt;/cfsavecontent&gt;

&lt;cfset matches = reMatch("&lt;[aA].*?&gt;.*?&lt;/[aA]&gt;",s)&gt;
&lt;cfdump var="#matches#"&gt;
</code>

I create a string with a few links in it. I then use the new reMatch function to grab all the matches. My regex says - find all HTML links. It isn't exactly perfect, it won't match a closing A tag that has an extra space in it, but you get the picture. This results in a match of all the links:


<img src="https://static.raymondcamden.com/images/cfjedi/Picture 22.png">

But you will notice that the HTML links are still there. How can we get rid of them? I simply looped over the array and did a second pass:

<code>
&lt;cfset links = arrayNew(1)&gt;
&lt;cfloop index="a" array="#matches#"&gt;
	&lt;cfset arrayAppend(links, rereplace(a, "&lt;.*?&gt;","","all"))&gt;
&lt;/cfloop&gt;

&lt;cfdump var="#links#"&gt;
</code>

This gives you the following output:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 31.png">

p.s. Running on ColdFusion 7? Try the <a href="http://www.cflib.org/udf.cfm?ID=1027">reFindAll</a> UDF as a replacement to reMatch.