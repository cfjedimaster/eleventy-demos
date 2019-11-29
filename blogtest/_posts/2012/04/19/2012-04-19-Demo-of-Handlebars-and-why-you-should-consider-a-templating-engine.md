---
layout: post
title: "Demo of Handlebars, and why you should consider a templating engine"
date: "2012-04-19T18:04:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2012/04/19/Demo-of-Handlebars-and-why-you-should-consider-a-templating-engine
guid: 4592
---

For a while now I've been thinking I need to pick up, and start using, a JavaScript templating engine. I had used a jQuery-based one a few years back, but that project was abandoned and I've yet to really look what - if any - solution would work good for me. Another reason I've not found the time is that a majority of my JavaScript examples are small little demos built for blog posts. When I blog, I try my best to keep my code as simple as possible. I don't go all MVC just to demonstrate date formatting. It may not be real world, but it also keeps you focused on the topic I'm trying to discuss. 

Today I made the time - and more specifically - made a demo. The demo is stupid. It's not even important. What is important is this:

If you've ever used JavaScript to build strings of HTML, you never realized just how much of a pain that is until you don't have to. You never realized how resistant you are to adding new features - or tweaking the design. <b>You never realized how much you held back - just because of how much of a pain in the rear it was!</b> 

I'm probably being overly dramatic, but to me, it feels a lot like ORM. Yeah, it's simple to go into a database client, open a table, and add a new field. But when you can do all of that via code... it feels incredibly freeing. You feel yourself trying new and interesting things. In fact, the demo I'm going to show has about twice the features I was planning just because it was so damn easy to add. 

That's how I feel today - and any day where my computer makes me smile is a good day. Ok, enough rambling.

I had heard about <a href="http://handlebarsjs.com/">Handlebars</a> from various people. It's also the templating engine that <a href="http://emberjs.com/">Ember.js</a> uses. Handlebars works by allowing you to define templates using simple script blocks, so for example, you can write your template in your document like so:

<script src="https://gist.github.com/2424281.js?file=gistfile1.txt"></script>

You then use the Handlerbars API to create a template out of the block, apply data to it, and then render it to screen. It's all relatively simple, but the docs don't necessarily do a great job I think of demonstrating simple examples in "full" pages so you can see things in context. Here is a trivial example:

<script src="https://gist.github.com/2424328.js?file=test1.html"></script>

Notice how I've got a simple template block on top. If you've never seen Handlebars before, or any JavaScript templating engine, you can probably guess which portions of the block represent dynamic portions and which represent static text.

I've got a simple form with a button bound to a simple click listener. Looking at the JavaScript, you can see that first I have to grab the HTML from the template block. I then compile this. This gives me a template that I can reuse to generate output.

My form has a simple click handler. When you hit the button, I pass the values to my template and grab the HTML out of it. You can run this demo here: 

<a href="https://static.raymondcamden.com/demos/2012/apr/19/test1.html">https://staticraymondcamden.com/demos/2012/apr/19/test1.html</a>

Of course, not every template will be a simple set of keys and values. Your template may also need to be dynamic based on the values passed in. Let's look at another example that makes use of both lists and conditionals.

<script src="https://gist.github.com/2424372.js?file=test2.html"></script>

In our template, we've got two things going on here. First is a conditional that checks if "things" is a truthy value (truthy being one of the things that make JavaScript so fun). Within the true part of the conditional we use an each block to enumerate over a set of values.

If you scroll down to the HTML/JavaScript, you can see I'm just asking for you to enter a list of things you like. That value is split into an array and passed (if there were values) to the template. Demo this below..

<a href="https://static.raymondcamden.com/demos/2012/apr/19/test2.html">https://static.raymondcamden.com/demos/2012/apr/19/test2.html</a>

Let's look at one more example. One of the cooler aspects of Handlebars is that you can add custom functions to the engine. For example, you could write a cowbell function that wraps your results in the beautiful rocking sounds of the cowbell. Ok, maybe not that. But what about something a bit complex - like converting an email address into a MD5 hash that could be used for Gravatar? Yeah - no way that would work...

<script src="https://gist.github.com/2424442.js?file=test3.html"></script>

Notice in the template we have one simple value, email, and then this: gravatar email. This isn't something built into Handlebars, but rather, injected via the registerHelper function you see in the main script block of the page. You can demo this here: 

<a href="https://static.raymondcamden.com/demos/2012/apr/19/test3.html">https://static.raymondcamden.com/demos/2012/apr/19/test3.html</a>
 
Ok. Time to kick it up a notch. Many moons ago <a href="http://www.12robots.com/">Jason Dean</a> introduced me to the <a href="http://api.comicvine.com">ComicVine</a> API. This is a free API that provides access to their pretty deep database of comic book data. Unfortunately their API isn't very well supported and the documentation is missing a few important details. But I was able to take their service and build the following.

<script src="https://gist.github.com/2424490.js?file=index.html"></script>

This application uses JSON/P and the ComicVine API to let you search against their character database. A good search string is "spider". Obviously it doesn't have <i>everything</i> in there, but it's fun to see what's there. Oh yeah - be sure to search for "Beyonder" - the best thing to come out of Marvel in the 80s. You can demo this here:

<a href="https://static.raymondcamden.com/demos/2012/apr/19/"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>