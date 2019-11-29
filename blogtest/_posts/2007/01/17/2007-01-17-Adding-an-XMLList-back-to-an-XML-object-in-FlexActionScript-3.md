---
layout: post
title: "Adding an XMLList back to an XML object in Flex/ActionScript 3"
date: "2007-01-17T13:01:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2007/01/17/Adding-an-XMLList-back-to-an-XML-object-in-FlexActionScript-3
guid: 1773
---

ActionScript 3 (and if this was in 2, please correct me) really makes working with XML easy. However, yesterday I ran into a problem that I couldn't find the answer to. It wasn't in the (extremely excellent) ActionScript 3.0 Cookbook nor was it in the docs. Let me back up a bit and talk about what an XMLList is. Consider XML that looks like so:

<code>
&lt;root&gt;
  &lt;kid&gt;Jacob&lt;/kid&gt;
  &lt;kid&gt;Lynn&lt;/kid&gt;
  &lt;kid&gt;Noah&lt;/kid&gt;
  &lt;foo&gt;1&lt;/foo&gt;
  &lt;moo&gt;2&lt;/moo&gt;
&lt;/root&gt;
</code>

While foo and moo are typical nodes, you can consider kid to be an xmlList. To read this XML list and convert into into an array, you could do this:

<code>
for each(var favoriteNode:XML in prefsXML.favorites) {
 	if(favoriteNode.toString() != '') favorites[favorites.length] = favoriteNode.toString();
}
</code>

Where prefsXML is an XML object, prefsXML.favorites was the repeating node, and favorites was a simple array.

So this reads in the data easily enough. What I couldn't figure out was how to write back to the prefsXML object. I first tried this:

<code>
prefsXML.favorites = favorites;
</code>

But this generated XML that looked like so:

<code>
&lt;favorites&gt;1,2,3&lt;/favorites&gt;
</code>

Turns out the solution wasn't too complex. Ted Patrick explained it to me (although to be fair, he had to think for a second as well :) like so:

<code>
for(i=0;i &lt; favorites.length; i++) {
	prefsXML.favorites[i] = favorites[i];
}
</code>

Pretty obvious once you look at it.