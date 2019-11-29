---
layout: post
title: "JSONPath for parsing JSON"
date: "2016-03-15T10:09:00-07:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2016/03/15/jsonpath-for-parsing-json
---

This is just a FYI that there is a cool little project that provides XPath like support for JSON values: [JSONPath Plus](https://github.com/s3u/JSONPath). I think this is rather cool as XPath is probably the only nice thing about XML over JSON. If you've never heard of XPath, you can think of it as a query language for filtering/parsing XML data. Everything from getting a subset of an XML document to even doing things like addition. If you'd like to learn more, check out the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/XPath) on XPath. JSON doesn't provide any similar functionality built-in, but JSONPath provides an alternative.

<!--more-->

Here is an example of it in action. Let's take the result of calling the Ships API from the [Star Wars API](https://swapi.co). The URL for this JSON is http://swapi.co/api/starships/?format=json. Here is the result - with some of the results taken out just to make the snippet a bit smaller.

<pre><code class="language-javascript">
{"count":37, "next":"http://swapi.co/api/starships/?format=json&page=2", "previous":null, 
"results":[{"name":"Sentinel-class landing craft","model":"Sentinel-class landing craft",
"manufacturer":"Sienar Fleet Systems, Cyngus Spaceworks","cost_in_credits":"240000","length":"38",
"max_atmosphering_speed":"1000","crew":"5","passengers":"75","cargo_capacity":"180000","consumables":"1
 month","hyperdrive_rating":"1.0","MGLT":"70","starship_class":"landing craft","pilots":[],"films":
["http://swapi.co/api/films/1/"],"created":"2014-12-10T15:48:00.586000Z",
"edited":"2014-12-22T17:35:44.431407Z","url":"http://swapi.co/api/starships/5/"},{"name":"Death Star",
"model":"DS-1 Orbital Battle Station","manufacturer":"Imperial Department of Military Research, Sienar 
Fleet Systems","cost_in_credits":"1000000000000","length":"120000","max_atmosphering_speed":"n/a",
"crew":"342953","passengers":"843342","cargo_capacity":"1000000000000","consumables":"3 years",
"hyperdrive_rating":"4.0","MGLT":"10","starship_class":"Deep Space Mobile Battlestation","pilots":[],
"films":["http://swapi.co/api/films/1/"],"created":"2014-12-10T16:36:50.509000Z",
"edited":"2014-12-22T17:35:44.452589Z","url":"http://swapi.co/api/starships/9/"}]}</code></pre>

Just by eyeballing that<sup>*</sup> you can see the object contains a count key, a next and previous set of keys for pagination, and a results array. Using JSONPath, I can request just the result by using this path: <code>$.results</code>. Or I could ask for the total sum of the cost values like so: <code>$.results..cost_in_credits</code>. 

Pretty cool, right? The [readme](https://github.com/s3u/JSONPath) contains many examples. You can use this both in 'regular' client-side JavaScript as well as Node. I wanted to do some testing with the library so I built a quick online demo. Here's a screen shot in action. I used *all* my design skills on this one:

<img src="https://static.raymondcamden.com/images/2016/03/jsonpath1.png" class="imgborder">

While JSONPath itself has a few configuration options, my tool simply takes the defaults. You can paste in a JSON string and then play around with the path options to see the results. 

<img src="https://static.raymondcamden.com/images/2016/03/jsonpath2.png" class="imgborder">

My code isn't anything special here - basically take in the inputs and render them out. I'll remind folks that JSON.stringify lets you pass in basic formatting instructions. That's how I got the nicely layout dump of the data. You can try out the demo here: [https://static.raymondcamden.com/demos/2016/03/15/](https://static.raymondcamden.com/demos/2016/03/15/).

&#42; As a quick aside, I've been using this [online JSON viewer](http://jsonviewer.stack.hu/) for a while now to render complex JSON objects. I need to build an extension for Visual Studio Code so I can use this in my editor.