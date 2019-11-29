---
layout: post
title: "Brackets Extension for CanIUse"
date: "2012-10-01T16:10:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2012/10/01/Brackets-Extension-for-CanIUse
guid: 4748
---

I blogged on this earlier and have been tweeting about it over the weekend, but I think I'm ready to "formally" release my Brackets extension for CanIUse.com:
<!--more-->
<a href="https://github.com/cfjedimaster/brackets-caniuse">https://github.com/cfjedimaster/brackets-caniuse</a>

Once installed, it adds a new option to your View menu: "Show CanIUse" 

<img src="https://static.raymondcamden.com/images/screenshot27.png" />

This will load a panel at the bottom. The left side is a list of all the possible features. This list is rather long so you can use the filter option on top to narrow it down.

<img src="https://static.raymondcamden.com/images/screenshot29.png" />

To view a feature, simply click on it. I decided to show a subset of the available browsers from CanIUse and if the ones I chose are missing anything important (or if you think some should be trimmed), just let me know. I also show the top level stats as well.

Unfortunately, this is where I have a bit of a problem. Everything lays out well - and pretty close to the site, but also pretty tall vertically. You have to scroll to see the support. So for example, here is what you see initially:

<img src="https://static.raymondcamden.com/images/screenshot30.png" />

and you then scroll down to see the actual table:

<img src="https://static.raymondcamden.com/images/screenshot31.png" />

Obviously it is the numeric stats table to the right causing most of the issue, but I'm unsure as of how to fix. I'm thinking of maybe making it horizontal and placing it right below the legend.

Anyway - please let me know what you think!