---
layout: post
title: "Node.js Quickie - checking the current domain name"
date: "2013-08-21T13:08:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2013/08/21/Nodejs-Quickie-checking-the-current-domain-name
guid: 5014
---

I'm working on a quick proof of concept (for a killer idea, honest, I <strong>swear</strong>) that needs to rely on a subdomain name to determine how the application responds. So as an example, I want to see something different for foo.app.com versus goo.app.com, and obviously support www.app.com and app.com. Here is a quick way to handle that.
<!--more-->
First - my thanks to StackOverflow user <a href="http://stackoverflow.com/users/283783/cjohn">cjohn</a> for his <a href="http://stackoverflow.com/a/7507507/52160">answer</a>. If you examine the Request object in your Node app you can introspect the headers object to view the host value. 

I did a quick dump (JSON.stringify(req.headers)) to see what this looked like:

<img src="https://static.raymondcamden.com/images/Screenshot_8_21_13_11_56_AM1.png" />
Pretty much what I expected. So I wrote a quick little snippet that would focus on returning just the subdomain:

<script src="https://gist.github.com/cfjedimaster/6297080.js"></script>

You can see both the function as well as the route that makes use of it. This isn't perfect. If a user hits the site via x.y.app.com then you (probably) want to see x.y as a result, but for my needs I'm fine with just x being returned.