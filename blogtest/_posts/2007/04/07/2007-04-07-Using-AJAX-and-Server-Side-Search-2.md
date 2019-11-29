---
layout: post
title: "Using AJAX and Server Side Search (2)"
date: "2007-04-07T15:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/07/Using-AJAX-and-Server-Side-Search-2
guid: 1948
---

This morning I <a href="http://ray.camdenfamily.com/index.cfm/2007/4/7/Using-AJAX-and-Server-Side-Search">posted</a> a quick example of using AJAX with a server side search. I mentioned that one of the reasons to do so would be to employ more powerful searching technologies, like Verity. So I've put my money where my mouth is (money, is someone getting money?) and built a quick demo.
<!--more-->
To see this new version in action, go here:

<a href="http://ray.camdenfamily.com/demos/sprysearch/index2.cfm">http://ray.camdenfamily.com/demos/sprysearch/index2.cfm</a>

I made two changes here. First - the back is using Verity. I won't bother showing the code for that as all I did was make a collection of my blog entries (as of this morning) and provided a quick search interface to it. Right off the bat this gives me all the power of Verity from my search interface. I can search for "coldfusion and lost" and Verity will automatically handle the AND.

I also made use of the Suggestions feature of Verity. This asks Verity to provide suggestions for better searches. To return the suggestion, I modified my XML result. My earlier result looked like so:

<code>
&lt;results&gt;
 &lt;result&gt; stuff &lt;/result&gt;
 &lt;result&gt; more stuff &lt;/result&gt;
&lt;/results&gt;
</code>

I took the suggestion result and added it to my XML:

<code>
&lt;results suggestion="search for this instead"&gt;
 &lt;result&gt; stuff &lt;/result&gt;
 &lt;result&gt; more stuff &lt;/result&gt;
&lt;/results&gt;
</code>

So how then do I use this in Spry? Spry will take your XML and turn it into a nice dataset. But I need the XML. If you remember from the last example, I had a function running when the data loaded. I added some new code to this function:

<code>
//Look for the suggestion
var xmldom = dataSet.getDocument();
//convert to simple b
var xmlob = Spry.XML.documentToObject(xmldom);
//get suggestion
var suggestion = xmlob.results["@suggestion"];
if(total == 0 && suggestion != $("searchterms").value) {
	results.innerHTML += "&lt;br /&gt;Try searching for " + suggestion;
}
</code>

First I get the XML Document from the dataset. Next I convert this into an object. The documentToObject function is a Spry utility that makes it easier to work with XML data. It turns into a simple object that is much easier to work with, as you can see where I grab the suggestion attribute. I then do a quick sanity check - did I get no results and is the suggestion actually different? If both are true, then I print out the suggestion.

Be sure to view source on the demo for the full code. One quick note - Verity will throw an error if you don't pass in a nice search string. There is a nice UDF, <a href="http://www.cflib.org/udf.cfm?id=760">verityClean</a>, at CFLib that would have taken care of this. If you use Verity, be sure you use this function, or something like it.