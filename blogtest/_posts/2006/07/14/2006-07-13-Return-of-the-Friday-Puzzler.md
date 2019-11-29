---
layout: post
title: "Return of the Friday Puzzler"
date: "2006-07-14T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/14/Return-of-the-Friday-Puzzler
guid: 1402
---

Sorry for the lack of puzzles. I know you guys are all out there waiting for the next one. Today's puzzle is rather simple, and involves one of my favorite topics, CFC metadata.

As you know, if you view a CFC in your browser, you get a nicely formatted display of all the properties and methods. However, you must have RDS or CF Admin access to view this documentation. Obviously you can't share that with the world. You can use the UDF <a href="http://www.cflib.org/udf.cfm/cfctoprinter">cfcToPrinter</a> to generate documentation, but the problem with this approach is that it shows everything about the CFC. What if you just wanted to create documentation for the remote parts of the CFC? Maybe you have a public API you want to document. Let's solve this problem.

Create a UDF that let's you pass in a CFC (either an instance or a "dot path"). The UDF will return an array of the remote methods of the CFC. Each array item will be a struct containing all the metadata for the function. Then create a simple HTML table to show this information. Design isn't important.