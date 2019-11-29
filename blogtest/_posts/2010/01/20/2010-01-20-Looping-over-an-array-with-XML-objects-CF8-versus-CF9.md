---
layout: post
title: "Looping over an array with XML objects - CF8 versus CF9"
date: "2010-01-20T14:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/01/20/Looping-over-an-array-with-XML-objects-CF8-versus-CF9
guid: 3689
---

Here is an interesting little issue I ran into. Given the following simple XML (and I'm typing this on the fly so pardon any typos), imagine you want to loop over the people nodes:

<p>

<code>
&lt;root&gt;
&lt;people /&gt;
&lt;people /&gt;
&lt;people /&gt;
&lt;/root&gt;
</code>

<p>

ColdFusion allows you to treat the people nodes as an array. You can access the second people node by using xmlVar.people[2]. Most folks though will typically want to iterate over each person. Using CFLOOP and it's new array syntax, you might do it like so:

<p>

<code>
&lt;cfloop index="person" array="#people#"&gt;
do stuff
&lt;/cfloop&gt;
</code>

<p>

While this works perfectly well in ColdFusion 9, in ColdFusion 8 it fails. The person object is a Java object of the class org.apache.xerces.dom.DeferredElementNSImpl. Now I won't pretend to know how that differs exactly from ColdFusion 9, but the point is, you can't use it in the same way you can with ColdFusion 9.

<p>

Of course, the fix for ColdFusion 8 is trivial - change your cfloop to:

<p>

<code>
&lt;cfloop index="x" from="1" to="#arrayLen(people)#"&gt;
  &lt;cfset person = people[x]&gt;
</code>