---
layout: post
title: "Railo 3 and the Cluster Scope"
date: "2008-07-07T08:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/07/Railo-3-and-the-Cluster-Scope
guid: 2918
---

This is just a quick note to point out the example on the Railo Blog on their cluster scope:

<a href="http://www.railo.ch/blog/index.cfm/2008/7/6/Cluster-Scope">Railo Blog: Cluster Scope</a>

Read the blog entry for details, but basically it boils down to server A registering server B and vice versa. After which you can then use Cluster as a scope on either machine. Set cluster.x to 1 on machine A and machine B can read it. What's impressive is that you can also use the admin to determine if the updates have failed.