---
layout: post
title: "Ask a Jedi: Finding an value in an array of structures"
date: "2007-09-23T13:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/23/Ask-a-Jedi-Finding-an-value-in-an-array-of-structures
guid: 2367
---

David asked an interesting question about searching an array of structures:

<blockquote>
I've got a challenge for you.  I have a single dimension array, and in each dimension is a structure.  I need to find the array index of a value within the structure.  So if I need to find the index where name is "pam", I would do the following:
</blockquote>

<code>
&lt;cfset myArray = arrayNew(1)&gt;
&lt;cfset myArray[1]['name'] = "david"&gt;
&lt;cfset myArray[1]['age'] = '35'&gt;
&lt;cfset myArray[2]['name'] = "bob"&gt;
&lt;cfset myArray[2]['age'] = '44'&gt;
&lt;cfset myArray[3]['name'] = "pam"&gt;
&lt;cfset myArray[3]['age'] = '42'&gt;

&lt;cfloop from="1" to="#arrayLen(myArray)#" index="i"&gt;
  &lt;cfif structFind(myArray[i],'name') IS 'pam'&gt;
    &lt;cfset dimensionNumber = i&gt;
  &lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

<blockquote>
I was wondering if there was a way to use java's indexOf
function (myArray.indexOf('pam')) to achieve the same thing.  I've haven't found the correct syntax but I thought that since indexOf only works on single dimension arrays, perhaps there was a way.
</blockquote>

Actually, there is a simple solution if you don't mind modifying your data a tiny bit. ColdFusion comes with a <a href="http://www.cfquickdocs.com/?getDoc=StructFindValue">structFindValue()</a> function. This function will search through a structure, no matter how complex, and find matches based on value. (There is a <a href="http://www.cfquickdocs.com/?getDoc=StructFindKey">structFindKey</a> as well.)

The problem though is that David's data is an array at the top level. Luckily though we can change this real quick:

<code>
&lt;cfset s = structNew()&gt;
&lt;cfset s.myArray = myArray&gt;
</code>

Once we have a structure, we can then just search it:

<code>
&lt;cfset match = structFindValue(s, "pam", "all")&gt;
&lt;cfdump var="#match#"&gt;
</code>

Match will contain all the possible matches where the value is name.

<img src="https://static.raymondcamden.com/images//Picture 12.png">

There is one problem though. This function will find <b>all</b> (or one) match based on the value. David wanted to search just names. If you look at the result above though you will see that it does contain the key. All in all though - David's original solution is quicker and probably even simpler, if you know the exact path where you want to search. (Although I wouldn't use structFind. See <a href="http://www.coldfusionjedi.com/index.cfm/2007/9/20/A-use-for-structFind">this post</a> for a discussion why.)

As an interesting aside - don't forget that the Variables scope is a struct as well. I didn't have to copy myArray to a struct, I could have done this as well:

<code>
&lt;cfset match = structFindValue(variables, "pam", "all")&gt;
&lt;cfdump var="#match#"&gt;
</code>

You could, in theory, use this to search all your variables for a particular value. I'm not quite sure why you would do this - but it's cool nonetheless.