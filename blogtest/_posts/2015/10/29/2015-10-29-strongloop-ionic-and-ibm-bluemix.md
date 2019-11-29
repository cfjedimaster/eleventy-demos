---
layout: post
title: "StrongLoop, Ionic, and IBM Bluemix"
date: "2015-10-29T13:26:02+06:00"
categories: [development,javascript,mobile]
tags: [bluemix,cordova,ionic,strongloop]
banner_image: 
permalink: /2015/10/29/strongloop-ionic-and-ibm-bluemix
guid: 7024
---

Over the past few weeks I've been digging deep into <a href="http://www.strongloop.com">StrongLoop</a> and rather enjoying the heck out of it. As I said in my earliest post - I'm not necessarily a fan of tools generating code for me or lots of "automagical" stuff at the framework level, but after working with the LoopBack framework and models I got over it pretty darn quickly. I'm definitely sold on the concept and am exciting about digging into the other parts of StrongLoop's offering. But before I went too much further in that direction, I wanted to write up a complete example that covered a fully functioning server and mobile app running on <a href="https://ibm.biz/IBM-Bluemix">Bluemix</a>. To the end I've created a project and a set of videos to help guide you through the process. Let's get started!

<!--more-->

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/wecandothis.jpg" alt="wecandothis" width="400" height="400" class="aligncenter size-full wp-image-7027" />

<h1>Getting the Code and Testing</h1>

You can find all of the code on GitHub: <a href="https://github.com/cfjedimaster/StrongLoop-Bluemix-Ionic">https://github.com/cfjedimaster/StrongLoop-Bluemix-Ionic</a>. While this will give you the raw code, obviously it won't give you all the tools you need to run through everything. For the server-side, you'll need:

<ul>
<li><a href="https://nodejs.org">Node.js</a></li>
<li><a href="https://strongloop.com/get-started/">StrongLoop</a> (installs via npm, you also want to register at the site)</li>
<li>Sign up at <a href="https://ibm.biz/IBM-Bluemix">Bluemix</a> and grab the cf command line tools here: <a href="https://www.ng.bluemix.net/docs/#starters/install_cli.html">Deploying your app with the Cloud Foundry command line interface</a></li>
</ul>

For the client-side, you'll want:

<ul>
<li><a href="http://cordova.apache.org">Apache Cordova</a> and some mobile platform to test on. You may be able to get buy with the <a href="http://www.raymondcamden.com/2014/09/24/browser-as-a-platform-for-your-phonegapcordova-apps">browser platform</a> though.</li>
<li><a href="http://www.ionicframework.com">Ionic</a> (installs via npm)</li>
</ul>

That's a lot, but I assume if you are a developer you probably already have Node and hopefully you have Cordova done too. There are no requirements for editors but I strongly recommend <a href="https://code.visualstudio.com/">Visual Studio Code</a>. Ok, so let's get started!

<h2>An introduction</h2>

<iframe width="853" height="480" src="https://www.youtube.com/embed/fiDU06xLqzU?rel=0" frameborder="0" allowfullscreen></iframe>

In this video, I go into detail about what is being built and what components are being used. To be honest, this blog post itself explains most of that so I won't be offended if you skip this, but I also demonstrate the final app so you can see everything come together.

<h2>Server-Side Setup</h2>

<iframe width="853" height="480" src="https://www.youtube.com/embed/7rL1xTDFcNc?rel=0" frameborder="0" allowfullscreen></iframe>

In this video, I walk you through creating the Node.js application using the StrongLoop command line. I then show StrongLoop Arc Composer visually designing a simple model. I then show you the API in action and quickly create a few objects to test that everything is working.

<h2>Building the mobile app in Ionic</h2>

<iframe width="853" height="480" src="https://www.youtube.com/embed/sDzETrISE34?rel=0" frameborder="0" allowfullscreen></iframe>

In this video, I create the application with Ionic. I don't walk you through every line of code, but rather show the completed source code and explain how I did it. Angular's $ngResource made this <i>incredibly</i> simple. Shockingly simple actually. 

<h2>Deploying to Bluemix and adding Cloudant</h2>

<iframe width="853" height="480" src="https://www.youtube.com/embed/whvSKZl1rLA?rel=0" frameborder="0" allowfullscreen></iframe>

In the final, and longest, video, I walk you through pushing the application up to Bluemix and then adding Cloudant to the mix. As I said, this is the longest part, so let me know if anything isn't clear.

<h2>Wrap Up</h2>

All in all, you've got about 20 minutes of video, and in that time a server is created and hosted live and a front end application is setup to speak to that server via an API. That's power. Incredible power. Obviously I'm pretty biased towards all the technologies used in the stack here but frankly I think I have reason to be. They kick butt. I hope you think so as well!

<h2>Edit</h2>

Just a quick FYI - after posting this article, I discovered that the StrongLoop folks actually had a four part series on the same topic! I haven't read it yet, but part one is here: <a href="https://strongloop.com/strongblog/part-1-ionic-loopback-node-js-mobile/">Part 1: Ionic & LoopBack Frameworks – Building a REST API</a>.