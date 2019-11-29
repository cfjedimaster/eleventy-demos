---
layout: post
title: "Ask a Jedi: If I do my own checking, do I still need cfqueryparam?"
date: "2006-06-01T15:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/01/Ask-a-Jedi-If-I-do-my-own-checking-do-I-still-need-cfqueryparam
guid: 1310
---

Justin asks:

<blockquote>
In a CFC file using &lt;cffunction&gt; with &lt;cfargument type=&quot;blah&quot;&gt; should any
queries inside the function (which is in the cfc) be using &lt;cfqueryparam&gt;? Or is the data already validated by the &lt;cfargument&gt; tag?

I want to make sure I'm
protecting my users, but don't know if theres a such thing as
&quot;overkill&quot; here.
</blockquote>

Repeat after me - there is no overkill when it comes to security. Another example would if you do validation on the argument before sending it to the CFC. Does it make sense to validate again in the CFC. Yes. As it stands, cfargument can validate data types, but can't validate things like "Greater than zero" or "Whole numbers only."

Also - you are forgetting the cfqueryparam is <i>more</i> than just a security thing. It also speeds up the query execution (for databases that support it).