---
layout: post
title: "Tweak ColdFusion Builder's Outline Mode"
date: "2010-02-23T10:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/23/Tweak-ColdFusion-Builders-Outline-Mode
guid: 3731
---

I absolutely love the outline view in ColdFusion Builder (see my <a href="http://www.raymondcamden.com/index.cfm/2009/7/17/ColdFusion-Builder-and-Outline-Mode">earlier blog post</a> on it), but I just discovered something interesting about it that I wanted to share with others.
<!--more-->
For me, the Outline view works best for CFCs. I never bother using it for CFM files. When I get a CFC that is poorly organized (if you don't sort your methods in alphabetical order you are indirectly killing kittens - seriously) or large in size (have you met blog.cfc yet?) then the outline is a great way to navigate around the file. 

One thing that bugged me though was that the outline showed a lot of code that I didn't really care about. Comments, sets, etc. Here is an example from blog.cfc:

<img src="https://static.raymondcamden.com/images/cfjedi/outline_withall.png" title="Outline mode, default" />

What I found was that there was a way to remove those additional tags. Simply go to your settings (ColdFusion / Editor Profiles / Editor / Outline) and you will see a preference screen that allows you to switch between all tags and a selected subset. 

<img src="https://static.raymondcamden.com/images/cfjedi/outline_prefs.png" title="Outline preferences" />

What's cool is that the default subset is focused on CFC related tags. You could probably remove cfscript and add cfproperty  (which I think I'll do right now), but whats nice is that as soon as you make this change, the Outline view becomes much more streamlined:

<img src="https://static.raymondcamden.com/images/cfjedi/outline_small.png" title="Outline view, streamlined" />

Of course, if you use Outline view for CFMs then this tweak is not for you, but it really fits well with how I use it.