---
layout: post
title: "Fun way to break attributeCollection in ColdFusion 8"
date: "2007-07-21T17:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/21/Fun-way-to-break-attributeCollection-in-ColdFusion-8
guid: 2209
---

Ok, so I love the new attributeCollection feature of ColdFusion 8. Here is a simple example:

<code>
&lt;cfset s = {% raw %}{url="http://cnn.com", result="result"}{% endraw %}&gt;
&lt;cfhttp attributeCollection="#s#"&gt;
</code>

But for the heck of it, I tried something a bit crazy:

<code>
&lt;cfset s = {% raw %}{url="http://cnn.com", result="result"}{% endraw %}&gt;

&lt;cfset s.attributeCollection=structNew()&gt;
&lt;cfhttp attributeCollection="#s#"&gt;
</code>

I wasn't sure what it would do. My guess is that it would apply attributeCollection as an attribute and complain that it wasn't valid. Or I thought maybe it work recursively. Well, not sure if "recursive" is right - but I thought it would apply the top level struct as attributes, then <i>reapply</i> the empty attributeCollection struct. 

Nope - it just throws a JRun Servlet Error. So a total waste of time - but I thought I'd share.