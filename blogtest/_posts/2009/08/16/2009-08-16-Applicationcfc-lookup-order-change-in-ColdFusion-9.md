---
layout: post
title: "Application.cfc lookup order change in ColdFusion 9"
date: "2009-08-16T23:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/16/Applicationcfc-lookup-order-change-in-ColdFusion-9
guid: 3490
---

In previous versions of ColdFusion, the server would look for an Application.cfc (or CFM) file in the current folder. If it didn't find it, it would begin to 'crawl up' the folder hierarchy until it reaches the root of the drive. 

ColdFusion 9 adds the ability to modify this behavior. In the ColdFusion Administrator, Settings panel, you will see the following new option:

<img src="https://static.raymondcamden.com/images/Picture 253.png" />

Now the first two options make sense. The 'Default order' option is the same as the previous version of ColdFusion. The next option, 'Until webroot', will tell ColdFusion to only search until it gets to the root of the web server. The last option, 'In webroot', didn't make sense to me. 

I read it as "Only look for the file in the web root", but that is not the case. If you have an Application.cfc file in the same folder as the CFM being executed, it is still executed. What changes with this option is what happens with a deeply nested file. So consider the following folder structure: WebRoot/products/weapons/. If I execute a CFM in the weapons folder, and there is no Application.cfc file there (or .CFM of course), then ColdFusion will skip the products folder and only check WebRoot.

All in all, I'm not sure I'll use either of these two new options. I'll typically place my Application.cfc file at my project root, which is typically one folder higher than my web root. I'd have to use the default option in order for that to work.