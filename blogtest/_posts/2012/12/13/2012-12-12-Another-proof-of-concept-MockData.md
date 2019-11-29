---
layout: post
title: "Another proof of concept - MockData"
date: "2012-12-13T11:12:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2012/12/13/Another-proof-of-concept-MockData
guid: 4809
---

Yesterday I whipped up a quick little Node app that I thought folks might find interesting. The basic idea behind it is a quick way to generate fake JSON data. So imagine you are offline and need to write some code that works with an API. You could fire up this app (it runs as its own server) and then simply point your XHR code to the service. By using URL parameters you can define what type of data you would like back. Or maybe you aren't offline but simply don't have access to an API yet. Or perhaps the API you are using has strict usage limits. You get the idea I think. There's already a damn good mocking library out there (<a href="https://github.com/appendto/jquery-mockjax">MockJax</a>) but I wanted to build something that acted like a real server. Whether or not that make sense is up to debate. Anyway, here's an example.
<!--more-->
If I wanted 5 objects with an author field that is a name and an age, I'd do:

http://localhost:3000/?num=5&author=name&age=age

Which could return:

<img src="https://static.raymondcamden.com/images/screenshot47.png" />

A more complex example could add a gender and a salary, as well as returning a random number of results.

http://localhost:3000/?num=rnd:10&author=name&age=age&gender=oneof:male:female&salary=num:150000

<img src="https://static.raymondcamden.com/images/screenshot48.png" />

The service uses CORS which means you can be running a virtual host locally and access the URL at localhost with no issues. 

Want to play with it? Want to give me feedback on the code? Just hit up the GitHub repo: <a href="https://github.com/cfjedimaster/mockdata">https://github.com/cfjedimaster/mockdata</a>