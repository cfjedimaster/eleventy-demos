---
layout: post
title: "Model-Glue code to avoid"
date: "2007-04-03T11:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/03/ModelGlue-code-to-avoid
guid: 1938
---

Joe just <a href="http://www.firemoss.com/blog/index.cfm?mode=entry&entry=B7D4972F-3048-55C9-43EBC879822F7947">posted</a> an interesting blog concerning ways to get rendered data into the controller. While I don't agree 100% with his solution, I don't have a better idea right now. ;) 

That being said - I should point out that there <i>is</i> an API to get view data in the controller, but it does not work well and will (most likely) be removed from Model-Glue. I'm talking about the getView() method of the event object. I had trouble getting it to work right and after speaking with Joe, I'm simply going to remove it from my code and attack the problem from another route.