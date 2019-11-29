---
layout: post
title: "Ask a Jedi: Learning CFScript"
date: "2007-05-08T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/08/Ask-a-Jedi-Learning-CFScript
guid: 2017
---

Brad asks:

<blockquote>
After studying open sourced Coldfusion applications, I have noticed Coldfusion experts use cfscript, mostly for functions, create objects, and take advantage of Java language. I wonder why do they often use cfscript and what situations are they useful?

How can I go around and learn how to use cfscript?
</blockquote>
<!--more-->
I hope I don't sound egotistical if I include myself in that group of experts, but let me give you my own personal feelings on this. I don't actually use cfscript very much. Not to say I never use it, but I'm just not a huge user of it. I'd disagree that people use cfscript a lot of functions... or at least I'd urge against it. While it is useful for simple UDFs, remember that tag based methods give you control over the output, access, and other bits of metadata that you would need, well should use, for defining your methods. 

Also, you certainly do not need to use cfscript to take advantage of Java methods. Tag-based CFLM works just fine with that. 

So what situations would be useful for cfscript? If I'm doing some quick prototyping and using some simple statements, then I'll consider using cfscript. For example:

<code>
&lt;cfscript&gt;
x = 1;
y = 2;
z = x+1;
&lt;/cfscript&gt;
</code>

But as you can see, that is <i>very</i> trivial code. I can say that with the planned enhancements to cfscript in CF8, I may use it quite a bit more. Like others, I've gotten tripped up by the use of &lt; and &gt; in cfscript so I may start using it more when I do production work in CF8. 

As for <i>learning</i> cfscript, you can always try the documentation: <a href="http://livedocs.adobe.com/coldfusion/7/htmldocs/00000970.htm">The CFScript language</a>