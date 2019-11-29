---
layout: post
title: "Ask a Jedi: Dynamic evaluation"
date: "2007-11-16T14:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/16/Ask-a-Jedi-Dynamic-evaluation
guid: 2478
---

Luis asks:

<blockquote>
<p>
Do you know of any way to dynamically create the condition for an if statement? I think the best way to explain this is with an example. I'm looking do to something along the lines of the following

&lt;cfset firstElement = "hello" /&gt;<br>
&lt;cfset operator = "eq" /&gt;<br>
&lt;cfset secondElement = firstElement /&gt;<br>
&lt;cfif  firstElement operator secondElement>&lt;/cfif&gt;<br>

I've tried various methods and variations using cfscript, iif(), and combinations of evaluate() and de(). Additionally I've searched the usual suspects for answers. (coldfusion, cf docs, cfwack, cf advanced, etc...) I realize there are longhand ways around this such as using a cfswitch to evaluate the value of operator, but I'm hoping to be able
to simply support all of CF's native operators without having to essentially write the same code for each operator choice. 
</blockquote>

Most likely you just had a typo when you tried evaluate(), and frankly, evaluate can be a bit confusing at times. This code sample worked for me:

<code>
&lt;cfset first = "ray"&gt;
&lt;cfset second = "ray"&gt;
&lt;cfset op = "eq"&gt;
&lt;cfoutput&gt;#evaluate("first #op# second")#&lt;/cfoutput&gt;
</code>

Switching second to "paris hilton" correctly returned a false value. Note though that in general, when I see evaluate I get a bit uneasy. Evaluate is <b>not</b> as slow as it used to be when you use ColdFusion 8. But it always strikes me as kind of a dirty function. Like - should I really be using this? I'm not telling folks to not use it (like I used to). I will say that most of the time when I do see it - it isn't necessary. 

One of the classic examples was - I have a variable that points to <i>another</i> variable. How do I get the value? They would then do this:

<code>
&lt;cfset variable = "name"&gt;
&lt;cfset value = evaluate(variable)&gt;
</code>

But with scopes, this is a lot simpler, and easier to read I think:

<code>
&lt;cfset value = variables[variable]&gt;
</code>