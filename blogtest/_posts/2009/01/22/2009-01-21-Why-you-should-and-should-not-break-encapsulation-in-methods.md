---
layout: post
title: "Why you should, and should not, break encapsulation in methods"
date: "2009-01-22T10:01:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2009/01/22/Why-you-should-and-should-not-break-encapsulation-in-methods
guid: 3203
---

There was an interesting blog post this morning on Ben Nadel's site (<a href="http://www.bennadel.com/index.cfm?dax=blog:1468.view">A Serious CFThread Bug in ColdFusion?</a>) that lead to a discussion about CFC methods and encapsulation. This is a topic I've covered before but I think it bears repeating with some good examples. We all know that we shouldn't break encapsulation in methods, but why? And is there ever a good reason <i>to</i> break encapsulation?
<!--more-->
First let's describe what we mean by encapsulation. In general, a CFC method (or even a UDF or a custom tag) should have no connections to code outside of itself. Here is a very simple example. Imagine we have created a method that will print a name as: Lastname, First. We could easily write up a UDF for our site like so:

<code>
function displayName() {
  return client.lastname & ", " & client.firstname;
}
</code>

Because our site makes use of the client scope to store this info, it becomes real easy to display our name from our CFM page:

<code>
&lt;cfoutput&gt;Greetings: #displayName()#&lt;/cfoutput&gt;
</code>

However, what happens when we wake up and smell the coffee and discover that we don't want to use client variables? Not only do we have to change code outside the UDF but inside as well since it was tied to the client scope and not generic. A better, more usable version, would look like so:

<code>
function displayName(fn,ln) {
  return ln & ", " & fn;
}
</code>

Now not only can we use it with our new session based code (#displayName(session.firstname,session.lastname)#), but we could use it to display <i>any</i> name on the site.

Basically we've created a method that by being more generic ends up being more useful. I've probably done a horrible job of explaining a big concept, but I think at a simple level this is a great example. 

Now to get on the pulpit for a minute. I've given many presentations over my life and I've written books, blog articles, and generally have been known to run my mouth at a thousand miles per hour if someone will listen to me. I know I've said, more than once, something along the lines of:

<blockquote>
<p>
If you do X, even once, you will regret it and the world will come to an end. Human sacrifice, dogs and cats living together... mass hysteria! 
</p>
</blockquote>

The truth is, though, that this isn't really true. I'd be hard pressed to find any rule in ColdFusion (or development in general) that is either 100% true all the time or as 'fatal' as some folks may think. That being said, there is a good counter example to the 'rule' above. Remote service APIs. 

I'll use "Remote Service APIs" as a generic term for any CFC created specifically for remote clients. For example, you may build a CFC that others can call to get the latest product data from your site. That CFC may have a method that gets products and converts the result set to XML. Each time you call a CFC remotely, ColdFusion has to create the CFC from scratch. Imagine if your site already had a products CFC cached in the Application scope. You could create a new instance of this CFC in your remote API CFC. Ok, but what if you need to work with 10 CFCs in order to create the XML? What if you change how a CFC is created and update Application.cfc but forget to update your remote API? Not only do you have performance issues to worry about now you also have configuration issues as well! 

In this case I'd suggest that the simplest thing to do is to let your remote API cfc simply reuse the existing Application scoped CFCs. You then don't have to worry about configuration (see note below) and you get the benefit of not having to recreate additional CFCs on each remote call. 

Seem reasonable? Any other good counterexamples to the "don't break encapsulation" rule?

p.s. When it comes to CFC configuration, <b>please</b> do not forget <a href="http://www.coldspringframework.org/">ColdSpring</a>. ColdSpring not only makes complex CFC configuration incredibly simple it can also automatically generate remote service APIs that will reuse your CFCs.

<b>Updated 1:41PM</b>: I want to point out an important <a href="http://www.raymondcamden.com/index.cfm/2009/1/22/Why-you-should-and-should-not-break-encapsulation-in-methods#cFFD1CD52-19B9-E658-9DE7FF927E7A4D38">comment</a> by Roland Collins. He correctly pointed out that I confused the topic of encapsulation with decoupling. He said: "Decoupling is about making sure that objects don't have dependencies on other objects, as in your example above. Encapsulation is more about making sure that an object provides a coherent and complete interface so that objects that call it do not have to have any idea how it works internally." Hopefully I haven't led people down the wrong path here, and I apologize for the mistake.