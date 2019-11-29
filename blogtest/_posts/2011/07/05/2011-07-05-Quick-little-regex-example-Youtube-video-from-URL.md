---
layout: post
title: "Quick little regex example - Youtube video from URL"
date: "2011-07-05T18:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/07/05/Quick-little-regex-example-Youtube-video-from-URL
guid: 4295
---

I'm almost scared to post this. Every time I post a regex example I typically get about 200 comments showing sexier, smaller, faster examples, but at the same time, I like good (and practical) examples like this. This is why regex was built! So - what's the example? Given a simple URL with a Youtube video ID in it, how do you extract just the ID? Here's the URL:
<!--more-->
<p/>

<code>
http://www.youtube.com/watch?v=f89niPP64Hg
</code>

<p/>

Now - you could just treat that as a list and listLast it, but we don't know if there will ever be any additional URL parameters. What we really want is the value of "V". Here is the regex I used:

<p/>

<code>
.*?v=([a-z0-9\-_]+).*
</code>

<p/>

And here is a complete code template:

<p/>

<code>
&lt;cfset u = "http://www.youtube.com/watch?v=f89niPP64Hg&gt;
&lt;cfset videoid = reReplaceNoCase(u, ".*?v=([a-z0-9\-_]+).*","\1")&gt;
&lt;cfoutput&gt;#u#, id=#videoid#&lt;/cfoutput&gt;
</code>

<p/>

Note that this not work with Youtube's short url version: http://youtu.be/f89niPP64Hg. For that, if I found youtu.be in the URL I'd probably just listLast with / as the delimiter.