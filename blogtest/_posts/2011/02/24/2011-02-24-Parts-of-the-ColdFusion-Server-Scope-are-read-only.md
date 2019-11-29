---
layout: post
title: "Parts of the ColdFusion Server Scope are read only"
date: "2011-02-24T13:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/24/Parts-of-the-ColdFusion-Server-Scope-are-read-only
guid: 4137
---

Not sure if this is surprising or news to anyone, but this is the first time I've run into it so I thought I'd share a blog on it. Yesterday someone on Twitter mentioned that they couldn't update their ColdFusion server to 9.0.1 without management approval. I got the idea that this would be a monumental task and something occurred to me. What if you updated ColdFusion anyway and used onServerStart to simply change the Server variable containing product version? OK, I'm not advocating we lie to our bosses, but, I had to try it out. This is what I found.
<!--more-->
<p>

First I tried to change the product version:

<p>

<code>
&lt;cfdump var="#server#"&gt;
&lt;cfset server.coldfusion.productversion = "1"&gt;
</code>

<p>

But that gave me:

<p>

<blockquote>
<b>Attempted to update or delete a read-only variable.</b><br/><br/>
PRODUCTVERSION is a reserved read-only variable in this scope. The reserved variables in this scope are: "PRODUCTLEVEL", "PRODUCTNAME", "APPSERVER", "PRODUCTVERSION", "EXPIRATION", "INSTALLKIT", "SUPPORTEDLOCALES", "ROOTDIR"
</blockquote>

<p>

Interesting, right? These are all the default keys you get in the Server scope and I guess Adobe doesn't want you changing them (for good reason probably). Oddly though the server.coldfusion scope can be added to:

<p>

<code>
&lt;cfset server.coldfusion.coolness = 1&gt;
</code>

<p>

You get a similar error if you try to change something in the OS scope:

<p>

<code>
&lt;cfset server.os.arch = "1"&gt;
</code>

<p>

<blockquote>
<b>Attempted to update or delete a read-only variable.</b><br/><br/>
ARCH is a reserved read-only variable in this scope. The reserved variables in this scope are: "ARCH","NAME","VERSION","ADDITIONALINFORMATION","BUILDNUMBER"
</blockquote>

<p>

And you get something similar if you try to mess with coldfusion or os at a higher level:

<p>

<code>
&lt;cfset server.os = "1"&gt;
</code>

<p>

<blockquote>
<b>Attempted to update or delete a read-only variable.</b><br/><br/>
OS is a reserved read-only variable in this scope. The reserved variables in this scope are: "OS","COLDFUSION"
</blockquote>

<p>

So - all in all - not terribly surprising - but probably good to know.