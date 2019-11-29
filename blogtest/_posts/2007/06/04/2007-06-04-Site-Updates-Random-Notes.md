---
layout: post
title: "Site Updates + Random Notes"
date: "2007-06-04T21:06:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/06/04/Site-Updates-Random-Notes
guid: 2090
---

A few random notes on my web sites. First off, the <a href="http://www.coldfusioncookbook.com">ColdFusion Cookbook</a> has an issue generating the PDF. So for now it is turned off.

Secondly - my blog will (hopefully) be moving to a new domain later tonight. You should get automatically pushed to the new domain.

Next - <a href="http://www.riaforge.org">RIAForge</a> is having some SVN permissions issues. This only impacts project owners. I hope to have this fixed soon. 

<a href="http://galleon.riaforge.org">Galleon</a> will not work in ColdFusion 8. This is because of the use of "isUserInAnyRole" as a CFC method. If you need to use Galleon right now, just change all isUserInAnyRole calls to isUserInAnyRole2. (A bad name, but it does the trick.) I'll have an official release this week. Related to this - if people see any issues with my applications on ColdFusion 8, please let me know ASAP.