---
layout: post
title: "Some Brackets Extension Tips"
date: "2012-10-01T11:10:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2012/10/01/Some-Brackets-Extension-Tips
guid: 4747
---

This weekend I began work on a <a href="http://www.caniuse.com">CanIUse</a> extension for <a href="http://github.com/adobe/brackets">Brackets</a>. Given than I've already worked with the CanIUse data before, I figured it would be pretty easy. Within about an hour or so I got to the point where I could list out all the filters, allow you to filter to quickly find one, and then select a feature and get part of the report.
<!--more-->
<img src="https://static.raymondcamden.com/images/screenshot25.png" />

For the most part, I was done, but I was dreading the rest of the work. Why? I knew I'd have to build out the support table by hand. It would be a slow, laborious process and I wasn't looking forward to it. (And in fact, I considered just plopping it up on GitHub and asking for help.)

This morning though I decided to just power through it and get it done. Before I went too far though I thought it might be cool if I could get a JavaScript templating engine working. I've <a href="http://www.raymondcamden.com/index.cfm/2012/4/19/Demo-of-Handlebars-and-why-you-should-consider-a-templating-engine">blogged</a> about this before and I knew it could be a big help if I could get it working within Brackets. 

I spent a bit of time attempting to get this working when Adam Lehman tweeted at me that <a href="https://github.com/janl/mustache.js/">Mustache.js</a> was included in Brackets. 

I looked around a bit for an example and found it in the Edge Web Fonts extension. This extension ships with <a href="http://html.adobe.com/edge/code/">Edge Code</a> (which is free!). Since Brackets extensions are as open source as the tool itself, I took a quick look at their code. In case you don't know how to find your extensions, both Brackets and Edge Code have a "Show Extensions Folder" under the Help menu:

<img src="https://static.raymondcamden.com/images/screenshot26.png" />

After digging through their code, I found the process to be incredibly simple. First, you can write your HTML templates making use of Mustache, or, even just use static HTML as well. Once you've made a few of them, simply include them in your main.js file:

<script src="https://gist.github.com/3812111.js?file=gistfile1.js"></script>

Then, you simply use Mustache to compile the template and inject it as you would any other string. Here are two examples, a bit out of context. The first line shows my static HTML template (which needs no data) while the second is being used to display a feature object.

<script src="https://gist.github.com/3812120.js?file=gistfile1.js"></script>

Just to give you some context, here is just some of the code I was able to rip out:

<script src="https://gist.github.com/3812131.js?file=gistfile1.js"></script>

Horrible, right? I'm still working my way through the extension to build everything as a template.

Now - I did say "Tips", not "Tip", right? While digging through the Edge Web Fonts extension, I also saw something else cool. You can include a style sheet for your extension by requiring and making use of ExtensionUtils. It is as simple as this:

<script src="https://gist.github.com/3812149.js?file=gistfile1.js"></script>

These two tips will make creating Brackets extensions a heck of a lot easier. In fact, I've got a little bug with my layout now. If I can't get it fixed, later on I'll be able to post the HTML/CSS by themselves for folks to give me a hand. Before today it would have been a lot more difficult for me to do so.