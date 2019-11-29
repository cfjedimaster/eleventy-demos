---
layout: post
title: "Ask a Jedi: Application.cfc versus Application.cfm"
date: "2005-12-07T22:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/07/Ask-a-Jedi-Applicationcfc-versus-Applicationcfm
guid: 958
---

Tony asks:

<blockquote>
When an application.cfm and an application.cfc file are both in the root of an application, do both get executed? Or does the .cfc take over, and the .cfm is just ignored?
</blockquote>

First off - I wouldn't put both files in the same folder. ColdFusion won't throw an error, but I still wouldn't do it. That being said - if both exist, the CFC version will run instead of the CFM. They definitely do not both run. 

By the way - this surprised me. CF is normally <i>super</i> backwards compatible. I had assumed the CFM file would win over the CFC.