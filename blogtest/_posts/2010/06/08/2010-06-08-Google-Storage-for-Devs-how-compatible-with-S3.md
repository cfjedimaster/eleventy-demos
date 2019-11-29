---
layout: post
title: "Google Storage for Devs - how compatible with S3?"
date: "2010-06-08T14:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/06/08/Google-Storage-for-Devs-how-compatible-with-S3
guid: 3840
---

Earlier this week I got access to <a href="http://code.google.com/apis/storage/">Google Storage for Developers</a>, Google's answer to Amazon S3. I was looking over the <a href="http://code.google.com/apis/storage/docs/developer-guide.html">developer's guide</a> when I came across this little nugget:
<!--more-->
<p>

<blockquote>
Google Storage is interoperable with a large number of cloud storage tools and libraries that work with services such as Amazon Simple Storage Service (Amazon S3) and Eucalyptus Systems, Inc. To use these tools and libraries, all you have to do is change the request endpoint (URI) that the tool or library uses so it points to the Google Storage URI, and configure the tool or library to use your Google Storage developer keys.
</blockquote>

<p>

Oh yeah? I've been using Joe Danziger's <a href="http://amazons3.riaforge.org/">Amazon S3 REST Wrapper</a> from RIAForge to provide S3 support to the <a href="http://groups.adobe.com">Adobe Groups</a> site. I took that CFC and did a quick replace on the Amazon URL with the Google URL and.... it worked. Nice! Here is a quick template I created:

<p>

<code>
&lt;cfset g3 = new g3("itsnotthiseasyinphp","orruby")&gt;
&lt;cfset buckets = g3.getBuckets()&gt;
&lt;cfdump var="#buckets#" label="My buckets"&gt;

&lt;p/&gt;

&lt;cfset files = g3.getBucket(buckets[1].name)&gt;
&lt;cfdump var="#files#" label="Files in bucket 1"&gt;

&lt;p&gt;

&lt;cfset link = g3.getObject(buckets[1].name, files[1].key)&gt;
&lt;cfoutput&gt;&lt;img src="#link#"&gt;&lt;/cfoutput&gt;
</code>

<p>

And the result:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-06-08 at 12.20.07 PM.png" title="Screen Shot" />

<p>

Pretty nice to see the service working so easily so far. I haven't yet dug enough to know how Google's service is better than S3 (if it is), but I do like that they provide a nice web based interface out of the box. 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-06-08 at 12.22.44 PM.png" title="Another Screen Shot" />

<p>

Anyone else planning to make use of Google Storage?