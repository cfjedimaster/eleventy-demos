---
layout: post
title: "cfcache and errors"
date: "2011-02-28T13:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/28/cfcache-and-errors
guid: 4141
---

Earlier today @jamesahull asked on Twitter about the relationship between cfcache and errors. For folks who have not used cfcache, this is an old feature of ColdFusion that allows for quick and dirty page caching. Prior to ColdFusion 9 you could literally just add a cfcache tag to the top of a page and get instant caching. It wasn't terribly useful for user-specific pages (although you could use a client-side cache if you wanted) and it wouldn't work at all on pages based on Form fields, but it would handle URL-dynamic pages just fine. Again - as long as you wanted the <i>entire</i> page cached. 

<p>
<!--more-->
<p>

ColdFusion 9 improved the tag by providing access to the new ehcache-based caching system as well as allowing for page fragements and the storage of pure data. I really don't make use of cfcache though. I much prefer the more direct cache functions. That being said there are still people who may prefer the tag for it's simplicity. @jamesahull was curious about errors and cfcache so I decided to take a quick look at how the tag handles it. Let's look at this template:

<p>

<code>
&lt;cfcache timespan="#createtimespan(0,0,1,0)#" usequerystring="true"&gt;

&lt;cfoutput&gt;
Generated at #now()#.&lt;br/&gt;
The value of url.x is #url.x#
&lt;/cfoutput&gt;
</code>

<p>

I've got a simple template that caches for one minute. (<b>Notice - the usequerystring="true" attribute is required in ColdFusion 9 to get the tag to cache based on the query string. This is a difference in backwards compatability as described by Forta in his <a href="http://forta.com/blog/index.cfm/2011/1/10/ColdFusion-9-And-CFCACHE-Backwards-Compatibility">blog post</a>.</b>)  I then output the current time and the value of URL.x. If I visit this page without passing ?x=something in the URL I get...

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip33.png" />

<p>

What's surprising is that this error is actually cached. From what I know cfcache performs a HTTP hit to fetch and cache the result. You would think it would notice the error and refuse to cache it. Maybe there is a good reason for it to cache anyway - but as I said - surprising.

<p>

Of course, all of this is fixed with approximately 30 seconds or so of error handling. (See my <a href="http://www.coldfusionjedi.com/index.cfm/2007/12/5/The-Complete-Guide-to-Adding-Error-Handling-to-Your-ColdFusion-Application">guide</a> for tips on that.) As a general rule of practice, any time you work with a scope that is user manipulatable (URL, Form, CGI, Cookie), you want to ensure you do <b>not</b> trust the data. At minimum a quick cfparam on top to set a default value would have sufficed.