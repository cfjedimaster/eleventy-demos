---
layout: post
title: "ColdFusion mapping names and conflicts"
date: "2007-09-10T08:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/10/ColdFusion-mapping-names-and-conflicts
guid: 2332
---

This weekend a reader asked me an interesting question about ColdFusion mappings. Imagine the following two mappings:

<ul>
<li>Mapping /org points to /Webserver/Webroot
<li>Mapping /org/foo points to /projects/foo.com
</ul>

He was curious to know if this would work right. The second mapping looks to be under org, but really points to a completely different path. I didn't know the answer to this. Every single mapping I've used in the past has always had a simple name, like /org or /foo. 

I whipped up a quick test with two mappings named like the examples above. I put the same named CFC in each, but with different methods. I then wrote a quick script:

<code>
&lt;cfset test = createObject("component","a.test")&gt;

&lt;cfdump var="#test#"&gt;

&lt;cfset test = createObject("component","a.b.test")&gt;

&lt;cfdump var="#test#"&gt;
</code>

The results showed that there was no problem having mappings with similar names in completely different folders. ColdFusion treats the mapping name as just a simple string. The fact that one was a and one was a/b didn't imply anything special to the server.

The problem - though - would be that if someone put a physical folder named "b" under the folder that my "a" mapping pointed to - there would be a conflict. Which would win? The mapping. I would definitely recommend having mapping names that did not match up like the examples aboe.