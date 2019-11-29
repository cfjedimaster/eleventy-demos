---
layout: post
title: "Experiment - Build your own stock market AI"
date: "2012-10-15T10:10:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2012/10/15/Experiment-Build-your-own-stock-market-AI
guid: 4758
---

I had an interesting idea last night. I'm not saying it is a good idea - my brain is having some serious weirdness going on with the seven hour time change. But good idea or not I built it and figured I'd share it.

Did you know that you could create functions in JavaScript by passing in a string? I don't see many people using this technique (ok, I've <i>never</i> seen anyone use this) but the gist is that you can create a new <a href="https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function">Function</a> object by listing any number of arguments followed by a string of code. Here is an example:
<!--more-->
<script src="https://gist.github.com/3892357.js?file=gistfile1.js"></script>

This got me thinking about what kind of code would make use of this form of defining functions. About four years ago I asked my readers to participate in a <a href="https://www.raymondcamden.com/2008/07/07/Friday-Puzzler-a-bit-early">coding contest</a> that required you to write the logic to handle a lemonade stand. The contest had you writing a UDF that responded to daily weather reports. It passed you information about your assets and you simply responded with an action. The idea was that you were building an "intelligent agent" to handle the business.

With this in mind, I decided to build something similar in JavaScript. In my simulation, you are writing an agent that monitors a stock and decides when to buy or sell stock. Your code will be a function that is passed basic data like the stock price, the change, etc. You then handle returning an action: Buy stock, Sell stock, do nothing.

You are given a simple function to start off with:

<img src="https://static.raymondcamden.com/images/screenshot32.png" />

When you click the Start Simulation button, I take that code and generate a function from it:

<script src="https://gist.github.com/3892392.js?file=gistfile1.js"></script>

The try/catch there handles some errors, but not all. As the code runs the simulation, I've got to do more error handling on the processing side. Here is that logic:

<script src="https://gist.github.com/3892395.js?file=gistfile1.js"></script>

It could use a bit more hardening, but you can see the basics of what I'm doing here. As the simulation runs you see a running report of your stats.

<img src="https://static.raymondcamden.com/images/screenshot33.png" />

So - want to give it a shot? <a href="https://static.raymondcamden.com/demos/2012/oct/15/test1.html">Stock Market AI Simulator</a>

In case you are curious - you can absolutely cheat with this. I don't look for sneaky things like selling negative amounts of stock. Nor do I block you from reaching out into the global scope and manipulating your values. I'd love to see what people try in the demo. Post your examples as comments below.