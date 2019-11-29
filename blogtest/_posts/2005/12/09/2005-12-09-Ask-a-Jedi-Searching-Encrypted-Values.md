---
layout: post
title: "Ask a Jedi: Searching Encrypted Values"
date: "2005-12-09T17:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/09/Ask-a-Jedi-Searching-Encrypted-Values
guid: 963
---

Here is an old entry from my Ask a Jedi files. As a reminder - please do not use the feature for <b>immediate</b> support. I don't always have time to respond. Anyway...

<blockquote>
Do you know if it's possible to search a hashed string against a hashed target?  My dilemna is that I have an application where currently lawyers submit their client list to search against the SDN. The resistance I encounter is that they don't want to send their client lists and I'm wondering if it's possible to ensure that I never see their info and still execute a search.
</blockquote>

Technically it should be possible. Verity has a number of <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00001325.htm">special characters</a>. Most likely your encrypted string will contain such a character. You could then escape them by surrounding the entire query with ` characters. But before you do that you would need to replace any existing ` with a double ` (ie: ``). What would concern me about this approach is that you would lose some of the power of Verity (stemming, proximity matches, etc). You probably would be better off just doing it in straight SQL. Has anyone done anything like this before?