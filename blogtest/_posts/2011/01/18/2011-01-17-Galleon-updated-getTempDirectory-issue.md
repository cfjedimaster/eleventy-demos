---
layout: post
title: "Galleon updated - getTempDirectory issue"
date: "2011-01-18T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/01/18/Galleon-updated-getTempDirectory-issue
guid: 4083
---

A <a href="http://galleon.riaforge.org">Galleon</a> user reported an odd issue when he moved his forums to a new host. All of a sudden attachment uploads stopped working. I did some debugging with him and it turned out that ColdFusion's getTempDirectory function was returning a blank value! Turns out this <i>has</i> happened to a few others, and Ben Nadel documents his run in with it <a href="http://www.bennadel.com/blog/1096-ColdFusion-GetTempDirectory-Stops-Working.htm">here</a>. I updated Galleon to default to using getTempDirectory for uploads but to allow for a specific folder in the settings file. I'll also be updating other apps in the future with a similar workaround.