---
layout: post
title: "Tip: Remove some, but not all, HTML"
date: "2006-06-15T11:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/15/Tip-Remove-some-but-not-all-HTML
guid: 1335
---

A friend pinged me yesterday with a problem. His site allowed folks to post content with HTML, and while in general this worked fine, some users were posting content with Flash. He wanted to prevent this from being added to the content.

Now - the brute force fix is to simply htmlEditFormat() the code, but that would remove all HTML, not just the unwanted tags.
<!--more-->
Luckily, there is a solution. My friend (and all around generally smart guy who needs to blog more) Nathan Dintenfass created a UDF named <a href="http://www.cflib.org/udf.cfm/safetext">SafeText</a>. This UDF will either remove or replace the following tags:

<blockquote>
SCRIPT, OBJECT, APPLET, EMBED, FORM, LAYER, ILAYER, FRAME, IFRAME, FRAMESET, PARAM, META
</blockquote>

His code will also remove JavaScript events as well. You can configure the UDF to specify exactly what you want to remove if you don't want the defaults.