---
layout: post
title: "Ask a Jedi: Apache Virtual Hosts and Remoting"
date: "2005-10-23T11:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/23/Ask-a-Jedi-Apache-Virtual-Hosts-and-Remoting
guid: 865
---

Scott asks:

<blockquote>
Ray, I wondered if you could provide any insight on how to set up virtual hosts on apache so that flash remoting works for each? Thanks.
</blockquote>

As far as I know, all you need is an alias for the CFIDE folder. This is also used for Flash Forms as well as forms support in general. This is a typical virtual host on my box:

<code>
&lt;VirtualHost *&gt;
ServerName dev.aspen5.jedi.com
DocumentRoot "C:/projects/dev.aspen5.mindseye.com/wwwroot"
Alias /CFIDE "c:/Apache2/htdocs/CFIDE"
&lt;/VirtualHost&gt;
</code>

<b>Edited:</b> Just a quick note, but as Critter points out in the comments, you should be able to move that alias outside the virtual host declaration if you want it global to the box. That would <i>probably</i> be preferable, especially if the entire box is just hosting CF applications.