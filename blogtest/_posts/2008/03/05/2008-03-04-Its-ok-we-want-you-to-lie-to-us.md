---
layout: post
title: "It's ok - we want you to lie to us..."
date: "2008-03-05T11:03:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2008/03/05/Its-ok-we-want-you-to-lie-to-us
guid: 2691
---

I'm was looking at a page in the Yahoo Developer network when I ran across this snippet:

<a href="http://developer.yahoo.com/shopping/V2/catalogListing.html">Documentation for Yahoo Shopping Web Services</a><br />

<blockquote>
<p>
When calling the shopping APIs, you must set the HTTP user agent to a valid web browser string. Bot and spider strings are not valid. The user agent can be set to some default value - it does not have to be changed based on the user's browser. Some examples are as follows:

* Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1) (for IE)<br />
* Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.0.1) Gecko/20060111 Firefox/1.5.0.1 (for FireFox)

If a valid user agent is not set, no results will be returned. A 400 HTTP status code will be returned, along with an error message indicating that the user agent is not valid.
</p>
</blockquote>

So... you build a service API meant to be called remotely via some computer program. Yet at the same time, you demand that we act like a real browser and change our user agent string. I'm trying to wrap my head around <i>why</i> Yahoo would do this. If they want to prevent someone from scraping <i>all</i> of their data - they already have a rate limit in place that would stop that. This seems like a pointless thing to ask.

On a whim I gave it a quick try in ColdFusion. The default useragent sent by ColdFusion <b>is</b> blocked. I then tried a few random useragents (not the ones they documented) and I was able to guess one (Opera, even Opera Baby, but not Baby Opera) quickly enough.

So again - can someone figure a reason for this?