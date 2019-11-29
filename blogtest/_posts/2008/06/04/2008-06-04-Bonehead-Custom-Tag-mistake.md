---
layout: post
title: "Bonehead Custom Tag mistake"
date: "2008-06-04T14:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/04/Bonehead-Custom-Tag-mistake
guid: 2860
---

This one cost me an hour of my time this morning, and most of lunch. I can blame the earlier time on lack of coffee, but, wow, this was a dumb one.
<!--more-->
I'm working on the ColdFusion Admin interface for <a href="http://seeker.riaforge.org">Seeker</a>, which is almost done by the way. From the list of Lucene indexes you can click to perform searches. This is handy when you want to build an index and then quickly test the results. I built out the UI and it basically came down to:

<code>
form code

if search has a value:
  cf_search
  dump results
end if
</code>

Whenever I entered a search term, however, the page would reload back to the home page for the CF Administrator. I thought perhaps it was a simple error, but no amount of try/catch or cferror would fix the issue.

I took my search custom tag and removed <b>all</b> the code and just did "hi" and even that wouldn't work. Yet the exact same code worked outside the CF Admin in a test file.

I then tried cfmodule instead of cf_search and it worked. It was at this point I took a closer look at my code...

<code>
&lt;cfmodule template="/stuff/search.cfm" stuff&gt;
</code>

and noticed my file name.... search.cfm.

My file was calling itself as a custom tag. -boggle- In my own defense, I've used cfmodule for so long I've gotten a bit rusty with cf_ syntax.