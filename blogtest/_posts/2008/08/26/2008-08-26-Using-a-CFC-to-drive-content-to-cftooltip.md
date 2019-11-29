---
layout: post
title: "Using a CFC to drive content to cftooltip"
date: "2008-08-26T11:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/26/Using-a-CFC-to-drive-content-to-cftooltip
guid: 2988
---

An AJAX quickie for you this morning. A user asked if it was possible to use a CFC to drive content to cftooltip. He had noticed that unlike other AJAX UI items, the cftooltip doesn't let you use a bind to point to a CFC/JavaScript/URL source. It only provides one argument - sourceForTooltip. 

This does not mean, however, that you can't use a CFC. Do no forget CFCs under web root can still be accessed via URL. Here is a very simple example:

<code>
&lt;cftooltip sourceForTooltip="test.cfc?method=getsource&returnFormat=plain"&gt;
The content to be wrapped. The content to be wrapped.&lt;br /&gt;
The content to be wrapped. The content to be wrapped.
&lt;/cftooltip&gt;
</code>

All I've done here is point to a CFC in my URL. The method argument just tells the server which CFC method to run. The returnFormat is important. If you leave this off, the result will be a WDDX string. Now this actually rendered ok in my browser, but you really want to use the returnFormat=plain to ensure a non-encoded response.