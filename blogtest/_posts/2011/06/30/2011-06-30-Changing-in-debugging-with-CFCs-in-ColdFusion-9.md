---
layout: post
title: "Change in debugging with CFCs in ColdFusion 9"
date: "2011-06-30T21:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/30/Changing-in-debugging-with-CFCs-in-ColdFusion-9
guid: 4291
---

Just a quick little post here. A reader contacted me a few days ago with an observation about a change to debugging in ColdFusion 9. In earlier versions of ColdFusion, if debugging was turned on and you ran a CFC (for example, making an AJAX call to a CFC method), debugging text was returned along with your result. This was almost always a bad thing as it tended to break AJAX applications. However, this reader actually used the debugging information to check how well their CFC was performing. Also - tools like <a href="http://coldfire.riaforge.org">ColdFire</a> could make use of this data.

Well, in ColdFusion 9, debugging information is always going to be disabled for CFC calls. To be clear, I'm talking about the request to the CFC directly. If you write a CFM that calls the CFC, then debugging information will correctly include any activity within the CFC methods call. (And in fact, this is what the reader is doing to now.)