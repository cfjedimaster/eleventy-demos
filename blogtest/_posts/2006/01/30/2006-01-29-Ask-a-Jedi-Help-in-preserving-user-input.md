---
layout: post
title: "Ask a Jedi: Help in preserving user input"
date: "2006-01-30T11:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/30/Ask-a-Jedi-Help-in-preserving-user-input
guid: 1068
---

A reader asks:

<blockquote>
I want to create a discussion board where I can retain the carriage returns that my users have entered  - how can I pull their entries from the Database and retain the carriage returns without using the &lt;pre&gt; tags?
</blockquote>

Out of the box, ColdFusion provides us with a paragraphFormat() function. This will correctly format blocks of text in paragraphs, inserting a P tag at blank lines. However, it won't correctly notice simple line breaks, like in an address. You can get around this by using a user-defined function like <a href="http://www.cflib.org/udf.cfm?ID=38">paragraphFormat2</a>, written by Ben Forta. This UDF simply looks out for line breaks and inserts a BR tag. I use this on my <a href="http://ray.camdenfamily.com/projects/galleon">Galleon ColdFusion forums</a>.