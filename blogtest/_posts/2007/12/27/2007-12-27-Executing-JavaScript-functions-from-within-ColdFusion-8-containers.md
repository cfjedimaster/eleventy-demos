---
layout: post
title: "Executing JavaScript functions from within ColdFusion 8 containers"
date: "2007-12-27T12:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/27/Executing-JavaScript-functions-from-within-ColdFusion-8-containers
guid: 2563
---

This morning a discussion came up on cf-talk about how to run JavaScript functions from within ColdFusion 8 containers. (What do I mean by 'container'? I mean any of the new Ajax UI elements like the Pod or Window.) The person asking the question was trying to use ColdFusion.navigate. I can see how you could possibly think this would work. One way to run JavaScript functions is with links, as in:
<!--more-->
<code>
&lt;a href="javascript:test()"&gt;Run test()&lt;/a&gt;
</code>

But that isn't what you want to use here. Instead - the solution is much simpler. When you use containers, they execute in the context of the page itself. That means you can run any code using the same type of code I used above. Consider this full example:

<code>
&lt;script&gt;
function parentSayHi() {
	alert("Hi, I'm the parent, and I'm saying hi.");
}
&lt;/script&gt;

&lt;p&gt;
&lt;a href="javascript:parentSayHi()"&gt;Test parentSayHi&lt;/a&gt;
&lt;/p&gt;

&lt;cfpod title="My Pods Rock the Casbah"&gt;
Another &lt;a href="javascript:parentSayHi()"&gt;test&lt;/a&gt;.
&lt;/cfpod&gt;

&lt;cfpod title="The iPod Pod" source="test3.cfm" /&gt;
</code>

In this example I've created a simple JavaScript function, parentSayHi. I then show an example of what I describe above - a link that runs the function. 

The next block of code shows an inline cfpod tag. Notice again though the simple link to run the function.

Lastly I have a pod that uses an external source. The code for this file is:

<code>
Yet another &lt;a href="javascript:parentSayHi()"&gt;test&lt;/a&gt;.
</code>

As you can see - it too is a simple link. When run, all three of these links have no problems running the JavaScript function.