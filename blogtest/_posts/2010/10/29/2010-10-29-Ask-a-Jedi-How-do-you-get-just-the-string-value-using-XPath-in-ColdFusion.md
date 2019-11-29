---
layout: post
title: "Ask a Jedi: How do you get just the string value using XPath in ColdFusion?"
date: "2010-10-29T12:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/10/29/Ask-a-Jedi-How-do-you-get-just-the-string-value-using-XPath-in-ColdFusion
guid: 3987
---

John asked:

<p/>

<blockquote>
Hi Ray,<br/>
<br/>
As I work with XML/ColdFusion more and more, and I'm starting to think that
I could make things a lot easier on myself with a better understanding of
xpath and xmlSearch(). Currently, when I want to get the text or attributes
of a node, I use xmlSearch() to return an array and then I access either
result[i].xmlText or result[i].xmlAttributes directly.
<br/>
Is there a way to tell xmlSearch() to return .xmlText or .xmlAttributes
directly?
</blockquote>
<!--more-->
<p>

Good question. I began by creating a super simple XML node that contained both text and attributes.

<p>

<code>
&lt;cfxml variable="testdoc"&gt;
&lt;doc&gt;
       &lt;header&gt;
               &lt;author&gt;John Doe&lt;/author&gt;
       &lt;/header&gt;
       &lt;content language="en" charset="iso-8859-1"&gt;
       &lt;/content&gt;
&lt;/doc&gt;
&lt;/cfxml&gt;

&lt;cfdump var="#testdoc#"&gt;
</code>

<p>

I've got one simple text field for author and a node, content, that has some attributes. So let's first look at how you can get to the John Doe string via a simple search for author:

<p>

<code>
&lt;cfset test1 = xmlSearch(testdoc, "//author")&gt;
&lt;cfdump var="#test1#"&gt;
</code>

<p>

This will search for author anywhere in the document. The result is:

<p>

<img src="https://static.raymondcamden.com/images/screen23.png" />

<p>

You can get to the text value by simply adding text():

<p>

<code>
&lt;cfset test1 = xmlSearch(testdoc, "//author/text()")&gt;
&lt;cfdump var="#test1#"&gt;
</code>

<p>

Unfortunately, this still returns a complex structure:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/screen24.png" />

<p>

Luckily - <a href="http://www.w3schools.com">W3Schools.com</a> once again comes to the rescue with it's excellent <a href="http://www.w3schools.com/xpath/default.asp">XPath docs</a>. If you go into the <a href="http://www.w3schools.com/xpath/xpath_functions.asp">functions</a> sections you can see all kinds of interesting things you can do with your searches. One of them - fn:string, will return a string value. You need to dump the fn: portion, but to get the name "John Doe", you can just do:

<p>

<code>
&lt;cfset test1 = xmlSearch(testdoc, "string(//author/text())")&gt;
&lt;cfdump var="#test1#"&gt;
</code>

<p>

Pretty easy, right? You can apply the same thing for a search against the language attribute:

<p>

<code>
&lt;cfset test1 = xmlSearch(testdoc, "string(//content/@language)")&gt;
</code>