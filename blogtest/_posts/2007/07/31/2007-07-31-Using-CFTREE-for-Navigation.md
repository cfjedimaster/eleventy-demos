---
layout: post
title: "Using CFTREE for Navigation"
date: "2007-07-31T11:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/31/Using-CFTREE-for-Navigation
guid: 2238
---

A user on cf-talk today asked if it was possible to use ColdFusion 8's new HTML CFTREE as a navigation tool. Turns out it is rather simple, and like most things in ColdFusion, there are multiple solutions.

First off - when you use the HREF attribute of CFTREEITEM, you are allowed to use JavaScript. One simple solution would be to just do:

<code>
&lt;cftreeitem display="products" href="javaScript:doProducts('...')"&gt;
</code>

You could use document.href.location to move the entire page, or use the new ColdFusion.navigate function to load a URL into a UI item like a CFDIV or CFWINDOW.

While that works ok for static, hard coded trees, it isn't a good solution for dynamic trees, and, it can be done simpler if you just bindings. Consider this example:

<code>
&lt;cfform name="form"&gt;

&lt;cftree format="html" name="mytree"&gt;
	&lt;cftreeitem display="Navigation" value="root"&gt;
	&lt;cftreeitem display="Page A" parent="root" value="a"&gt;
	&lt;cftreeitem display="Page B" parent="root" value="b"&gt;
&lt;/cftree&gt;
&lt;/cfform&gt;

&lt;cfdiv bind="url:content.cfm?value={% raw %}{mytree.node}{% endraw %}" /&gt;
</code>

I've built a simple tree with one main node and two child nodes. I then added a CFDIV that is bound to the tree. When binding to a tree, you can get two values: node and path. Node returns just the value for the selected item. Path returns the path of the node itself. Thanks to <a href="http://cfsilence.com/blog/client/index.cfm">Todd Sharp</a> for finding these values in the docs. 

p.s. As a side question - who would like to see an API doc that covers stuff like this? I wasn't able to find it in the reference and it was hard to find in the developers guide. I'd like a guide that more clearly describes working with ColdFusion's new UI elements.