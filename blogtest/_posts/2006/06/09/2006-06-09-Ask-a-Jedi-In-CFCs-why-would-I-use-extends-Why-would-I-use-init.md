---
layout: post
title: "Ask a Jedi: In CFCs, why would I use extends? Why would I use init()?"
date: "2006-06-09T12:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/09/Ask-a-Jedi-In-CFCs-why-would-I-use-extends-Why-would-I-use-init
guid: 1323
---

It is probably bad form to cover two topics in one blog post, but they came in together so I thought I'd answer them together. Here is what my reader asked:

<blockquote>
Can you explain when you want to use the "extend" attribute in a CFC?

My second question is, when would you use "init()"
</blockquote>

The extend attribute tells ColdFusion that the CFC extends, or inherits, another CFC. A classic example of this would be to consider a Dog CFC that extends an Animal CFC. When a CFC extends another, the "child" gets all the methods of the "parent", so this can really help out with organization. If you were working on a Dog and Cat CFC and found that they shared multiple properties and methods, it would make sense to place that shared code into an Animal CFC that they could then extend.

One thing you don't want to use extends for is "utility" type functions. So for example, you may have a CFC that serves as a simple collection of helper functions. While your Dog CFC may need some of the methods, a Dog really isn't a Utility, so it doesn't make sense to extend it. The rule is, and this is not from me, but what I've read elsewhere, is that inheritance should only be used when the relationship between the two follows the "Is A" rule. So for example, a Dog "Is A" Animal, but not a Utility. For those cases, you simply want to create an instance of the other CFC inside the other CFC. How would you do that? That leads to our next question.

CFCs do not have a formal constructor, which is a method run by default when a CFC is created. ColdFusion will execute any code in a CFC that is not inside a method, but if you want a method to run on CFC creation, you need to do it yourself. Most ColdFusion developers are using an init method for this purpose. They create their CFC and call init on it immediately, normally using a format like so:

<code>
&lt;cfset myCFC = createObject("component", "foo").init(somevar)&gt;
</code>

You do not <i>have</i> to do this, but again, it is the recommended way to create and initialize a CFC. (Typically you will pass in things like a datasource or some other variable the CFC needs to operate.)

This is only a high level answer to your question. If you will be attending <a href="http://www.cfunited.com/">CFUNITED</a>, I have a three hour session on CFCs and I'll be covering topics like these.