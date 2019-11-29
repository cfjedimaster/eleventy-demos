---
layout: post
title: "CFTHREAD, Names, and Commas"
date: "2009-05-18T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/05/18/CFTHREAD-Names-and-Commas
guid: 3358
---

Just a quick note to warn folks. When using cfthread with a dynamic name, don't forget that commas are not allowed. Outside of that, you can use any name you want to for the thread, as long as it is non-empty. Here is a quick example:

<code>
&lt;cfthread name="-^p^-"&gt;
thread
&lt;/cfthread&gt;

&lt;cfdump var="#cfthread#"&gt;
</code>

While that's a stupid name for a thread, it works just fine. Changing it to:

<code>
&lt;cfthread name="-^p^-,cow bell"&gt;
thread
&lt;/cfthread&gt;

&lt;cfdump var="#cfthread#"&gt;
</code>

Gives you:  <b>Attribute validation error in the cfthread tag. The thread name -^P^-,COW BELL is invalid. Thread names cannot be empty and should not contain a comma.</b>

In my case, the bug involved cfthread code being used in BlogCFC to handle pings. The blog title was used in naming the thread call and in this one example it had included a comma. (Kinda surprised this didn't come up before.) 

So why does this restriction exist? When you use the JOIN action of cfthread, you are asked to provide a list of thread names. Because this list must always use a comma-delimited list of names, you can't, and shouldn't be able to, create a thread name that also includes a comma. I guess Adobe could add a DELIMITER attribute to the tag but that seems like overkill if you ask me.