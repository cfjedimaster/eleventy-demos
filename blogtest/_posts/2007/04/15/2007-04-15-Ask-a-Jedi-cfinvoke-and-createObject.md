---
layout: post
title: "Ask a Jedi: cfinvoke and createObject"
date: "2007-04-15T16:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/15/Ask-a-Jedi-cfinvoke-and-createObject
guid: 1960
---

Gary sent in a question I've dealt with in the past, but I hear it brought up multiple times so I thought I'd share my response here. First, Gary's question:

<blockquote>
Simply asked, given the two examples below, how are these two methods different and what are the pros and cons of each. I'm leaning towards 'why is the creatobj method preferred?' This all goes to having a better understanding of OOP.

&lt;cfset application.blog =
createObject("component","org.camden.blog.blog").init(blogname)&gt;


&lt;cfinvoke
component="org.camden.blog.blog" method="init"
returnvariable="application.blog"&gt;<br />
   &lt;cfinvokeargument name="name"
value="#blogname#"&gt;<br>
&lt;/cfinvoke&gt;
</blockquote>

There are few different ways to answer this. First off - the result of both these code blocks is the exact same. They both call the init method on a CFC named blog, pass in a variable, and assign the result to a variable named application.blog. So if you consider the results - they are the same.

Technically of course they are different. One uses createObject and one uses cfinvoke. Under the hood, I'd be willing to bet they compile down to pretty much the same code. 

So which is better?

The createObject method is typically what is used by most developers. I'm not sure I'd call it a "standard" but I think you would see that in code more often than the cfinvoke version.

The cfinvoke method has the benefit of working on hosts, like GoDaddy, that block access to createObject. 

What do <i>I</i> do? When creating an instance of an object using the init method, I'll always use createObject. When calling a method on a CFC, I'll use simple script format (foo = mycfc.goo()) unless my arguments have complete logic in them. If they do - I'll use cfinvoke since you can conditionally include arguments. Here is an example:

<code>
&lt;cfinvoke component="#application.blog#" method="goo"&gt;
&lt;cfif hour(now()) lt 10&gt;
  &lt;cfinvokeargument name="morningmode" value="true"&gt;
&lt;/cfif&gt;
  &lt;cfinvokeargument name="name" value="dharma"&gt;
&lt;/cfinvoke&gt;
</code>