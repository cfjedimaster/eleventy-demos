---
layout: post
title: "Ask a Jedi: Using Multiple Categories with Verity in ColdFusion MX 7"
date: "2005-08-23T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/23/Ask-a-Jedi-Using-Multiple-Categories-with-Verity-in-ColdFusion-MX-7
guid: 721
---

Scott asks:

<blockquote>
In terms of Verity, how can you specify multiple categories for an item to be indexed?
</blockquote>

This is really rather simple, and is covered in the doc for <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000278.htm">cfindex</a>. You can specify multiple categories for an item by simply passing a list to the category attribute. However, you cannot specify more than one category tree.