---
layout: post
title: "Quick BlueDragon/Galleon Tip"
date: "2008-03-25T11:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/03/25/Quick-BlueDragonGalleon-Tip
guid: 2726
---

I was testing <a href="http://galleon.riaforge.org">Galleon</a> under BlueDragon 7.0.1 and ran into an odd issue. My queries were being returned with the aliases ignored. Ie, I'd do

select foo as goo<br/>
from zoo

And the result query would have a foo column, not goo. 

Turns out this is a known issue with the MySQL connector, and Lori from NA posted a fix <a href="http://forums.newatlanta.com/messages.cfm?threadid=3649010C-29AC-4980-BA8B720D5DD5E683">here</a>.