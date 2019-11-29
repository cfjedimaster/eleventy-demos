---
layout: post
title: "Using ColdFusion 9's Caching Feature? Watch your keys"
date: "2011-06-22T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/22/Using-ColdFusion-9s-Caching-Feature-Watch-your-keys
guid: 4277
---

About a week or so ago <a href="http://blog.dkferguson.com/index.cfm">Dave Ferguson</a> (who has been leading up development of the mobile version of <a href="http://www.blogcfc.com">BlogCFC</a> did some work to the "version service" used by BlogCFC installs. Whenever you first enter the administrator of BlogCFC the code does a http ping to a central service to check and see if a new version is available. (That by itself is not the point of this blog entry so if folks want an explanation of that, just ask.) Previously the code was static and I had to update it as part of my release cycle. Dave did some nice work to make it completely automated. But afterwards, I began to get an error from it.
<!--more-->
<p/>

I couldn't understand why. His code was simple. Check the cache (using cacheGet) and if it was empty, load up some data from RIAForge. Here is a snippet to give you an idea:

<p/>

<code>
&lt;cfset versionInfo = cacheGet("versionInfo")&gt;
&lt;cfif isNull(versionInfo) or structKeyExists(url, "reinit")&gt;
	&lt;cftry&gt;
		&lt;cfhttp url="http://www.riaforge.org/index.cfm?event=xml.userprojects&uid=15" timeout="5"&gt;
</code>

<p/>

The data in the cache was a structure with 3 keys. The error I received was just for one key that mysteriously did not exist. If I forget a refresh on the cache (you can see there the URL hook to do so), it immediately went away. Then - sometime later - the error would return.

<p/>

Then it occurred to me. What if versionInfo as a cache name was being used elsewhere? I did a quick search of the code base for blogcfc.com (the marketing site, not the blog engine) and right away discovered that not only was there another bit of code using the same cache name, it was using similar code as well. It's why I ended up with a struct that had 2 of the same key names.

<p/>

*sigh*

<p/>

So how would you avoid this? At my current job, I like to call some times of code "red flag" issues. Basically, if you do X, you need to let the rest of the team know. That involves things like adding or updating JavaScript libraries,  modifying Application.cfc, or even adding new Session variables. In a large application, if you use session.name to represent something, are you sure some other part isn't using "name" as well in the Session scope? In this particular case, a more precise naming scheme could have helped. I ended up changing it to versionSystemInfo, but I could have gone with "remoteSystemUpdateInfo". Yeah that's a bit long, but as you can see, I copy it right away into a local variable. This is one of those things where it may make sense to keep a simple text file in your project directory. Every time you make use of the cache, list the name and possibly the reason. 

<p/>

What about a runtime utility like cacheGetIds? That's helpful, but it's also possible you have a CFM that hasn't been run yet. There may be a 'branch' of your code that isn't run often (and therefore caches itself) that may be be missed by a call to cacheGetIds. (Although to be clear, I strongly recommend using the functions that inspect your cache. They can help monitor how large your cache is and - more importantly - how effective it is.)

<p/>

Anyway - I hope this helps.