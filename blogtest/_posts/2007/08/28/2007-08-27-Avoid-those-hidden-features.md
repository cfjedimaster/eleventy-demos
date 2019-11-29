---
layout: post
title: "Avoid those \"hidden\" features"
date: "2007-08-28T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/28/Avoid-those-hidden-features
guid: 2307
---

I've said more than once that folks should avoid using hidden, undocumented features in ColdFusion. This warning applies especially to the ServiceFactory. Did you know that in ColdFusion 8 you can restrict access to the factory? In the settings page there is a new option: 

<blockquote>
<b>Disable access to internal ColdFusion Java components</b><br />
Disables the ability for CFML code to access and create Java objects that are part of the internal ColdFusion implementation. This prevents an unauthenticated CFML template from reading or modifying administration and configuration information for this server. 
</blockquote>

So what happens when this is enabled? Consider this simple code:

<code>
&lt;cfset monitor = createObject("java", "coldfusion.runtime.RequestMonitor") /&gt;
</code>

With the above option disabled, it runs fine, but when turned on, you will get:

<blockquote>
<h2>Permission denied for creating Java object: coldfusion.runtime.RequestMonitor.</h2>

Access to Java objects in the ColdFusion package has been disabled by the administrator.
</blockquote>

So just keep it in mind when developing. I won't deny that I've used these internal objects myself in the past, but now I avoid them like the plague. Almost anything you need (almost) is available via the Admin API anyway.