---
layout: post
title: "Diagnosing a CFHTTP issue - peer not authenticated"
date: "2011-01-12T13:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/01/12/Diagnosing-a-CFHTTP-issue-peer-not-authenticated
guid: 4080
---

What follows comes from a lot of sources, and is not something I'm 100% solid on mentally, so if I screw anything up here, blame me, not the group of guys who helped me out. A few weeks ago I looked into writing an API for a <b>very</b> cool service called <a href="http://zencoder.com/">Zencoder</a>. Zencoder is an API based video encoding service. Basically think of it as an easier way to do ffmpeg type work. They aren't free, but from what I can tell of their API, it seems extremely well thought out and like a great service to consider. I began working on a ColdFusion wrapper (which, by the way, will be happening now that I've gotten past my issues) for their service. I immediately noticed a problem. Whenever I did a cfhttp against their API URL I got:
<!--more-->
<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip11.png" />

<p>

At this point I remembered that you sometimes have to do some command line work to get HTTPS sites working with ColdFusion. I followed some tutorials on <a href="http://www.talkingtree.com/blog">Steven Erat's blog</a> but this tech note is the one you want: <a href="http://kb2.adobe.com/cps/400/kb400977.html">How to import certificates into certificate stores (ColdFusion)</a>.

<p>

So I tried that - on multiple machines - but it never actually worked. At this point I did what all good developers do when stuck (and after Googling) - I punted. I posted on a private list serv and got some great responses. First, Simon Free suggested the following code:

<p>

<code>
&lt;cfset objSecurity = createObject("java", "java.security.Security") /&gt;
&lt;cfset storeProvider = objSecurity.getProvider("JsafeJCE") /&gt;
&lt;cfset objSecurity.removeProvider("JsafeJCE") /&gt;

Do your call

&lt;cfset objSecurity.insertProviderAt(storeProvider, 1) /&gt;
</code>

<p>

I had no idea what this was doing, but it worked! Turns out - this comes down to a problem with the security provider used by ColdFusion. Nathan Mische has an indepth <a href="http://www.mischefamily.com/nathan/index.cfm/2010/4/16/OpenID-And-ColdFusion">blog entry</a> detailing how he ran into the issue and how he got around it. If you read his blog post you will also find out that this only impacts ColdFusion 9 Enterprise. I confirmed this myself. Switching from the Developer edition (which acts like Enterprise) to a Standard license makes the issue go away. Jason Dean then followed up with this good explanation.

<p>

<blockquote>
This is definitely a bug in the BSafe CryptoJ libraries and one that I have been meaning to report to ASSET and PSIRT for some time. It is a tough one to articulate and demonstrate. Though I have suspected for a while that this would only affect CF Ent, this is the first time i have seen it confirmed.
<br/><br/>
One thing I did not see anyone point out here, so I will do it, is that the way that the Java Crypto Architecture (JCA) and Java Crypto Extensions (JCE) work is through a "Provider List" (Note my terminology may be off).  When you request a crypto method from JCA/JCE it looks though the provider list to find the first provider that supports the algorithm you have requests. So, if I ask for CF to encrypt something using AES it will start search the providers to find one that supports AES. 
<br/><br/>
In CF Enterprise, BSafe CryptoJ is the first provider in the list and it has almost EVERYTHING one would need so it is pretty much always the one used. Which makes CF FIPS-140 compliant by default (nice!).
<br/><br/>
But sometimes the BSafe library has issues with certain certs.  Dunno why, but it does. It cannot deal with the BaseCamp cert, the Zencoder cert, an some others. I have not been able to find a pattern.
<br/><br/>
As Ray saw, when he dumped the list of providers available to JCA/JCE, the list was HUGE. I think CF Enterprise and the JVM have a combined totals of 11 or more crypto providers. The second provider in the list for CF Enterprise is the Sun Provider (Which is the first one in CF Standard) that Nathan mentioned. It is a perfectly good provider and will do everything we need it to, it's just not FIPS-140 compliant. 
<br/><br/>
So when we disable the BSafe library using the JVM arg or with Simon's hack, we are not necessarily removing any security. Java will simply use the next available provider, which is fine. 
<br/><br/>
The only place this would not be acceptable is when FIPS-140 compliance is mandatory. 
</blockquote>

<p>

So... interesting, right? My take from this is that a) you have multiple security providers in CF9/Ent and b) the default one is great 90% of the time... except when it isn't. ;) So my plans for the Zencoder API are to abstract out the HTTP calls and wrap them in Simon Free's fix when CF9/Ent or Dev is encountered. I will also document some of this in the package so folks can remove my workaround if they wish to do the change at the JVM level. Pete Freitag expressed concerned that this workaround might have drawbacks in production. 

<p>

As always - thank to you my smart friends for the help (they are listed below), and hopefully this will help others if they run into it. Oh - and one more quick thing. I worked with <a href="http://zencoder.com">Zencoder</a> while debugging this and found them to be <b>very</b> responsive. If anyone is considering purchasing their service, I think this is a great sign. 

<p>

<h2>Credit</h2>
<ul>
<li><a href="http://www.simonfree.com/blog/">Simon Free</a></li>
<li><a href="http://www.mischefamily.com/nathan/">Nathan Mische</a></li>
<li><a href="http://www.12robots.com/">Jason Dean</a></li>
<li>Brian Meloche</li>
<li><a href="http://www.petefreitag.com/">Pete Frietag</a></li>
<li><a href="http://www.cfsilence.com">Todd Sharp</a></li>