---
layout: post
title: "Avoid use of scope names for argument names"
date: "2007-11-15T17:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/15/Avoid-use-of-scope-names-for-argument-names
guid: 2477
---

This falls under the category of "I knew better..." I'm working with a client who is using my <a href="http://youtubecfc.riaforge.org/">YouTube CFC</a> product. They were encountering some problems and wanted me to work on modifications to their page to handle cases where YouTube was down, or simply not returning proper information for whatever reason. (In our case it ended up being a network issues. ColdFusion couldn't hit any remote site due to a network change.)
<!--more-->
While working on the development server I made this simple change to my CFC:

<code>
&lt;cfif not isXML(result.fileContent) or isDefined("url.xxx")&gt;
</code>

This would let me quickly toggle back and forth between a good connection and a forced YouTube breakdown. But something odd happened. 

When I added ?xxx=1 to my URL, the error condition didn't fire. I checked to ensure I wasn't caching, reuploaded, etc, and nothing worked.

Turns out I had used URL for the name of one of the arguments to the function:

<code>
&lt;cfargument name="url" type="string" required="true"&gt;
</code>

I typically avoid doing this. All I can think of in this case I figured since I always use "arguments." when referencing arguments, there wouldn't be any confusion. But that wasn't the case. As soon as you add an argument like this, you essentially "break" the URL scope. (Switching to structKeyExists didn't help.) 

I renamed my argument to "theurl" and then everything worked fine.