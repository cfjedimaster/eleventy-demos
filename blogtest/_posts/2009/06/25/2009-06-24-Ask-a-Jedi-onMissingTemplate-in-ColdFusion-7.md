---
layout: post
title: "Ask a Jedi: onMissingTemplate in ColdFusion 7?"
date: "2009-06-25T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/25/Ask-a-Jedi-onMissingTemplate-in-ColdFusion-7
guid: 3406
---

Craig asks:

<blockquote>
<p>
Do you know how to handle MissingTemplate errors on the application level in CF7.  I know CF8 has a new application function onMissingTemplate() that handles this but am having difficulties with this in CF7.
</p>
</blockquote>

So Craig is right - this support is something that was added to ColdFusion 8, not 7. You can certainly add it to your Application.cfc but it won't fire automatically. (Folks, don't forget that Application.cfc can include additional methods!) 

In ColdFusion 7, the only option you have similar is the Missing Template handler in the ColdFusion Administrator:

<img src="https://static.raymondcamden.com/images//Picture 166.png">

This is server wide, and unlike onMissingTemplate, you can't do processing before the file itself is loaded. So for example, if you want to say that any missing template with "store" in the URL should point to store.foo.com, you would need to put that logic within your CFM. 

You do have access to the requested template information - but not via an explicit passed in arguments but rather the CGI scope instead. 

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 242.png">

So - it isn't quite as nice as onMissingTemplate, but it's something. I'm convinced that simply ignoring 404 requests is one of the biggest mistakes you can make on a web site (and I admit to this as well!).