---
layout: post
title: "Ask a Jedi: Caching Stored Procedures"
date: "2008-04-25T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/25/Ask-a-Jedi-Caching-Stored-Procedures
guid: 2788
---

Seth asks:

<blockquote>
<p>
Just a quick question regarding Stored Procedures. So recently I have been dealing
with some SP's that take up to 4 seconds to run , it can be annoying. So I
wanted to know is there an effective way to cache SP's in CF 8, or do I have to
convert them to CFC's and use a standard inline query. 
</p>
</blockquote>

So first off, the cfstoredproc tag does <i>not</i> have a cachedwithin or cachedafter attribute. You can convert your stored procs call like so:

<code>
&lt;cfquery name="getit" datasource="foo" cachedwithin="#createTimeSpan(0,0,0,60)#"&gt;
exec doit 'a','b'
&lt;/cfquery&gt;
</code>

And the result is cached, but frankly, I'd suggest using your own caching system instead. It is much easier to manage. By that I mean simply use cfstoredproc and cache the result in either the Application or Session scope, whatever makes sense. You can store the time generated as well and get new data every hour (again, whatever makes sense).

You mentioned above 'convert them to CFCs' - I do hope you are using your stored procs in CFCs already. In general, all my database code exists in CFCs, whether I use stored procs or 'standard' queries.

<b>Edit 10:32 AM</b><br>
Thanks to reader Joel, I now know that cfstoredproc does indeed support cachedwithin. Apparently it's mentioned in some of the other docs, but not the core reference. (Maybe it ended up in the same place as the cffeed chapter of the dev guide. ;)