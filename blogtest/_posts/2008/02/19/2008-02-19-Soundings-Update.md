---
layout: post
title: "Soundings Update"
date: "2008-02-19T14:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/19/Soundings-Update
guid: 2659
---

During lunch I released a quick update to <a href="http://soundings.riaforge.org">Soundings</a>. A user (thanks Emmet!) found a pretty serious bug with CSV export. Turns out I wasn't stripping HTML data from survey data. Wow, that's <i>really</i> dumb. Like I was channeling Paris Hilton while coding dumb. 

I've added code to strip the HTML both in input, and in the Excel output (for those who may have old surveys with bad HTML in it). 

A few other small bugs were corrected as well.