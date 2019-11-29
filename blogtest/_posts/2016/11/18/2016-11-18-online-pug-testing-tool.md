---
layout: post
title: "Online Pug Testing Tool"
date: "2016-11-18T09:35:00-07:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2016/11/18/online-pug-testing-tool
---

I've never been shy about my feelings about the Jade templating language. I absolutely hate it. I think it is weird. I think it leads to moral depravity. I just really, really don't like it. Mainly I think because I find HTML already succinct enough. I mean I get that this:

	h1 Foo

is less code than

	<h1>Foo</h1>

but my brain just has issues mapping the Jade version to the output. So yeah, I hate Jade. But a while back, due to some legal issues, the Jade folks had to rename to [Pug](https://pugjs.org), and who can hate a project called Pug?

<img src="https://static.raymondcamden.com/images/2016/11/pug.png">

To be honest, even before this rename, I'd been slightly warming up to Jade. I still prefer [Handlebars](http://handlebarsjs.com/) but I've moved past "hate" and am slowly warming up to "Mild Distate." 

I noticed today that there wasn't a quick testing tool for Pug. The web site says you can open up dev tools and test right there, which is cool and all, but as I had a few hours in the Denver airport, I thought I'd whip up a quick tool. Here's a screen shot of it in action. It lets you input a Pug template and supply JSON data.

<img src="https://static.raymondcamden.com/images/2016/11/pug2.png">

You can test this yourself here: <https://cfjedimaster.github.io/webdemos/pugclient/>