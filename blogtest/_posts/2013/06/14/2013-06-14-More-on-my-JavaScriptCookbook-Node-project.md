---
layout: post
title: "More on my JavaScriptCookbook Node project"
date: "2013-06-14T13:06:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2013/06/14/More-on-my-JavaScriptCookbook-Node-project
guid: 4961
---

Over the past couple of days I've made more progress on the Node <a href="http://www.raymondcamden.com/index.cfm/2013/6/10/New-Project-JavaScript-Cookbook">project</a> I started. If you haven't read the first article, click that previous link for the background. Here's what I've been able to do since my first post.
<!--more-->
<h2>GitHub</h2>
I mentioned this in the comments, but if you want to look at, and criticize, my Node code, you can do so at GitHub: <a href="https://github.com/cfjedimaster/javascriptcookbook">https://github.com/cfjedimaster/javascriptcookbook</a>. Everything is in there except for the JSON file that I used to store authentication information for the admin panel and my Gmail integration (more on that in a minute). As I think I say every time, I'm still a Node/Express noob, so I wouldn't consider this to be good code, but the site is complete for now.

<h2>Email</h2>
I used the excellent <a href="https://github.com/andris9/Nodemailer">Nodemailer</a> module to set up email support for my application. All I needed was the ability to send an email to myself and this worked fine. Here's a code snippet from my app.js showing this in action.

<script src="https://gist.github.com/cfjedimaster/5783361.js"></script>

The only oddity I ran into was that even though I set the From to be your name and email address, when it shows up in Gmail it is always my email address. I'm assuming that is a Gmail security thing. If anyone knows better, let me know. Since I include the sender's email address anyway this isn't a deal breaker for me.

<h2>MongoDB</h2>
I tell ya what. I never want to write SQL again. This isn't the first time I used Mongo but my god - what a pleasure. Here are a few examples.

<script src="https://gist.github.com/cfjedimaster/5783384.js"></script>

I think that $or search is the one I like the most. 

<h2>Templating</h2>
I hate the Jade templating system and EJS is ok, but my favorite templating system is Handlebars. The <a href="https://github.com/donpark/hbs">HBS</a> module gives me access to that inside my views. I can even extend it with my own utility functions. Here is one sample view:

<script src="https://gist.github.com/cfjedimaster/5783402.js"></script>

<h2>Commenting</h2>

Yeah, <a href="http://www.disqus.com">Disqus</a>. Done.

<h2>Hosting</h2>

I love <a href="https://www.appfog.com/">AppFog</a>. How much do I love AppFog? AppFog is this:

<img src="https://static.raymondcamden.com/images/bobapony1.jpg" />

Let me describe what their process was like for me. 

<ul>
<li>I signed up.
<li>I made a new app.
<li>I clicked about 2 buttons to add Mongo support.
<li>I installed the command line tool via npm.
<li>I typed "af update javascriptcookbook"
</ul>

That's it. I was done. Period. <strong>And it worked!</strong> Now it turns out I was supposed to modify one line: app.listen(3000) needed to change to app.listen(process.env.VCAP_APP_PORT || 3000). But even before I did that it worked. Heck, I didn't even have to tweak Mongo. 

So now my process is - I make some changes - I commit to GitHub - I push up to AppFog. The update process for AppFog takes about 20 seconds. 

I'm so happy with them that I'm going to go ahead and take the plunge and spend the 20 bucks a month. (Although I'll probably end up putting an AdSense ad on the site to help pay for it.)

Want to give it a whirl? Check it out here: <a href="http://javascriptcookbook.aws.af.cm">http://javascriptcookbook.aws.af.cm</a>. I am definitely looking for some submissions now and would love someone to make a favicon if they feel so inclined. ;)