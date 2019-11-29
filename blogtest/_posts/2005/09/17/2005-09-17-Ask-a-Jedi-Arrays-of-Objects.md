---
layout: post
title: "Ask a Jedi: Arrays of Objects"
date: "2005-09-17T23:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/17/Ask-a-Jedi-Arrays-of-Objects
guid: 786
---

Brad sent me the following question today. (Hope he doesn't mind me posting it!)

<blockquote>
I have a question for you that I hope you can help me with.  I was wanting to create an array of objects by looping over a query.  What I'm not sure about is if I should instantiate the object outside of the loop or if I should do it inside the loop.  I'm not sure what would happen if I do it outside the loop...since I'd be inserting the same instance into the array, would all objects contain the value of the last loop iteration or would the array keep the correct object in it's index?
</blockquote>

I knew the answer, but I wanted to double check, so I quickly wrote up the following example.

<div class="code"><FONT COLOR=MAROON>&lt;cfset ob = createObject(<FONT COLOR=BLUE>"component"</FONT>, <FONT COLOR=BLUE>"test"</FONT>)&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfset data = arrayNew(<FONT COLOR=BLUE>1</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"x"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"10"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset ob.name = <FONT COLOR=BLUE>"Name #x#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset data[x] = ob&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfdump var=<FONT COLOR=BLUE>"#data#"</FONT>&gt;</FONT></div>

The component, test, is an empty component, and any component would work in this example. Inside the loop, we set a value directly to the component. This is <i>not</i> something I normally do, but it makes for a good example. We then (or we think we do) copy the object to the array. 

What happens when we dump it? We see an array of objects where <b>all</b> of the objects are named "Name 10". 

This is an example of how components, and other complex objects in ColdFusion, are passed by reference, not by copy. To say that a bit simpler, when we do:

&lt;cfset data[x] = ob&gt;

We actually create a reference from data[x] to the <b>original</b> component object we created. All ten indexes of the array all point to the exact same component. 

To answer the question, yes, you have to create a new instance of the object in the loop. In case you are curious, you can't use <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000456.htm">duplicate</a> to fix the issue. If you use duplicate on a component in CFMX 7, you get an error. If you use it on CFMX 6 (or 6.1), something worse happens. You don't get an error, but the result of the duplicate operation is a structure, not a component.