---
layout: post
title: "Converting a list of dates into a shorter, combined list"
date: "2013-05-19T11:05:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2013/05/19/Converting-a-list-of-dates-into-a-shorter-combined-list
guid: 4936
---

Forgive the title, I'm not sure it best describes the task. I was asked by a reader to consider a simple problem. Given a list of dates, how would you rewrite them so that two (or more) consecutive dates are displayed together? For example, imagine this input.
<!--more-->
dates = [(May 1, 2013), (May 4, 2013), (May 5, 2013), (May 7, 2013)]

I want to take this list and join the values that are one day apart. I should end up with:

dates = [(May 1, 2013), (May 4, 2013 - May 5, 2013), (May 7, 2013)]

I wrote two solutions for this - one in ColdFusion and one in JavaScript. Let's start with ColdFusion.

First I create my sample data and a new array that will store my results.

<script src="https://gist.github.com/cfjedimaster/5607780.js"></script>

Now for the real "meat" of the logic. My idea here was to store objects in the new date array. The object contains a first and last property referring to the first and last date. What this allows for is a quick date comparison. If the next item in my source data is one day after the last value in the previous range, than we 'extend' the range by resetting the last property. Otherwise we need to add a new item in the result array.

<script src="https://gist.github.com/cfjedimaster/5607787.js"></script>

Finally, let's make this easier to use by doing some formatting on the array elements. We will loop through each item and add a 'formatted' key.

<script src="https://gist.github.com/cfjedimaster/5607809.js"></script>

And the result is this:

<img src="https://static.raymondcamden.com/images/Screenshot_5_19_13_9_27_AM.png" />

Woot. Ok, now let's look at the JavaScript version. I'll just share the complete template first and talk about the differences.

<script src="https://gist.github.com/cfjedimaster/5607818.js"></script>

Ignore our two helper functions on top for now. Our initial seed data is very similar to the ColdFusion one. Instead of using dateNew we use the Date constructor. 

The first loop is also pretty similar. Do remember that JavaScript arrays begin with 0. The main issue we have is doing the date comparison. There is no dateDiff in JavaScript. You can find great Date libraries out there, but as I had a <i>very</i> simple need here, I just wrote a quick function that compares the millisecond values of two dates and sees if the difference is less than one day. (By the way, the best JavaScript date library out there - imo - is <a href="http://momentjs.com/">Moment.js</a>.)

Finally, I did my formatting. Again, I could have grabbed a library for this, but instead I simply ran toDateString. My dtFormat function is a bit simple. Almost too simple to even be its own function. But I was imagining that I'd probably want to make formatting a bit more complex in the future. This lets me handle that later. 

The result:

<img src="https://static.raymondcamden.com/images/Screenshot_5_19_13_9_36_AM.png" />

Note - I switched to Firefox for the screenshot as I think it prints objects nicer in the console.

I've included a zip with the complete code for both examples. Note the CFM has a tag-version as well for older CF engines.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive30%{% endraw %}2Ezip'>Download attached file.</a></p>