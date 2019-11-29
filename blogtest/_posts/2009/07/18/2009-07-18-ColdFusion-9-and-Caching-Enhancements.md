---
layout: post
title: "ColdFusion 9 and Caching Enhancements"
date: "2009-07-18T15:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/18/ColdFusion-9-and-Caching-Enhancements
guid: 3449
---

Yesterday Terrence Ryan <a href="http://www.terrenceryan.com/blog/index.cfm/2009/7/17/Caching-Enhancements-in-ColdFusion-9">blogged</a> about updates to the cfcache tag in ColdFusion 9. I thought I'd follow up on his blog post and talk a bit more about the other caching changes in ColdFusion 9, specifically, the new cache based functions.
<!--more-->
First, here is a quick list of <i>all</i> the functions, just to give you a mile high view of what's available. For complete descriptions, please see the <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/index.html">CFML9 Reference</a>.

<ul>
<li>cachePut: Puts an item in the cache.
<li>cacheGet: Gets an item from the cache. What isn't documented is that if you ask for an item that isn't in the cache, you get a null value back. I'll show how to work around that.
<li>cacheRemove: Forces an item out of the cache. Supposedly, the poor data is stripped of it's home, belongings, and job, and then forced to sell coffee at a gas station.
<li>cacheGetAllIds: Returns a lit of all the IDs in your cache. These are in upper case!
</ul>

Ok, so that's your basic CRUD functions for caching. Along with those functions you have:

<ul>
<li>cacheGetMetadata: Returns detailed information about one item in a cache. This is great for checking to see how much your cached information is actually hit. If it isn't hit too often, then maybe it isn't worth caching? if it's hit a lot, then maybe it's worth increasing the lifespan?
<li>cacheGetProperties: Returns information about the caching system as a whole (well, for your application). Can be focused on either object cache (what I'm discussing), the template cache (what Terry showed with the cfcache tag), or both.
<li>cacheSetProperties: Allows you to specify cache settings at a high level. 
</ul>

Alright, everyone with me so far? Let's begin with a super simple, but full feature example. This code will check to see if my stuff is cached and retrieve it is so, or set the value in the cache. It also provides programmatic access to clear the cache.

<code>
&lt;cfif structKeyExists(url, "clear")&gt;
	&lt;cfset cacheRemove("slowprocess")&gt;
&lt;/cfif&gt;

&lt;cfif not arrayFindNoCase(cacheGetAllIds(), "slowprocess")&gt;
	&lt;!--- fake slow ---&gt;
	&lt;cfset sleep(1000)&gt;
	&lt;cfset data = now()&gt;
	&lt;cfset cachePut("slowprocess", data, createTimeSpan(0,0,0,30))&gt;
&lt;cfelse&gt;
	&lt;cfset data = cacheGet("slowprocess")&gt;
&lt;/cfif&gt;

&lt;cfoutput&gt;
&lt;p&gt;
Result is #data#
&lt;/p&gt;
&lt;p&gt;
&lt;a href="test1.cfm?clear=yes"&gt;Clear Cache&lt;/a&gt;
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

So going from the top to the bottom, here is what we have. I added a URL 'hook' on top to look for the request to clear the cache. cacheRemove works just as simple as that. You can also pass in a list of IDs to clear a bunch of cached items at once. 

Next up is the core caching system. Unfortunately, there is no simple cacheExists function (here is my <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=76159">ER</a>). You can use cacheGetAllIds along with the new arrayFindNoCase() function to see if the item exists in cache. (I used arrayFindNoCase as the array returns the keys in upper case.) If the item isn't found, we run our slow process and stuff it in. When you store an item in the cache, you have 3 options for how long it will persist. 

If you don't specify any value for the timespan, it will last as long as the application exists. You can specify a timespan, as I have above. And lastly, you can also specify an idleTime value. This allows you to say, "if the cache isn't used in this amount of time, kill it, no matter what the timespan is."

The other part of the CFIF is simple - just get the item from the cache. Next I display the result. Finally, I added a link so I could easily clear the result. 

You can view a live demo of this <a href="http://cf9.coldfusionjedi.com/caching/test1.cfm">here</a>. Obviously with multiple people hitting it and clearing, the results will be random. Just like life. Wonderful. 

Let's look at one more example. Here is a super simple way to report on all items in the cache. It simply loops over the IDs and runs cacheGetMetaData():

<code>
&lt;cfloop index="cache" array="#cacheGetAllIds()#"&gt;

	&lt;cfdump var="#cacheGetMetadata(cache)#" label="Cache Metadata for #cache#"&gt;
	
&lt;/cfloop&gt;
</code>

You can view this <a href="http://cf9.coldfusionjedi.com/caching/test2.cfm">here</a>. Notice that it returns some pretty interesting information. If you see nothing, it means the earlier cache died out. Since my application has one item in the cache, you may end up with no results. Simply visit the <a href="http://cf9.coldfusionjedi.com/caching/test1.cfm">first</a> demo again and then reload. 

You may be wondering - where exactly is this information being stored? If my application caches something called Ray (and yes, I encourage all developers to use Ray as their cache keys, my ego needs constant inflating!), what happens if another one uses the same key? Well luckily, all caching APIs are based on the current application. Rename your application and the cache will go away. (Err, well, not technically. It's still there. If you switch back you will have access to the old cache.) 

That leaves us with some interesting questions. How would I handle using this system with session based data? If I common use a URL hook to restart my application, how do I take care of the cache? I'll cover those in my next entry. 

I'll also remind folks - caching should not, in general, be your first fix to a slow process. Your first fix should be to try to speed the darn thing up. There is a good chance that the process is slow because of some inefficiency that could be addressed through coding instead of simply "hiding" it with a cache. Let's be honest though. We don't always have the time to spend tweaking our code to squeeze out more performance. Also, even if some process isn't necessarily slow per se, if we can cache the result for the lifespan of the application, why not? The flip side to that is that we may need to monitor the size the cache as well. I'm planning a third blog entry that will look at the values returned from cacheGetProperties and talk about what they mean for your server and your application.