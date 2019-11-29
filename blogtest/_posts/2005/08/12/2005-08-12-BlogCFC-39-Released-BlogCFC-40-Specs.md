---
layout: post
title: "BlogCFC 3.9 Released / BlogCFC 4.0 Specs"
date: "2005-08-12T15:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/12/BlogCFC-39-Released-BlogCFC-40-Specs
guid: 695
---

BlogCFC 3.9 is now formally released. There were a few small changes since the beta. Here is the list of features, with changes at the end:

<ul>
<li>Category Editor
<ii>RSS 2.0 support, stolen from Steven Erat (thanks!)
<li>Pod Casting support. Cast those pods, baby!
<li>Additional use of TITLE in the blog pages (stats, etc)
<li>The admin "menu" bar now lives in the main layout.
<li>Bug fixed in search pod.
<li><b>New:</b> RSS 2.0 category bug fixed. Thanks to Roger B.
<li><b>New:</b> A bug, a very old bug, existed in the RSS generation. I forgot to xmlFormat some of the meta tags. I'm really surprised this didn't come up sooner.
<li><b>Warning:</b> The Spanish locale is not yet updated. Steven Erat dared to take a vacation and he will be punished when he returns. (Joking, Steve. :)
</ul>

As usual, you can download it from the Tools pod on the right, or right <a href="http://ray.camdenfamily.com/blog.zip">here</a>.

So what's planned for 4.0? Here is my list of <b>required</b> items for shipping:

<ul>
<li>Trackbacks.
<li>Hour offset. Your live in CST. Your blog lives in EST. Let's get them together, shall we?
<li>Code clean up: Mainly just slimming down blog.cfc and breaking it up a bit. Zero impact on readers or users, but will help my sanity when doing code editing.
<li>New colored code. A user submitted a new version of the colored code custom tag, which is <i>quite</i> old. I also want to play with the CSS a bit so it uses scroll bars.
<li>Potential rewrite of code generated to make it XHTML compliant.
<li>Potential use of Aura.
</ul>