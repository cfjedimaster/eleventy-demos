---
layout: post
title: "Counting Word Instances in a String"
date: "2007-08-02T14:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/02/Counting-Word-Instances-in-a-String
guid: 2246
---

Yesterday in the IRC channel someone asked if there was a way to count the number of times each unique word appears in a string. While it was obvious that this could be done manually (see below), no one knew of a more elegant solution. Can anyone think of one? Here is the solution I used and it definitely falls into the "manual" (and probably slow) category.

First I made my string:

<code>
&lt;cfsavecontent variable="string"&gt;
This is a paragraph with some text in it. Certain words will be repeated, and other words
will not be repeated. The question is though, how much can I write before I begin to sound
like a complete and utter idiot. Let's call that the "Paris Point". At the Paris Point, any
further words sound like gibberish and are completely worthless. 
&lt;/cfsavecontent&gt;
</code>

I then used some regex to get an array of words:

<code>
&lt;cfset words = reMatch("[[:word:]]+", string)&gt;
</code>

Next I created a structure:

<code>
&lt;cfset wordCount = structNew()&gt;
</code>

And then looped over the array and inserted the words into the structure:

<code>
&lt;cfloop index="word" array="#words#"&gt;
	&lt;cfif structKeyExists(wordCount, word)&gt;
		&lt;cfset wordCount[word]++&gt;
	&lt;cfelse&gt;
		&lt;cfset wordCount[word] = 1&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

Note that this will be inherently case-insenstive, which I think is a good thing. At this point we are done, but I added some display code as well:

<code>
&lt;cfset sorted = structSort(wordCount, "numeric", "desc")&gt;

&lt;table border="1" width="400"&gt;
&lt;tr&gt;
	&lt;th width="50%"&gt;Word&lt;/th&gt;
	&lt;th&gt;Count&lt;/th&gt;
&lt;/tr&gt;

&lt;cfloop index="word" array="#sorted#"&gt;
	&lt;cfoutput&gt;
	&lt;tr&gt;
		&lt;td&gt;#word#&lt;/td&gt;
		&lt;td&gt;#wordCount[word]#&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>