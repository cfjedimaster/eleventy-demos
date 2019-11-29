---
layout: post
title: "Important Model-Glue note, and CanvasWiki update"
date: "2009-07-16T12:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/16/Important-ModelGlue-note-and-CanvasWiki-update
guid: 3445
---

I'll be honest and say this is entirely my fault - it was mentioned on the Model-Glue <a href="http://groups.google.com/group/model-glue">listserv</a> which I don't read as often as I should - but folks should know that the latest build of Model-Glue will possibly break existing Model-Glue applications if you use the Trace() functionality.

Trace() was part of the <a href="http://docs.model-glue.com/wiki/ReferenceMaterials/EventApi#EventAPI">Event API</a> but conflicted with the built in Trace() method for ColdFusion 9. This has been renamed in Model-Glue to addTraceStatement(). (Note, the <a href="http://docs.model-glue.com">docs</a> for Model-Glue have not been updated yet. I'll be doing that as soon as I 'hang up' here.) 

This probably won't bite too many people as Trace() was really meant for debugging. This <i>did</i> however impact <a href="http://canvas.riaforge.org">CanvasWiki</a>. A contributor had used it a bit and I never removed them. I've updated the code base to fix this, and I've also checked in other updates as well. Nothing feature-wise, but mainly updates to make it run better with Model-Glue 2. Canvas was written for Model-Glue 1 and so it had a bunch of old 'style' things that didn't need to be there. I encourage all users to update to this newest version.