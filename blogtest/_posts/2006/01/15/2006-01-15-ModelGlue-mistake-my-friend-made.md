---
layout: post
title: "Model-Glue mistake my \"friend\" made..."
date: "2006-01-15T14:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/15/ModelGlue-mistake-my-friend-made
guid: 1029
---

So - there was this friend of mine. Let's call him "Bob." Bob really loves <a href="http://www.model-glue.com">Model-Glue</a>. He thinks its the bees knees. However - he ran into a weird problem this morning. He would hit Model-Glue site A, and it would work. He would hit Model-Glue site B, and it would work. (This was all on his local machine.) He would then hit A again but see the content from B!

At first he thought it was a weird Apache Rewrite error. But even after disabling the rewrites, he still go the error. Then all of a sudden something occurred to him. He turned on debugging in Model-Glue site B and noticed it showed up in A as well. He then checked the Application.cfm files - both of which he had copied from the default MG template site.

Yep - both had the <i>exact</i> same Application name! In Model-Glue apps,  you almost never mess with the Application.cfm file. Therefore it never occurred to him to change the name of the application.

Whew - that "Bob" is certainly a bit slow...

By the way - a little birdie told me that the new version of <a href="http://www.cflib.org">CFLib</a>, with CFCs and Custom Tags, is back in development again, and come Hell or high water, it will launch before summer.