---
layout: post
title: "ColdFusion Builder 2 - View bug"
date: "2011-05-13T09:05:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2011/05/13/ColdFusion-Builder-2-View-bug
guid: 4230
---

Credit for this find goes to Adobe. I was recently working with an extension that created views and ran into a frustrating issue. Even though I was using toolbars, the toolbars would not show up. I dropped that extension for a while and later tried working on another extension. Once again I ran into an issue - this time with the icon attribute. (This creates a little icon to the left of your view title.)

Adobe discovered that there is a bug by where the views you create will cache their rendering chrome. By that I mean the toolbars and icon, not the stuff <i>in</i> the view. The bug bites you when you create a view that does not use these options and then modify it later. 

To fix it, simply change the ID value of your view window. There is a bug logged for this already (you can view/vote for it <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=2872436">here</a>) but luckily this is easy enough to get around.