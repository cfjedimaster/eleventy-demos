---
layout: post
title: "Ben announces improvements to LCDS (Flex Data Services) Integration"
date: "2007-05-06T13:05:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2007/05/06/Ben-announces-improvements-to-LCDS-Flex-Data-Services-Integration
guid: 2014
---

There will be a new gateway that can be used to notify a data services destination of changes in the data being managed by the destination.

Assemblers can return queries directly from the fill function withouth converting each row to a value object.

Assemblers can use structs instead of CFCs to represent data. The structure can contain type info which will be used as the ActionScript type when sent to the Flex application.

Flex Data Service can be integrated in the CF install. This way CF can call Flex APIs directly (rather than via the current RMI connection) providing a significant performance boost.

So summary - it looks like it will be a heck of a lot easier to work with CF and Flex Data Services (which is now Live Cycle Data Services, hence the LCDS above). You actually can do it when you install CF (very, very nice!).