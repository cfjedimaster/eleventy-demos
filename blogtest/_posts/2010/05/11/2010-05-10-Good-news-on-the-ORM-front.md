---
layout: post
title: "Good news on the ORM front"
date: "2010-05-11T08:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/05/11/Good-news-on-the-ORM-front
guid: 3814
---

I'm not sure how many of my readers subscribe to the <a href="http://groups.google.com/group/cf-orm-dev">cf-orm-dev</a> group, but I wanted to share some good news posted by Rupesh Kumar of Adobe. One of the most frustrating parts of ORM development is the lack of good error reporting in some situations. One of the worst culprits is the fact that a persistent CFC with an error will be ignored on startup. Rupesh said Adobe is working on improving this in the next update and specifically mentioned these fixes:

<ul>
<li>If there is any CFC which has compilation errors, we will throw the error upfront. We were skipping those cfc earlier, which used to cause some other Hibernate error later in the application making it difficult to debug. 
<li>In case the associated CFC (cfc in relation) is missing, we used to throw an error "Error in loading component XXX". This did not give any indication as in where this CFC is being used. We will now clearly say that in the error. 
<li>During schema generation, if the 'drop' failed because of some reason, 'create' also fails but the error would just include 'create' errors. The error details would now include all the errors during schema generation if the 'create' fails. It would have been even more helpful if the SQL could be included along with the errors here but Hibernate does not provide that. The only way to debug that would be to enable DDL logging for errors. 
<li>Error will be thrown if the sqlscript file specified does not exist 
<li>Entityreload() will throw an exception if the object being passed is not a valid entity or if it is transient 
</ul>

As you can see, these are some <i>really</i> good changes. If you see something missing, <b>please chime in</b> on the <a href="http://groups.google.com/group/cf-orm-dev/browse_thread/thread/374aa0cd977e18c5">thread</a> itself and let Adobe know.