---
layout: post
title: "Another Node Experiment: AndKittens"
date: "2013-08-27T11:08:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2013/08/27/Another-Node-Experiment-AndKittens
guid: 5021
---

So, I know I've said this before, but I like to build completely useless, but fun, toys. Frankly if I let practicality be my guide I'd probably never build anything and I'm not sure how I'd learn. Please keep that in mind as you read the following. I built what follows as an excuse to practice my Node chops more, not to bring anything actually worthwhile into the Internets. Unless you like kittens. If so, this is epic.
<!--more-->
<img src="https://static.raymondcamden.com/images/synth.png" style="float:left;margin-right:10px" />
About a week or so ago I saw a tweet from <a href="http://christianheilmann.com/">Christian Heilmann</a> talking about a new site, <a href="http://synthcats.com/">SynthCats</a>. As you can probably guess, this is a site filled with pictures of cats with keyboards and synthesizers. As an unapologetic child of the 80s and new wave, I could really get behind a site like this. It got me thinking though - you could probably take <i>any</i> combination of cats and come up with a fun site. 

From that sprouted the idea behind <a href="http://www.andkittens.us">AndKittens</a>. I imagined a site where you could simply enter a URL, like <a href="http://pugs.andkittens.us">pugs.andkittens.us</a> and see a collection of pictures of pugs with kittens. 

Building this required a few different parts. The first was support for a wildcard domain and introspection of that domain from within Node. That was actually pretty trivial and I covered it in a quick blog post last week: <a href="http://www.raymondcamden.com/index.cfm/2013/8/21/Nodejs-Quickie--checking-the-current-domain-name">Node.js Quickie: Checking the Current Domain Name</a>.

Using that code as a stepping point, I simply introspect the subdomain and load one of two views:

<script src="https://gist.github.com/cfjedimaster/6354614.js"></script>

The second aspect was supporting the dynamic image search. Google would be a natural fit for this, but they don't have an API for their search service. Instead I turned to Microsoft and their <a href="http://datamarket.azure.com/dataset/bing/search">Bing Search API</a>. They made it a bit difficult to sign up and their docs were a bit hard to parse (Word docs, really? I don't mind Word at all but I expect my API docs to be web pages!), but once I got past the initial setup it was pretty trivial to call from Node. 

I wrote a quick wrapper library. Actually - I wouldn't really call this a library as it is focused on image search only, but it could be made more generalized if folks want to take it and run. Here is the code.

<script src="https://gist.github.com/cfjedimaster/6354664.js"></script>

Two crucial things here. First, Node.js throws an error if you try to use a https site with a certificate it doesn't recognize. It didn't like the Microsoft certificate and frankly, I don't know why. I trust Microsoft though. (Really.) I used the rejectUnauthorized argument to tell Node.js to trust that I knew what I was doing and just hit the damn API. (I <strong>really</strong> wish ColdFusion would allow for this!) The second thing to remember is that Microsoft loves to use uppercase in their arguments. If you don't match the case precisely then you will get an error. What's odd is that they aren't consistent. Note the $format=json part at the end. 

In my opinion, unless there is some crucial performance reason it is silly to require a precise case match on arguments.

Anyway, you get the idea. That's the back end. The front end was done by my buddy Tai. Tai is a smart cookie I've known for <i>many</i> years, but oddly he doesn't have a blog or web site so he doesn't get a link from me here. He designed the "viewer" aspect of the site and did the nice transitions from one image to another. Right now there is a slight bug in that if an image fails to load, we don't immediately go to the next image (and dump it from the result set).

If you want to see the code, check out the GitHub repo here: <a href="https://github.com/cfjedimaster/AndKittens">https://github.com/cfjedimaster/AndKittens</a>. Yes, I realize my Bing key is in there. I need to strip that out and I'll probably max out my free key usage by the end of the month. It happens.

That's it. Tomorrow I'm going to talk about the hosting service I used, <a href="https://modulus.io/">Modulus</a>.