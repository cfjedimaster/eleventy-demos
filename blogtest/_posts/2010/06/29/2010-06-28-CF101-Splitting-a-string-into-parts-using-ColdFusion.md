---
layout: post
title: "CF101: Splitting a string into parts using ColdFusion"
date: "2010-06-29T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/06/29/CF101-Splitting-a-string-into-parts-using-ColdFusion
guid: 3862
---

Stveve Wonderpets asked:

<blockquote>
As I've seen many ways to try and do this, I'm coming to you to see
how, and the fastest executing way to find the "<!-- pagebreak -->"
and put each paragraph into a struct or array?
</blockquote>

<p>

I have to be honest. When I first responded to Steve, I completely spaced on the fact that he had a few alternatives already, and he was simply looking for the "best" way. I provided a few solutions myself and I thought I'd share them with my readers.
<!--more-->
<p>

I began by taking his source data and simply creating a variable out of it.

<p>

<code>
&lt;cfsavecontent variable="text"&gt;
- Hide quoted text -
Contrary to popular belief, Lorem Ipsum is not simply random text. It
has roots in a piece of classical Latin literature from 45 BC, making
it over 2000 years old. Richard McClintock, a Latin professor at
Hampden-Sydney College in Virginia, looked up one of the more obscure
Latin words, consectetur, from a Lorem Ipsum passage, and going
through the cites of the word in classical literature, discovered the
undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and
Evil) by Cicero, written in 45 BC. This book is a treatise on the
theory of ethics, very popular during the Renaissance. The first line
of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
section 1.10.32.
&lt;!-- pagebreak --&gt;
Lorem Ipsum is simply dummy text of the printing and typesetting
industry. Lorem Ipsum has been the industry's standard dummy text ever
since the 1500s, when an unknown printer took a galley of type and
scrambled it to make a type specimen book. It has survived not only
five centuries, but also the leap into electronic typesetting,
remaining essentially unchanged. It was popularised in the 1960s with
the release of Letraset sheets containing Lorem Ipsum passages, and
more recently with desktop publishing software like Aldus PageMaker
including versions of Lorem Ipsum.
&lt;!-- pagebreak --&gt;
Lorem Ipsum is simply dummy text of the printing and typesetting
industry. Lorem Ipsum has been the industry's standard dummy text ever
since the 1500s, when an unknown printer took a galley of type and
scrambled it to make a type specimen book. It has survived not only
five centuries, but also the leap into electronic typesetting,
remaining essentially unchanged. It was popularised in the 1960s with
the release of Letraset sheets containing Lorem Ipsum passages, and
more recently with desktop publishing software like Aldus PageMaker
including versions of Lorem Ipsum.
&lt;/cfsavecontent&gt;
</code>

<p>

For the first method I suggested, I simply made use of the fact that the ColdFusion variable created above can be used like a Java <a href="http://java.sun.com/j2se/1.5.0/docs/api/java/lang/String.html">String object</a>. This means we have access to methods like <a href="http://java.sun.com/j2se/1.5.0/docs/api/java/lang/String.html#split(java.lang.String)">split</a>. So I first shared this:

<p>

<code>
&lt;cfset p = text.split("&lt;!-- pagebreak --&gt;")&gt;
&lt;cfdump var="#p#"&gt;
</code>

<p>

It doesn't get much easier than that. It is important to remember that the value pased to Spit should be a regex. If you wanted to match on "." for some reason you would (I assume - didn't test it!) need to escape it. 

<p>

If using Java worries you for some reason, you can also make use of a CFLib UDF, <a href="http://www.cflib.org/udf/Split">Split</a>. Despite being many more lines of CFML, in Steve's testing it ran just as fast. (Although I'd probably assume the Java method would be faster on larger strings.)