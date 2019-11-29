---
layout: post
title: "jQuery Example: Related, hidden selects"
date: "2013-02-08T14:02:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2013/02/08/jQuery-Example-Related-hidden-selects
guid: 4851
---

This request came in from a reader and I thought I'd share it. I'm not sure how re-usable it is for others, nor will I promise that it is The Best jQuery Code ever. (Far from it.) But on the off chance the example helps others, I wanted to post it.
<!--more-->
The reader had a simple request - set up related selects. I've done this many times before so that part wasn't such a big deal. The only twist here is that he wanted the related selects to only show up when selected. 

His data supported, at most, three levels of options. But not every option would have three levels.

Because of this restriction, I decided to simply build my code to support three levels total and not build some high level, super cool, infinite deep relation type doohicky. As it stands, if I were to see 4 or more related selects on a form I'd run away screaming.

<img src="https://static.raymondcamden.com/images/tumblr_mgoqplvaqr1s373hwo1_500.gif" />

Let's then start off with the HTML portion of the code.

<script src="https://gist.github.com/cfjedimaster/4741263.js"></script>

You can see my three drop downs in the form block. The second and third drop downs are wrapped in DIV tags and hidden with CSS. Notice too that I've added in the drop downs with no options. The idea here is that I'll use jQuery to hide and manipulate the contents of these tags. Let's look at the code now.

<script src="https://gist.github.com/cfjedimaster/4741285.js"></script>

First up is a set of code used to cache my selectors. This is a general jQuery best practice. 

I then have change handlers for my two drop downs. (Remember, we only support three levels max. As I said, you could possibly build something fancy that supported N levels, but I'm one of those crazy people who like simple solutions.) In general, both handlers are pretty similar.

They get the value from the drop down and then automatically hide anything "beneath" them. For the first drop down this is both of the related divs. For the second it is only the third. 

If a value was selected, an AJAX call is fired off. Typically this would be to a dynamic datasource. To keep things simple I just built some basic static JSON files that return arrays. I can then take that array and populate a select. Note that I abstracted that logic in populateSelect().

And that's pretty much it. Not rocket science, but maybe useful. You can play with the demo by clicking the ginormous button below. This was tested in Chrome, Firefox, and IE10.

<a href="https://static.raymondcamden.com/demos/2013/feb/8/test2.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>