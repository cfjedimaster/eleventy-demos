---
layout: post
title: "Small (very small) ColdFusion 9 leak"
date: "2009-04-01T18:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/01/Small-very-small-ColdFusion-9-leak
guid: 3300
---

Forgive me for posting something actually useful today, but I thought I'd comment on the recent Adobe <a href="http://www.adobe.com/devnet/facebook/?devcon=f1">Facebook Developer Center</a>. While it - unfortunately - only focuses on Flash, do not forget that another Adobe product (ColdFusion :) also can integrate with Facebook as well. (I'm being a bit sarcastic. Adobe does know and will hopefully update their new Center with this link.) I wrote an article about this late last year: <a href="http://www.adobe.com/devnet/coldfusion/articles/coldfusion_facebook.html">Developing Facebook applications with ColdFusion</a>.

So the leak? In my article I talk about an ... unfortunate issue with Facebook/ColdFusion integration. Certain form fields trigger automatic validation on the ColdFusion server. This is an <i>ancient</i> rarely used feature. Most of the time people just change their forms when they run into it, but you can't do that with Facebook. 

I've got confirmation (and approval to post it) that ColdFusion 9 will provide a way around this (most likely by just disabling it completely). It's a small thing, and maybe not as cool as some of the other huge things planned for ColdFusion 9, but I'm certainly happy to see it fixed!