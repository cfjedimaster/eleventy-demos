---
layout: post
title: "Persistence with ColdFusion Builder Extensions"
date: "2011-03-29T19:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/03/29/Persistence-with-ColdFusion-Builder-Extensions
guid: 4175
---

Here's a question - how would you handle persistence in a ColdFusion Builder extension? Most extensions are "fire and forget" - they may have a few steps but in general the idea is - take some input, do some action, return some output. There are - however - times when you may want to remember stuff. For example, perhaps your extension has numerous options and you simply want to remember what the user picked last time. A while ago I released a component called <a href="http://builderhelper.riaforge.org/">builderHelper</a>. This component wrapped up common tasks for extension developers and aimed to make working with the XML dialect of CFB extensions even simpler. Today I whipped up a super simple method of persistence. Any extension making use of builderHelper can store settings use name/value pairs. The name must be unique per extension and the value can be anything that is serializable by JSON:
<!--more-->
<p>

<code>
&lt;cfset helper = createObject("component", "testingzone.builderHelper.builderHelper").init(ideeventinfo)&gt;
&lt;cfset prefs = helper.getStorageItem("prefs")&gt;
&lt;cfdump var="#prefs#"&gt;

&lt;cfset helper.setStorageItem("prefs", {% raw %}{x=1}{% endraw %})&gt;
</code>

<p>

In this code sample I initialize builderHelper with my ideeventinfo packet. I then ask for and dump a value called prefs. The first time I run this it will be blank. Then I set a value, in this case a struct with one key. The <i>second</i> time I run this particular extension it will get the structure back. A pretty trivial example but hopefully you get the idea. 

<p>

You can download this code at the RIAForge project: <a href="http://builderhelper.riaforge.org/">http://builderhelper.riaforge.org/</a>