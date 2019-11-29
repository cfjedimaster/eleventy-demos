---
layout: post
title: "Another ColdFusion 10 Closures Post"
date: "2012-08-14T19:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/08/14/Another-ColdFusion-10-Closures-Post
guid: 4701
---

<strong>Edit on February 19, 2016:</strong> This blog post came up on a [StackOverflow](http://stackoverflow.com/questions/35512739/using-querysort) post today. The code I used in my sort was based on a beta of ColdFusion and will not work in the release or more recent versions. Specifically, my comparator must return 1, 0, or -1, instead of just true and false. See [this answer](http://stackoverflow.com/a/35512880/52160) which talks more about it and shows an example of how you can now do sorting on query objects directly.

Back in May I wrote a <a href="http://www.raymondcamden.com/index.cfm/2012/5/25/Taking-ColdFusion-Closures-all-the-way-to-11">blog entry</a> talking about how impressed I was with closures in ColdFusion 10. This was thanks to <a href="http://www.compoundtheory.com/">Mark Mandel</a> introducing me to the awesome <a href="https://github.com/markmandel/Sesame">Sesame</a> project. For the RIACon keynote I decided to share this and other examples.
<!--more-->
I began with a simple example of how arraySort was updated to include closure support. Consider the following example.

<script src="https://gist.github.com/3353518.js?file=gistfile1.cfm"></script>

I've got a simple static array of data I want to sort. I pass it to arraySort and dump the results. 

<img src="https://static.raymondcamden.com/images/screenshot20.png" />

Notice something? The bands that begin with "The" are sorted correctly, but not optimally. Instead, most folks would probably prefer them sorted by the letter after the word The. Using a closure, this becomes simple to fix.

<script src="https://gist.github.com/3353538.js?file=gistfile1.cfm"></script>

I supplied a new function to arraySort that handles the comparison manually. If it finds that the string begins with "The", it just removes it. This could be a bit more intelligent, but you get the idea. Here's the result:

<img src="https://static.raymondcamden.com/images/screenshot21.png" />

At the keynote, I talked about Mark's Sesame library, but also <a href="http://underscorecfc.riaforge.org/">UnderScore.cfc</a> by Ross Spivey. As you can probably guess, this is a port of the ultra-cool <a href="http://underscorejs.org/">UnderScore.js</a> library. 

It has got quite a few features, but one that I thought was <i>really</i> cool was memoize. Memoize takes a function and creates a cacheable version of it. So given some method X, you can pass it to memoize to get some new function Y, that given input A will automatically cache all future calls with A as an attribute. Perhaps an example will make more sense.

<script src="https://gist.github.com/3353562.js?file=gistfile1.cfm"></script>

You can see I've got a function that can be a bit slow. Essentially it gets slower as you pass it higher and higher numbers. But when I pass it to memoize, the result, in this case slowX, has automatic caching enabled. The first time I call slowX(4) it will be, well, slow. But the second time I run it will return instantly. My result from this script was:

Time diff after first call: 1602, diff after second call: 0

Finally - another person doing cool stuff with closures is <a href="http://www.bennadel.com/index.cfm">Ben Nadel</a>. He's written a few blog posts on it, but one in particular caught my attention. He wrote a UDF called reReplaceAll. It allows you to take a string, run a regex against it, and then fire a closure against every result. Normally you can't do much with replacements. You can do a bit of logic like upper or lowercasing results, but if you want to do something very complex with a match, you have to manually step through each result and update the string. With his UDF, you can simply do your complex stuff in a simple closure. Check out the example below:

<script src="https://gist.github.com/3353582.js?file=gistfile1.cfm"></script>

I've taken input text, used a simple regex, and then written a closure that wraps each result in HTML while also reversing the actual match. Very simple and direct to use!