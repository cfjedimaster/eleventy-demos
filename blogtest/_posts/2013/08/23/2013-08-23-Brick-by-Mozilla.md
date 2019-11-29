---
layout: post
title: "Brick by Mozilla"
date: "2013-08-23T11:08:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2013/08/23/Brick-by-Mozilla
guid: 5017
---

A few months ago I wrote a post that was - perhaps - a bit over the top: <a href="http://www.raymondcamden.com/index.cfm/2013/5/22/The-Future-of-the-Web">The Future of the Web</a>. I don't deny that the title was a bit sensational, but, I honestly felt excited about what I was seeing and truly think we are seeing a tectonic shift in web development. Today's blog post isn't quite that earth shattering, but I think it's pretty darn cool.
<!--more-->
About a week or so ago Mozilla announced the release of <a href="http://mozilla.github.io/brick/index.html">Brick</a>. Brick is a set of components based on the W3C standard for <a href="https://dvcs.w3.org/hg/webcomponents/raw-file/tip/explainer/index.html">Web Components</a>. It is - essentially - a way to create your own HTML tags and have them rendered out on the client. Anyone who has ever downloaded a UI library knows that there is a strong need for this. Imagine a developer who does <strong>not</strong> have good JavaScript experience. Instead of having to learn something like jQuery UI to add tabs to their application they can simply include a library and use tags to write out their HTML. We're aren't quite there yet but it's approaching.

Mozilla's Brick library is a great example of this. Their library contains widgets for:

<ul>
<li>Application toolbars, toggle buttons and groups</li>
<li>Calendar and Date pickers</li>
<li>Decks and Flipboxes</li>
<li>A basic layout container</li>
<li>A slider</li>
<li>A tab control (obviously)</li>
<li>And more</li>
</ul>

Some of these act like polyfills. So for example, Firefox doesn't yet support input type="date". (*sigh*) So if you use their datepicker in Firefox you see:

<img src="https://static.raymondcamden.com/images/Screenshot_8_23_13_10_01_AM.png" />

Whereas the same code in Chrome does nothing as it is natively supported:

<img src="https://static.raymondcamden.com/images/Screenshot_8_23_13_10_02_AM.png" />

The UI widgets are nice, but what interests me the most right now are the <ahref="http://mozilla.github.io/brick/docs.html#deck">decks</a>. Take the following code:

<script src="https://gist.github.com/cfjedimaster/6320362.js"></script>

Brick creates a single view of the cards so that the first one (by default, and you can tweak that) is visible. It then provides a simple JavaScript API to switch between them. My immediate thought here was - this could be a <i>great</i> way to create a Single Page App for PhoneGap (in fact, I'm working on one now). 

I whipped up a simple demo that demonstrates this. It isn't pretty - blame me - not Mozilla. 

<script src="https://gist.github.com/cfjedimaster/6320393.js"></script>

The "app" (ok, it isn't much of an app) is wrapped by an x-layout tag. I've got an appbar for the header and a footer at the bottom. Inside this is my main deck with 4 cards. The first card is like a basic home page. I've got a simple menu here with three links. As I said, Brick provides a basic API to load cards in a deck, but I need to write a bit of JavaScript to handle this automatically. I'm not sure what I did is the easiest way to do it, but it worked. I simply added a class to my links and built an event handler that would pick up those click events. I then use the href value to determine which card to load (card indexes are 0-based). I did something similar for the home link. If you check out the example for the <a href="http://mozilla.github.io/brick/demos/tabbar/index.html">tag bar</a>, you can see Mozilla has a more automated way of doing this, so what I've done is probably even simpler to do (or will be in the future).

You can run my demo here if you like: <a href="http://www.raymondcamden.com/demos/2013/aug/23/test4.html">http://www.raymondcamden.com/demos/2013/aug/23/test4.html</a>

I definitely encourage you to check it out. Since I first played with it they have had three updates so it is an active project. And frankly - it is fun to write. I dig that.

p.s. A quick edit after I've published - I don't think their site says it yet - but you can follow the Mozilla Brick project on Twitter: <a href="https://twitter.com/mozbrick">https://twitter.com/mozbrick</a>