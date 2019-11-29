---
layout: post
title: "Using ColdFusion to find the RSS URL from a web site"
date: "2010-12-09T13:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/12/09/Using-ColdFusion-to-find-the-RSS-URL-from-a-web-site
guid: 4049
---

Many web sites now include a simple way to autodiscover the RSS feed for the site. This is done via a simple LINK tag and is supported by all the modern browsers. You should see - for example - a RSS icon in the address bar at this blog because I have the following HTML in my HEAD block:

<p>

<code>
&lt;link rel="alternate" type="application/rss+xml" title="RSS" href="http://feedproxy.google.com/RaymondCamdensColdfusionBlog" /&gt;
</code>

<p>

I was talking to <a href="http://www.cfsilence.com/blog/client">Todd Sharp</a> today about how ColdFusion could look for this URL and I came up with the following snippet.
<!--more-->
<p>

<code>

&lt;cfset urls = ["http://www.raymondcamden.com", "http://www.coldfusionbloggers.org", "http://www.androidgator.com", "http://www.cfsilence.com/blog/client"]&gt;

&lt;cfloop index="u" array="#urls#"&gt;
    &lt;cfoutput&gt;Checking #u#&lt;br/&gt;&lt;/cfoutput&gt;
    
    &lt;cfhttp url="#u#"&gt;
    &lt;cfset body = cfhttp.fileContent&gt;
	&lt;cfset linkTags = reMatch("&lt;link[^&gt;]+type=""application/rss\+xml"".*?&gt;",body)&gt;
	&lt;cfif arrayLen(linkTags)&gt;
	    &lt;cfset rssLinks = []&gt;
	    &lt;cfloop index="ru" array="#linkTags#"&gt;
	        &lt;cfif findNoCase("href=", ru)&gt;
	            &lt;cfset arrayAppend(rsslinks, rereplaceNoCase(ru,".*href=""(.*?)"".*", "\1"))&gt;
	        &lt;/cfif&gt;
	    &lt;/cfloop&gt;
		&lt;cfdump var="#rsslinks#" label="RSS Links"&gt;
	&lt;cfelse&gt;
	    None found.
	&lt;/cfif&gt;
	&lt;p/&gt;
&lt;/cfloop&gt;
</code>

<p>

The snippet begins with a few sample URLs I used for testing. We then loop over each and perform a HTTP get. From this we can then use some regex to find link tags. You can have more than one so I create an array for my results and append to it the URLs I find within them. Nice and simple, right? You could also turn this into a simple UDF:

<p>

<code>
&lt;cfscript&gt;
function getRSSUrl(u) {
    var h = new com.adobe.coldfusion.http();
    h.setURL(arguments.u);
    h.setMethod("get");
    h.setResolveURL(true);
    var result = h.send().getPrefix().fileContent;
	var rssLinks = [];
	var linkTags = reMatch("&lt;link[^&gt;]+type=""application/rss\+xml"".*?&gt;",result);
	
	if(arrayLen(linkTags)) {
	    var rssLinks = [];
	    for(var ru in linkTags) {
	        if(findNoCase("href=", ru)) arrayAppend(rsslinks, rereplaceNoCase(ru,".*href=""(.*?)"".*", "\1"));
	    }
	}
	return rssLinks;    
}
&lt;/cfscript&gt;
</code>

<p>

Not sure how useful this is - but enjoy!