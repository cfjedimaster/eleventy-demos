---
layout: post
title: "The other returnFormat - plain"
date: "2008-05-16T17:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/16/The-other-returnFormat-plain
guid: 2833
---

A friend just sent me a question regarding YUI (Yahoo's Ajax library) and JSON. Apparently YUI wants a JSON format (for query data) that ColdFusion can't handle automatically. He assumed this meant he couldn't speak directly to a CFC. That isn't the case. Don't forget that along with returnFormat=json, you can do use both plain and XML. So if you want to spit out the JSON format that Yahoo will like, you would need to create the string yourself, and use returnFormat=plain in the URL.