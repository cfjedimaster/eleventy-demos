---
layout: post
title: "Using CFC data with Handlebars"
date: "2012-05-11T11:05:00+06:00"
categories: [coldfusion,html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/05/11/Using-CFC-data-with-Handlebars
guid: 4614
---

Earlier this week Steve wrote to me asking how to use data retrieved in a ColdFusion Component in a <a href="http://handlebarsjs.com/">Handlebars</a> template. While ColdFusion makes it trivial to serve up query data via JSON, the result format isn't always easy to use in JavaScript utilities. Here's a quick example I wrote that demonstrates how to work around this.
<!--more-->
First - I wrote a CFC that returned a static query - just for testing. It has three columns: id, mileage, and traveldate. Note that I'm using the ColdFusion 10 format for creating static queries.

<script src="https://gist.github.com/2660234.js?file=gistfile1.txt"></script>

Now, let's look at a simple front end. All this template needs to do is use Ajax to fetch the data and display it via Handlebars:

<script src="https://gist.github.com/2660241.js?file=gistfile1.html"></script>

Pretty simple - document loads - we do the Ajax request - and for now - not much else. But notice I dumped the data to the console. If you've never seen how a query comes across the wire in JSON, it consists of two parts: A COLUMNS array that is an array of columns. (Duh.) and a DATA array which is an array of arrays. The Nth item in each array represents the Nth item in the COLUMNS array.

<img src="https://static.raymondcamden.com/images/ScreenClip78.png" />

(As a quick aside - you can return an alternative version of query data if you pass in an additional URL argument. It's different, but not much 'nicer' in terms of what we need to do here.)

So, one way to handle this would be to simply convert it into an array. You will notice our Handlebar template is expecting an array of "records" with keys mileage and traveldate. Here was my first fix:

<script src="https://gist.github.com/2660265.js?file=gistfile1.js"></script>

Pretty simple, right? One thing that kinda bothers me though is that the code makes assumptions on the columns. That isn't terribly dangerous (you always have to make some assumptions), but the code feels a bit brittle. I've got a simple JavaScript function that converts queries returned by CFCs into a simple array of objects:

<script src="https://gist.github.com/2660273.js?file=gistfile1.js"></script>

This allows us to do the conversion and pass it to Handlebars a bit nicer:

<script src="https://gist.github.com/2660276.js?file=gistfile1.html"></script>

Any thoughts? You could - of course - modify the CFC to simply return an array of structs.