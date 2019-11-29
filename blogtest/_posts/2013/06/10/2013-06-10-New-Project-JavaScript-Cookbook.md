---
layout: post
title: "New Project: JavaScript Cookbook"
date: "2013-06-10T11:06:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2013/06/10/New-Project-JavaScript-Cookbook
guid: 4955
---

After traveling the last couple of weeks I've got a little break now between conferences and I thought it would be cool to spend some free time on a little project. A few weeks back I purchased javascriptcookbook.com (still can't believe that was available). I'm a <i>huge</i> fan of cookbook-type sites as I find them a much better way to learn about technology than simple "101-style" books. (And I say this as the <i>author</i> of multiple 101-style books.) As I work on client-side development more and more, I find myself hunting down the same type of tricks/techniques/etc multiple times. As an example, "How do I select a random number between two integers?" I figured - why not create a web site so I can collect these things? At worse, I'll learn a few things about Node while I build it, and at best, maybe others will contribute and help build some content. Here is the technology stack I'm using:
<!--more-->
<h2>Server Side</h2>

<ul>
<li>Node.js, with Express. I love how easy it is to quickly set up a simple web site with Node and Express. As I've said before, Express is what made me stop smirking at Node and calling it a "web server builder." To be honest, I could whip up a simple content management site in ColdFusion in 2 hours, but I wouldn't learn anything. </li>
<li><a href="https://github.com/donpark/hbs">hbs</a> is a simple npm module that lets you use Handlebars in your views. All in all it feels a bit like writing simple CFML.</li>
<li>MongoDB for data persistence. I haven't used Mongo in years, but it too was rather easy to set up in Node. This <a href="http://howtonode.org/express-mongodb">article</a> was <i>incredibly</i> helpful and made it simple to learn.
</ul>

<h2>Hosting</h2>

I'm not entirely sure yet on this one, but this is what I'm considering...

<ul>
<li>I'm going to start with <a href="https://www.appfog.com/">AppFog</a>, a hosting system that supports Node, Mongo, and other things. They have a free tier I want to play with. Their lowest non-free tier is 20 dollars a month, <strong>which is cheap</strong>, but as I already pay for hosting, I'm not sure I want to pay more.
<li>So if I don't use another host, I may just use this box. I've already learned how to proxy Apache to Node, so all I'd have to do is research how to monitor/launch at boot/relaunch on crash a Node app in Windows.
<li>Parse also has Node hosting, and I freaking love Parse. They have a free tier that includes 1 million requests. If you were to get two million your cost would be 70 dollars. Two million hits in a month would be a huge success so I may consider this as well.
</ul>

<h2>Front End</h2>

I considered going fancy with Backbone, but frankly, this is an incredibly simple content site, not an "app". I'm using a nice little Bootstrap theme I found and will just do my best to KISS.

<img src="https://static.raymondcamden.com/images/Screenshot_6_10_13_6_58_AM.png" />

I'll also be putting this into a GitHub repo in case anyone wants to see the work behind the scenes, make improvements, or just criticize my Node-code. ;)