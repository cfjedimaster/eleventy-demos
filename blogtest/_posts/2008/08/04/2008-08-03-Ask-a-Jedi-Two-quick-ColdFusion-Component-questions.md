---
layout: post
title: "Ask a Jedi: Two quick ColdFusion Component questions"
date: "2008-08-04T07:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/04/Ask-a-Jedi-Two-quick-ColdFusion-Component-questions
guid: 2953
---

Esmeralda (what a cool name) asks:

<blockquote>
<p>
I am attempting to use Coldfusion Components. I have two questions - first, if there are multiple instances of a component on one page, would it be better to use cfinvoke or createObject? Secondly, is there an efficient way to use a
component method within a loop? Currently it will include that file during each include, when all I really need is the method from said component. Shouldn't the component already be instantiated on the page and therefore not recalling that
include?
</p>
</blockquote>
<!--more-->
Your first question is simple. Think of a component like a tool. You use the tool to perform some type of business logic and return a result. That being the case - there is no need to recreate the tool every time you use it, right? You don't buy a hammer for each nail. You can certainly use createObject to make the CFC at first, but after that, just use the instance you created.

Your second question is a bit weird to me. So yes, in a loop you can call some method on a CFC over and over again. That's not efficient or inefficient by itself. It <i>sounds</i> like you are cfincluding a page with the createObject, and if so, then yes, that is wrong and you should just make the CFC once before you get into the loop.

You can stop reading now as the following is mainly just theory. As a generic question, when does it make sense to do:

<code>
&lt;cfloop something&gt;
 &lt;cfset cfc.foo(x)&gt;
&lt;/cfloop&gt;
</code>

versus:

<code>
&lt;cfset cfc.fooList(list)&gt;
</code>

I don't know if I have hard and fast answers, but my thinking is that the a loop is certainly fine if you already have a loop. Maybe you are outputting over a query and part of the result comes from the CFC method. The first method is also simple: "Do some logic on a value", whereas the second, "Do some logic on a list of values" may not be as useful across multiple areas. I would probably guess that - over all - the speed may be better with fewer calls to the CFC method, since ColdFusion does have to 'package' up stuff and pass data, but I doubt the difference would be measurable even. I think I'd make the decision based on what makes the most sense for the API of your CFC and not worry so much about the speed difference.