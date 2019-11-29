---
layout: post
title: "Ask a Jedi: Question about CFC Security"
date: "2008-02-14T15:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/14/Ask-a-Jedi-Question-about-CFC-Security
guid: 2652
---

Timothy asks:

<blockquote>
<p>
Are there security advantages to having cfc's located outside of the webroot in the gateway/cfc folder accessed through a mapping compared to having the cfc's reside inside the specific project in the webroot?
</p>
</blockquote>

In general the only thing you have to worry about are people invoking your CFCs remotely. CFC methods, if you do not specify an access setting, will default to public, which means they can't access them remotely. So in order for your CFC to be insecure, you would have to go out of your way to set the method to remote. 

Now with that being said - I view CFCs as resources like includes and custom tags, and therefore they have no place under web root anyway. Moving them out is better (imho) for organization. You can still provide a remote facade using proxy CFCs as services.