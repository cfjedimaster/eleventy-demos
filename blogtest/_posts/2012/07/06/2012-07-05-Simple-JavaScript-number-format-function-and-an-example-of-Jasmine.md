---
layout: post
title: "Simple JavaScript number format function, and an example of Jasmine"
date: "2012-07-06T10:07:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2012/07/06/Simple-JavaScript-number-format-function-and-an-example-of-Jasmine
guid: 4668
---

I'm officially on vacation this week, but I can't stop myself from doing a bit of code here and there and playing with new toys - or at least things new to me. For a while now I've wanted to write a simple number formatting function in JavaScript. I <i>know</i> there are about 500 libraries out there that do this, but I figured it would be a) fun to write and b) further exercise for the JavaScript-portion of my brain.
<!--more-->
The goal of this function wasn't to be a general purpose formatter, rather, it would focus on taking positive integers and writing them in 4 characters or less. So any number below 10000 would be written as is. Any number between 10000 and 1 million would be written as NK. For example: 321K, 981K, 109K. I'd round the numbers down of course. Given 320980 as an input I'd expect 321K as the output. I'd extend similar logic to the millions and billions. After that I wasn't quite sure what I'd do. Here is the function I came up with:

<script src="https://gist.github.com/3060121.js?file=gistfile1.js"></script>

Not really rocket science, and I'm sure it could be done better, but you get the idea. The only thing really weird here, and something I may change my mind on, is that I took values in the "single" millions (i.e. 5190981) and returned it with decimal places: 5.20M. In my mind, the data I would use this function in would have more distribution in this area so I thought it might make sense to get a bit more precise there. Obviously this is <i>very</i> much a personal preference and could be easily changed. 

While working on my code, I used some simple console logging to test my function:

<script src="https://gist.github.com/3060149.js?file=gistfile1.js"></script>

As you can see, I simply created a list of inputs and output them, and the result of passing them to my function, to the console. This worked... but I thought that this could possibly be a great opportunity to try out one of the JavaScript unit testing frameworks out there. I decided to try <a href="http://pivotal.github.com/jasmine/">Jasmine</a>. I had seen it before so I was vaguely aware of its syntax, and I had been reminded of it more recently by Marc's work on <a href="https://github.com/mxunit/mxunit/tree/mightyspec">MightySpec</a>. Jasmine uses a very descriptive syntax for testing. 

Here is the test spec I wrote for my code. If this is the very first time you've seen Jasmine, I can pretty much guarantee that you will be able to figure out what this does.

<script src="https://gist.github.com/3060192.js?file=gistfile1.js"></script>

As just a quick reminder - this is my first Jasmine unit test. I'm not calling this a good test. But it worked. 

Along with providing a nice descriptive syntax for writing tests, they also provide support for creating HTML "runners" or report pages. Essentially this is a way to take the collection of tests above and run them. Here is an example of that. I took their sample runner and simply replaced two lines (to include my JavaScript function and my tests):

<script src="https://gist.github.com/3060226.js?file=gistfile1.html"></script>

Once I had this, I simply opened up the file in my browser. As I worked on my tests, and my function, I just hit reload to ensure my tests kept passing.

<img src="https://static.raymondcamden.com/images/screenshot11.png" />

If you want, you can run this yourself here: <a href="http://www.raymondcamden.com/demos/2012/jul/6/jasminetest/SpecRunner.html">http://www.raymondcamden.com/demos/2012/jul/6/jasminetest/SpecRunner.html</a>

While my unit test was quite a bit longer than my simple console test, I really felt like it was a much better way to ensure my function worked correctly. I had nicely separated blocks of tests that hit each part of my code's functionality. (Although I'm sure more could be added.) If anything did go wrong, I'd have a better idea of where the issue was as opposed to my simple long list of numbers.