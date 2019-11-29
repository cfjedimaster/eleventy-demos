---
layout: post
title: "ColdFusion Zeus POTW: Cookie via Script"
date: "2011-10-31T11:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/10/31/Zeus-POTW-Cookie-via-Script
guid: 4414
---

In my last Zeus preview, I discussed what I thought was a minor, but nice, language enhancement. Turns out the "minor" feature got quite a few replies from my readers. So in that vein, I'm posting another "minor but good" improvement this week. In current versions of ColdFusion, you have two ways to set cookies:
<!--more-->
<code>
&lt;cfcookie name="chocolate" expires="10" value="yum"&gt;
&lt;cfset cookie.saints = "StopBeingOverConfident"&gt;
</code>

<p>

The tag version of cfcookie allows you to set a cookie name and value as well as a set of attributes that control how long the cookie persists and how it is accessed. The script version (or the 'simple cfset' version) only allows you to set a name and value. ColdFusion sets this cookies as a session cookie which means it will go away as soon as you close your browser window.  

<p>

ColdFusion Zeus fixes this in a rather simple, and elegant way. You can still set cookies exactly the same way you do now. But if you want to specify specific attributes of the cookie, you can use a structure instead:

<p>

<code>
&lt;cfscript&gt;
cookie.age = {% raw %}{value="38", expires="never"}{% endraw %};
&lt;/cfscript&gt;
</code>

<p>

You can specify any valid value for the cfcookie tag as a name/value pair in the structure. 

<p>

So nothing earth shattering, but it's one more thing you can now do in cfscript versus tags.