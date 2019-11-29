---
layout: post
title: "Taking ColdFusion Closures all the way to 11"
date: "2012-05-25T17:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/05/25/Taking-ColdFusion-Closures-all-the-way-to-11
guid: 4630
---

I have to admit - closures in ColdFusion 10 were not terribly exciting to me. Don't get me wrong - I'm really happy they were added. Much like I was happy the engineers added implicit notation and other "syntax sugar". But it's not really a "feature" per se. It's there - I'm happy it's there - and my brain will just mentally keep it in mind as I write ColdFusion.

That was how I felt <i>before</i> cfObjective. Then I attended <a href="http://www.compoundtheory.com/">Mark Mandel's</a> session on Closures and he opened my eyes to the possibilities. Specifically, he demonstrated his <a href="https://github.com/markmandel/Sesame">Sesame</a> library - a set of closure-based utilities you can include in your projects. Simple, but nice things like...

<script src="https://gist.github.com/2790470.js?file=gistfile1.txt"></script>

and

<script src="https://gist.github.com/2790472.js?file=gistfile1.txt"></script>

or

<script src="https://gist.github.com/2790475.js?file=gistfile1.txt"></script>

Nothing too revolutionary (and parts of Sesame are based on things found in Groovy), but seeing them in action really made me appreciate the support of closures a lot more.  

Things get <i>real</i> interesting though when you look at the concurrency aspect. ColdFusion added threads a while back. They are a powerful, if somewhat dangerous, addition to the language. Running code in a thread and ensuring you properly handle the end result can be tricky. Until you try Mark's code:

<script src="https://gist.github.com/2790488.js?file=gistfile1.txt"></script>

In case it isn't obvious - the _eachParallel function runs once for each item in the array and fires the code concurrently. My closure runs a sleep function which will slow down the processing of the page. But since the closures run concurrently, you will only have to wait for the slowest one (5 seconds) and everything else will be complete. Here's a screen shot of the output from that sample:

<img src="https://static.raymondcamden.com/images/ScreenClip86.png" />

Pretty cool!