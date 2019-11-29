---
layout: post
title: "The Magic of 1"
date: "2007-03-20T12:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/20/The-Magic-of-1
guid: 1907
---

Yesterday I was doing some training and my student asked me to explain the logic behind this code:

<code>
&lt;cfif 1&gt;
 &lt;cfdump var="#dharma#"&gt;
&lt;/cfif&gt;
</code>

It was something so obvious to me that it never occurred to me that it may be confusing, and looking at it with a fresh eye I can definitely see it doesn't make much sense. Here is the method behind my madness...
<!--more-->
Laziness. We've all had cases where we are working on a page and we need to quickly add some debug code to a page. Typically we just type it in like so:

<code>
&lt;cfdump var="#dharma#"&gt;
</code>

Then if we want to hide it, but we know we aren't quite done yet, we replace it with this:

<code>
&lt;!---
&lt;cfdump var="#dharma#"&gt;
---&gt;
</code>

So now to go back and forth we can add and remove the CFML comments. Well I'm lazy. I pride myself on my laziness. I don't want to have to add/remove CFML comments. Plus I tend to typo that particular set of code. So I will often use the cfif 1 code instead. When I want to hide it, I switch to:

<code>
&lt;cfif 0&gt;
 &lt;cfdump var="#dharma#"&gt;
&lt;/cfif&gt;
</code>

In case folks don't get what the 1 and 0 means, they are shorthand for true and false. ColdFusion considers any non-zero number to be true.