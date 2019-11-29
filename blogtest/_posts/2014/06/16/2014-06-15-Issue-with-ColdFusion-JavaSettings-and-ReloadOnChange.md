---
layout: post
title: "Issue with ColdFusion JavaSettings and ReloadOnChange"
date: "2014-06-16T09:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/06/16/Issue-with-ColdFusion-JavaSettings-and-ReloadOnChange
guid: 5245
---

<p>
Just a quick note that one of Adobe's ColdFusion team members has discovered a bug with javaSettings. If you don't remember, javaSettings is a way to dynamically load JAR files for a ColdFusion application. This allows you to skip using the CF Admin to work with Java classes. The bug is simple. If you use reloadOnChange:true, which is something you would only do in development anyway, then ColdFusion <i>may</i> have an issue loading the files correctly. To get around this, simply set that value to false, and restart CF. Yes, that is a bit annoying if you are <i>writing</i> the Java classes, but if you are just using some you downloaded, then it is a one-time annoyance. You still get to keep your Java files within your application folder so that's good too. I've filed a <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3776450">bug report</a> for this so feel free to vote/comment on it.
</p>