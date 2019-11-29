---
layout: post
title: "Some thoughts on organizing a large jQuery Mobile project"
date: "2012-05-16T11:05:00+06:00"
categories: [development,html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/05/16/Some-thoughts-on-organizing-a-large-jQuery-Mobile-project
guid: 4618
---

Ben Forta pinged me with an interesting question (and when the Forta pings you, you respond) that I thought I'd share here. It's one of those "best practices" questions that really has no best answer, so as always, I'm very eager to hear what my readers have to say. Don't feel afraid to tell me I'm completely off my rocker - that makes for fun conversation. Ok, so the question:

<blockquote>
I have a JQ+jQM=PG app. It started off as 2 small pages and 50 lines of code, and is now 10 pages and over 1000 lines of code (excluding lots of .js libraries, some my own and some downloaded, that are all included).

My question simply is how would you go about organizing the code? Each "page" in its own HTML file? Would you put page supporting event handlers with those pages? What about handlers that use JQ to manipulate other pages? Separate all JavaScript in included files? And actually, how the heck do you even use JQ to manipulate controls in another page?

I know there is no right or wrong answer, but I am about to start refactoring this entire mess, so ... any thoughts you'd like to share?
</blockquote>
<!--more-->
That's quite a bit there and covers a few different aspects. I'd separate this into:

<ul>
<li>jQuery Mobile HTML architecture (in other words, how to organize your views)
<li>jQuery Mobile JavaScript architecture (how to organize JavaScript code)
<li>Handling UI changes in a jQuery Mobile page for non-visible pages.
</ul>

To be clear, I do not believe I have the best answers here (especially in terms of JavaScript architecture), but here are the general guidelines I'm using now.

Let's discuss pages first. In jQuery Mobile, a "page" is a div element with a data-role of page. It does not need to be one particule HTML file. jQuery Mobile allows you to use as many "pages" as you want within a particular HTML file. However - I think it quickly gets messy if you begin putting lots of different pages into one HTML file. At most, I may have a root index.html page that includes the initial view and possibly a simple "About" page or "Office Location" type list. Outside of that I follow the same rules I would for a non-jQuery mobile site. One page per file - using a file naming and folder system that makes sense. 

JavaScript architecture is another matter. Right now I'm using one file per site (or application). Most of my logic comes down to a set of page handlers. I.e., "on page X loading, let's do these things" and "on page Y loading, start listening for a form submit and do blah". This leads to a giant file, which I am <i>not</i> terribly happy about. I like having my views extremely simple - just HTML - but I'm considering how best to 'break' up my JavaScript so the file is a bit easier to work with. 

I think a more organized approach would be to use a JavaScript file as a controller. You can imagine your file having the page event handlers, but all of your business logic (like hit the server to get users) would be in a few various service files. I haven't actually tried this approach yet, but it is what I'm considering. I've got an application like this now, and rearchitecting out the business logic should be possible. 

Now for your final aspect - how to modify the UI of other pages. This one is going to be tricky. When you load a page via jQuery Mobile, it adds the page into your DOM. Once it is "gone", it's really just hidden. You can still work with it. But if you haven't loaded it yet, you can't. That is enough for me to think that this approach may be a bad idea. 

Instead - I think I'd consider an approach where when the page loads (the one you would have modified), you check your model (JavaScript variables I mean) to see what state the UI should be in. Your view then is tied to your data and handles knowing how to render itself based on current settings. This could be a good use case for something like <a href="http://emberjs.com/">Ember</a> or <a href="http://angularjs.org/">Angular</a> on top of jQuery Mobile, but this is not something I've done myself.

So... thoughts? I know this is all theory and no code, so if folks want to work on a proof of concept example (via Github), let me know and I'll set up a repo. Also, if folks have examples they can share, please do.