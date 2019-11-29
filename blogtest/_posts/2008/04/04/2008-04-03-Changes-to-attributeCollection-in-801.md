---
layout: post
title: "Changes to attributeCollection in 8.0.1"
date: "2008-04-04T01:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/04/Changes-to-attributeCollection-in-801
guid: 2750
---

Ok, now that you've all downloaded 8.0.1 (in the last 5 minutes) and had a chance to play with it, I'm going to do a few blog entries about some of the new features in 8.0.1. ColdFusion 8 added the ability to use attributeCollection to ColdFusion built in tags. In case you never played with that feature (it's been around for a while in custom tags and cfinvoke), it allows you to dynamic define attributes for a tag. Consider:

<code>
&lt;cfset s = structNew()&gt;
&lt;cfset s.file = expandPath("./test.cfm")&gt;
&lt;cfset s.action = "read"&gt;
&lt;cfset s.variable = "r"&gt;

&lt;cffile attributeCollection="#s#"&gt;
&lt;cfoutput&gt;#htmlCodeFormat(r)#&lt;/cfoutput&gt;
</code>

This can be useful when you have to do different types of operations based on your business logic. It can save you from writing a lot of CFIF statements. For example, consider cfmail. You could dynamically add security attributes (for the server) instead of having to provide it in the core tag.

Ok - so that's ColdFusion 8. CF 8.0.1 expands on this by allowing you to add <i>any</i> attribute. So for example:

<code>
&lt;cfset s = structNew()&gt;
&lt;cfset s.file = expandPath("./test.cfm")&gt;
&lt;cfset s.action = "read"&gt;
&lt;cfset s.variable = "r"&gt;
&lt;cfset s.frankie = "goestohollywood"&gt;

&lt;cffile attributeCollection="#s#"&gt;
&lt;cfoutput&gt;#htmlCodeFormat(r)#&lt;/cfoutput&gt;
</code>

Obviously frankie is not a valid attribute to cffile, but in 8.0.1, this will be ignored when passed through attributeCollection. You can disable this in the ColdFusion Admini, or in Application.cfc, and even in the structure itself.

So why would you do this? You may have common attributes that you want to share in a structure and pass to multiple tags. 

Now I have to admit - when I first heard of this feature, I fought against it. I thought it was a bad idea. I was overruled (in a big way ;) so I'm curious to see what others think. I'm definitely more open to it now - but while I've used attributeCollection in the past, I haven't used it much at all yet in core CF tags, so this isn't a big deal to me now.

Anyone planning on using this?