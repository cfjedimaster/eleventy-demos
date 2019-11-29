---
layout: post
title: "Ask a Jedi: Creating a list of product options"
date: "2008-08-20T08:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/20/Ask-a-Jedi-Creating-a-list-of-product-options
guid: 2979
---

Andrew asks:

<blockquote>
<p>
I have an application im programming and am stuck on this one section.   I have system for product options. i let the user create different options like this:<br/>
Color:green,red,brown<br/>
Size:S.M,L,XL,XXL
</p>

<p>
Now I'm able to read each as a list and loop through to get the options and save each to database.  I want to now go
ahead and create a list of all possible combinations.<br/>
s,green<br/>
m,green<br/>
l,geen<br/>
</p>

<p>
You get the idea. Now each has an ID number so I could use combo numbers like:<br/>
1,2<br/>
1,3<br/>
1,4<br/>
</p>

<p>
Have any how this could be done in coldfusion? I have tried arrays and havent got a solution yet.
</p>
</blockquote>
<!--more-->
There are probably multiple ways to skin this cat, but lets take a simple approach. As long as we know for sure what our options are, we can simply do a loop with a loop. Consider the following simple code:

<code>
&lt;cfset colorList = "green,red,brown,blue,yellow,purple,white"&gt;
&lt;cfset sizeList = "S,M,L,Xl,XXL,XXXL"&gt;

&lt;cfset comboList = ""&gt;
&lt;cfloop index="c" list="#colorList#"&gt;
	&lt;cfloop index="s" list="#sizeList#"&gt;
		&lt;cfset comboList = listAppend(comboList, c & " " & s)&gt;
	&lt;/cfloop&gt;
&lt;/cfloop&gt;

&lt;cfdump var="#listToArray(comboList)#"&gt;
</code>

This code simply loops over the color list and the size list. For every instance of the color list we loop over the complete size list. I store the result in a list and just dump the value at the end. You can see how it looks below.

<img src="https://static.raymondcamden.com/images/Picture 117.png" align="left">

If your color and sizes are from database tables, then I could have stored the IDs values as well. You could imagine storing X,Y as the value, and on display, simply converting each primary key to their proper value. 

As long as you know the combinations you support, this is probably the best solution (and since I said that, someone is going to prove me wrong!). If you have a dynamic set of combinations, then then the logic gets more complex. 
<br clear="left">