---
layout: post
title: "Quick Test - Script Based UDFs"
date: "2010-12-02T17:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/12/02/Quick-Test-Script-Based-UDFs
guid: 4038
---

I've been writing UDFs for a <i>long</i> time - <a href="http://www.cflib.org">CFLib</a> was begun when ColdFusion 5 was still in development. But I have to tell you - this one surprised me. Without checking the docs or writing code, tell me what the following script will do:
<!--more-->
<p/>

<code>
&lt;cfscript&gt;
function foo(name) {
  return "beer";
}
&lt;/cfscript&gt;

&lt;cfdump var="#foo()#"&gt;
</code>

<p/>

If you answered, "Will throw an error, oh hairy one!", then you would be.... <b>wrong</b> if you are using ColdFusion 9. From ColdFusion 5 to ColdFusion 8, the existence of a argument in the method signature has always implied the argument is required. The docs made this clear (and thanks go to <a href="http://www.samfarmer.com/">Sam Farmer</a> for digging up these links):

<p/>

<blockquote>
<a href="http://livedocs.adobe.com/coldfusion/8/htmldocs/UDFs_03.html#1193711">http://livedocs.adobe.com/coldfusion/8/htmldocs/UDFs_03.html#1193711</a><br/>
Names of the arguments required by the function. The number of arguments passed into the function must equal or exceed the number of arguments in the parentheses at the start of the function definition. If the calling page omits any of the required arguments, ColdFusion generates a mismatched argument count error.
</blockquote>

<p/>

However, in ColdFusion 9, the docs change:

<p/>

<blockquote>
<a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSE99A664D-44E3-44d1-92A0-5FDF8D82B55C.html">http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSE99A664D-44E3-44d1-92A0-5FDF8D82B55C.html</a><br/>
Specifying the required keyword makes the argument mandatory. If the required keyword is not present then the argument becomes optional.
</blockquote>

<p/>

So to make the UDF above work like ColdFusion 5-8, you must change it to:

<p/>

<code>
&lt;cfscript&gt;
function foo(required name) {
  return "beer";
}
&lt;/cfscript&gt;

&lt;cfdump var="#foo()#"&gt;
</code>

<p/>

Personally I don't think this is a huge big deal. Any code that required name would fail as soon as you didn't pass it. But it's something you want to watch out for.

<p/>

P.S. If you are curious about the first version and what became of name - it existed as an argument but had a null value.