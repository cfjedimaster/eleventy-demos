---
layout: post
title: "Ask a Jedi: Cached cfinvoke and web services"
date: "2006-05-05T08:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/05/Ask-a-Jedi-Cached-cfinvoke-and-web-services
guid: 1249
---

Geoff asks:

<blockquote>
This article: <a href="http://www.adobe.com/go/13115e61">http://www.adobe.com/go/13115e61</a> 
states that dns lookups for cfhttp requests are cached forever by default.

Is the behaviour the same for cfinvoke too?
(That is if I'm invoking a web service for example)
</blockquote>
<!--more-->
Yes and no. ColdFusion won't cache the result of the web service call, what it will do is cache the WSDL of the web service. So any change to methods (addition, subtraction, modification) will not be usable by ColdFusion. Luckily you can just go into the ColdFusion administration and refresh or remove the cache. I do wish cfinvoke had an optional argument to let me refresh the cache via the call. It isn't something I'd use during production, but during testing it would be nice. I'm not sure if the Administrator API allows for this. One day soon I'm going to generate the CFC docs as PDF (using <a href="http://www.cflib.org/udf.cfm?ID=1332">this</a>) and will put them online so they are easier to find. 

So for my readers, I know I've blogged this before, but I think I see this question/problem once a week, so forgive me for repeating myself.

<b>Edited</b> As a follow up. I had misread this question a bit. He wants to know if cfinvoke will cache the dsn look up in a case like this:

<code>
&lt;cfinvoke
webservice="https://www.secpay.com/java-bin/services/SECCardService?wsdl"
method="validateCardFull" etc&gt;
</code>

I'm checking into this, and will post the answer to the main entry.