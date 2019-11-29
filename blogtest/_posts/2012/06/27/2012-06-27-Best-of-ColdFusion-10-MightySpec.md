---
layout: post
title: "Best of ColdFusion 10: MightySpec"
date: "2012-06-27T11:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/06/27/Best-of-ColdFusion-10-MightySpec
guid: 4660
---

Welcome to the final entry in the <a href="http://www.raymondcamden.com/index.cfm/2012/2/29/Best-of-Adobe-ColdFusion-10-Beta-Contest">Best of ColdFusion 10</a> contest. I apologize for taking so long to "wrap" this (and technically it isn't wrapped till I announce the winners), but hopefully the utter and complete coolness of today's entry will make you forget how long it took me to actually get it posted. Our last entry comes from <a href="http://blog.mxunit.org/">Marc Esher</a> :  <a href="https://github.com/mxunit/mxunit/tree/mightyspec">MightySpec</a>

MightySpec is a modification to <a href="http://mxunit.org/">MXUnit</a> that aims to provide Behavior-Driven-Development support to your unit tests. Marc's work is based on <a href="http://pivotal.github.com/jasmine/">Jasmine</a>. If that doesn't mean anything to you, perhaps an example will help clear it up. Imagine your typical, simple unit test making use of an assert statement.

<script src="https://gist.github.com/3004301.js?file=gistfile1.cfm"></script>

While this works well enough, now imagine writing tests like this:

<script src="https://gist.github.com/3004312.js?file=gistfile1.cfm"></script>

Look at how descriptive the tests are. You could almost read this like a story. This friendlier output also shows up in the output, both in the browser...

<img src="https://static.raymondcamden.com/images/mightyspec_in_browser.PNG" />

And Eclipse:

<img src="https://static.raymondcamden.com/images/mightyspec_in_eclipse.PNG" />

I've <a href="http://www.raymondcamden.com/index.cfm/2012/5/25/Taking-ColdFusion-Closures-all-the-way-to-11">blogged</a> before about how impressed I am with ColdFusion 10's closure support and this just reinforces my belief that closure support may be the most important feature added to the latest version of ColdFusion.

There is one small hitch though. While working on MightySpec, Marc encountered a bug with closures. I'll share with you what he had to say about it:

<blockquote>
To get it to work, you'll need to point to a custom RemoteFacade URL

Here's what to do:

with that version of MXUnit in your CFBuilder, drill down to
mxunit/tests/mightyspec

Right click, select "properties", and go to the MXUnit tab.

in the URL box, use this:
http://localhost:8500/mxunit/tests/mightyspec/RemoteFacade.cfc?wsdl

with the server name and port to whatever your stuff is.

Hit OK.

Now, when you run the Specs, it'll point to that URL and run correctly.
</blockquote>

Keep the above in mind if you plan on testing his project. So - what do you think?