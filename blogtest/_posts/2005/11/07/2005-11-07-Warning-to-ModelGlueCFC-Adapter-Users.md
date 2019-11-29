---
layout: post
title: "Warning to ModelGlue/CFC Adapter Users"
date: "2005-11-07T18:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/07/Warning-to-ModelGlueCFC-Adapter-Users
guid: 902
---

Note - this is conjecture. I've seen it on my machine, and I had someone confirm on IRC. Two people experiencing a problem does not make it true - but I thought I'd share in case others run into this.

This morning I installed the both the roll up hot fix for CF as well as the new CFC Adapter that was released to work with the latest roll up hot fix. I had some issues. (In fact, I still do, and I'm working with Macromedia to get the adapter working on my Apache system under port 80.)

Anyway - later on in the day I noticed my ModelGlue application wasn't runing. I kept getting:

<code>
The value returned from function init() is not of type ModelGlue.Core.Controller.
</code>

This would happen after my controller would do super.Init().

I thought maybe I had broken something - but as I rolled stuff back, it didn't help. Then Sean Corfield suggested removing the CFC Adapter jar. I did that - and immidiately (well, after a restart), my MG app started working again.

I'll post more as I figure out more.