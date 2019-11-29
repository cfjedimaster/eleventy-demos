---
layout: post
title: "Example of a dynamic HTML5 datalist control"
date: "2012-06-14T09:06:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/06/14/example-of-a-dynamic-html5-datalist-control
guid: 4650
---

I've made no secret of being a huge fan of the updates to forms within HTML5. One of the more interesting updates is the <a href="https://developer.mozilla.org/en/HTML/Element/datalist">datalist</a> control. This control gives you basic autocomplete support for an input field. At its simplest, you create the datalist control options, tie it to a control, and when the user types, they see items that match your initial list. Consider this example.

<script src="https://gist.github.com/2929958.js?file=gistfile1.html"></script>

Note that the input field, search, has a list attribute that points to the datalist control below it. The datalist control is simply a list of options. If you run this code in a <a href="http://caniuse.com/#feat=datalist">supported browser</a>, you will see the options show up as autocomplete values. As you type, they filter out based on your input. If you run this in an unsupported browser, nothing bad happens. (You can demo this script yourself <a href="http://raymondcamden.com/demos/2012/jun/14/test0.html">here</a>.)

So - that's cool I think - but most folks are not going to have a static list of options. Instead, they will want to base it on some dynamic data, possibly loaded in via AJAX. I built a simple demo that talks to some server-side code and returns a list of options based on input. Let's look at the code.

<script src="https://gist.github.com/2929966.js?file=gistfile1.html"></script>

For my example, I make use of jQuery, although that is certainly not required. I've bound to the input event for my search field and removed any items from my datalist control. When the event is fired, I grab the field value and simply pass it to a server-side script that does a database lookup. None of this is particular new or unique, but note how I handle the result. I take each result sent to me and create new option items for my datalist. (Note too that I make sure to clear out any previous ones.) This then gives me a simple database-bound datalist control. You can try this yourself <a href="http://raymondcamden.com/demos/2012/jun/14/test1.html">here</a>. I recommend using "mo" for input.

One interesting tidbit. I noticed in Chrome that if I didn't disable autocomplete, the browser would use both the explicit list I specified in JavaScript <i>and</i> my personal autocomplete history. It even used a little separator to divide the options:

<img src="https://static.raymondcamden.com/images/ScreenClip98.png" />

I'm not sure if I like that so for my examples I've simply disabled it. Firefox only shows the explicit list, which feels right to me. 

As I mentioned above, if you run this in a browser that doesn't support datalist, it fails nicely. But my demo was still firing off a bunch of AJAX requests and that seemed a bit silly. In my final version, I modified the code to first see if the browser supported datalist. This way it won't waste time hitting the server when it doesn't need to. 

<script src="https://gist.github.com/2929996.js?file=gistfile1.html"></script>

<strike>You can try this version by hitting the giant demo button below.</strike> Sorry - the old demo used ColdFusion, which I don't have on this server anymore.