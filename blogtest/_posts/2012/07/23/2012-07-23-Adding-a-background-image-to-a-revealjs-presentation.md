---
layout: post
title: "Adding a background image to a reveal.js presentation"
date: "2012-07-23T19:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2012/07/23/Adding-a-background-image-to-a-revealjs-presentation
guid: 4683
---

<b>Edit on August 1, 2013:</b> Since the time I wrote this blog post, Reveal.js has added a much easier way to add background images to slide. You should <b>not</b> do what I described below in the original blog entry, but instead, use the new method. You can now use data-background="rgb color or file" as well as data-background-repeat and data-background-size. 

I've begun a new presentation (HTML5 Storage for <a href="http://www.riacon.com/">RIACon</a> and decided to give <a href="http://lab.hakim.se/reveal-js/#/">reveal.js</a> a try. I'm very much on the fence about whether or not I like HTML-based presentations, but I thought I'd give it a shot. One thing that confused me was how to set a background image for a slide. The docs say this:
<!--more-->
<blockquote>
Set data-state="something" on a slide and "something" will be added as a class to the document element when the slide is open. This let's you apply broader style changes, like switching the background.
</blockquote>

That seems sensible, right? But while it is was trivial to add data-state="something" to a slide, I couldn't figure out the exact CSS for setting the background. As far as I could tell, there wasn't an example of this anywhere. Luckily <a href="http://www.aliaspooryorik.com/blog/">John Wish</a> gave me a hand on Twitter.

Given a data-state="intro", here is the CSS you would use:

<script src="https://gist.github.com/3166557.js?file=gistfile1.css"></script>

In order to make text readable, you could do something like this as well:

<script src="https://gist.github.com/3166559.js?file=gistfile1.css"></script>

Here's a screen capture. Note that the image isn't the highest quality, but, it's kind of a joke anyway so I'm not too concerned about it.

<img src="https://static.raymondcamden.com/images/screenshot15.png" />