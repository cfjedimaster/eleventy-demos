---
layout: post
title: "A use for structFind!"
date: "2007-09-20T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/20/A-use-for-structFind
guid: 2360
---

While in general I would not think any ColdFusion function is useless, I've never really thought much of <a href="http://www.cfquickdocs.com/?getDoc=StructFind">structFind()</a>. StructFind simply returned value of a structure's key. To me - this seemed silly. If you wanted the value of the key - why wouldn't you just get it?

<code>
&lt;cfset s = structNew()&gt;
&lt;cfset s.name = "Paris Hilton"&gt;
&lt;cfset s.gender = "female"&gt;
&lt;cfset s.iq = 9 * randRange(1,10) * -1&gt;

&lt;!--- silly! ---&gt;
&lt;cfoutput&gt;#structFind(s, "name")#&lt;/cfoutput&gt;

&lt;!--- not so silly! ---&gt;
&lt;cfoutput&gt;#s.iq#&lt;/cfoutput&gt;
</code>

Now one could make the point that it would be useful in cases where you don't know the key until runtime, but then you would just use bracket notation:

<code>
&lt;!--- still not silly! ---&gt;
&lt;cfset key = "gender"&gt;
&lt;cfoutput&gt;#s[key]#&lt;/cfoutput&gt;
</code>

But yesterday on the cfaussie listserv, Mark Mandel shared an interesting, and useful, well, use for the function. I quote him here:

<blockquote>
I use StructFind() a lot - simply because I tend to encapsulate
struct's behind getter's and setters quite regualrly.

So Inside a CFC you would find me writing:

&lt;cfset thisValue = StructFind(getStruct(), key)&gt;

As ColdFusion doesn't support syntax like:

&lt;cfset thisValue = getStruct()[key]&gt;
</blockquote>

Interesting! Has anyone else use the function like this? (Or in some other way?)