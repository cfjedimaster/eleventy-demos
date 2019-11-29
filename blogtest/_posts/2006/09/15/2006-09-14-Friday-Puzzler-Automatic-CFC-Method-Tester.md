---
layout: post
title: "Friday Puzzler: Automatic CFC Method Tester"
date: "2006-09-15T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/09/15/Friday-Puzzler-Automatic-CFC-Method-Tester
guid: 1532
---

One of the cooler features of ColdFusion components is their metadata. This lets you dig into the CFC via CFML and can enable some pretty powerful features. (See <a href="http://ray.camdenfamily.com/projects/canvas">Canvas</a> or the new rendering engine in <a href="http://www.blogcfc.com">BlogCFC 5.5</a> for examples.) Building on the fact that CF lets you grab this metadata easily, let me see how you build the following:

Write code that accepts as input both a CFC (dotted notation path) and a method (yes, you could grab this via metadata, but I'm trying to keep the contest short). Your code will then generate a form with inputs for all method arguments. 

The code can assume nicely documented CFCs. (Ie, the method arguments all have type attributes.)

If you are really eager, don't prompt for the method, but just the CFC and follow it up with a prompt for the method where you provide the methods for the user.

The code should be a self posting form and should invoke the data sent by the user using cfinvoke. This will let you build the tester for methods that are not remote.

Anyone game for this?