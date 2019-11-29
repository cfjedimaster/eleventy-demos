---
layout: post
title: "Interesting ColdFusion 8, Auto-Suggest issue to watch for"
date: "2008-03-17T14:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/17/Interesting-ColdFusion-8-AutoSuggest-issue-to-watch-for
guid: 2711
---

Thanks to Ed Tabara for pointing this out. If you type "1" in the search field at <a href="http://www.coldfusionbloggers.org">ColdFusion Bloggers</a>, you will get a JavaScript error:

<blockquote>
<p>
The page at http://www.coldfusionbloggers.org says:Bind failed for autosuggest search_query, bind value is not a 1D array of strings [Enable debugging by adding 'cfdebug' to your URL parameters to see more information]
</p>
</blockquote>

If you introspect the result from my server, you see something like this:

[10.0,123.0,"1ssblog","1smartsolution"]

Notice that the first two results were numbers, not strings. I tried to 'fool' JSON a bit. I added "" to the number to see if that would do it and it didn't work. Interestingly enough, if you add " " to your data, serializeJSON will keep the padding on the strings, but removes it from the numbers. So even though my data was "10(space)", serializeJSON ignored it. 

So it looks like 2 possible bugs. The client side code should allow for any simple value in the array - numbers, strings, or dates. And it looks like maybe serializeJSON is a bit overzealous in converting values. I can understand converting 10 to 10.0, but "10(space)" should be left alone, especially if "Ray(space)" is left alone.