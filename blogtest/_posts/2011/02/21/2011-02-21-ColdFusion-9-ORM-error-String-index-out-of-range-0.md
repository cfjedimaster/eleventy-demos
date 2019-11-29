---
layout: post
title: "ColdFusion 9 ORM error: String index out of range: 0"
date: "2011-02-21T22:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/21/ColdFusion-9-ORM-error-String-index-out-of-range-0
guid: 4132
---

I just ran into an interesting little issue with my ORM-based ColdFusion 9 site and the explanation was completely surprising to me. I figured I better blog it as I'll probably forget in 3 weeks and Google it to find the answer. The issue cropped up after I had just added some content (a panel) that was saved into a parent object (a page). After the panel was saved and I went to a script that worked with the page object, I began to get this error:
<!--more-->
<p>

<blockquote>
Message: String index out of range: 0<br/>
Type: java.lang.StringIndexOutOfBoundsException
</blockquote>

<p>

My first thought was some kind of simple string error. Perhaps I was doing a left() on a value I assumed had a certain number of characters and for whatever reason the field was blank. However, I narrowed it down to a bit of code that looked like this:

<p>

<code>
&lt;cfset panels = page.getPanels()&gt;
&lt;cfloop index="p" array="#panels#"&gt;
  &lt;cfoutput&gt;#p.getName()#&lt;br/&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

<p>

At first I thought - perhaps one of the objects in the array was null. But then the error would have probably been a NPE. Then to make it weirder, when I changed to simply dumping my panels, I still got the error. Then it got even <b>more</b> weird. I discovered I couldn't even do an arrayLen() on the array. Ok, so what the heck, right? I then turned to my entity definition to see if something there would make sense. Here is the panels property within my page object:

<p>

<code>
property name="panels" fieldType="one-to-many" cfc="panel" fkcolumn="pageidfk" singularname="panel" orderby="area,position" cascade="delete";
</code>

<p>

Take note of the orderby. I did a quick SQL dump on the panel records and noticed that for the object I just made, area was blank. I wrote a quick bit of SQL to set it to a value and my error went away. Now - let's make this even more odd. In my attempt to recreate this bug, I reset area to null. Get this - the error didn't return. I had to set area to a <b>blank string</b> in order for the error to occur. If I read this right, it means that if you do an orderby on a column and the column can be blank, you will get an error.

<p>

That seems unusual to me. I mean if you are going to sort, I would assume everything has values in it, but SQL itself has no problem sorting data with blank values (not nulls) in them. When I just did a sort on it in my editor it simply treated the empty value as coming before A. Not ideal - but no error.