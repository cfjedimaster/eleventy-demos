---
layout: post
title: "New Demo Project: SauceDB"
date: "2015-07-14T10:27:56+06:00"
categories: [development,html5,javascript,mobile]
tags: [bluemix,cordova,ionic]
banner_image: 
permalink: /2015/07/14/new-demo-project-saucedb
guid: 6382
---

Today I'm kicking off a new project for the purposes of demonstrating <a href="http://www.ionicframework.com">Ionic</a> and <a href="https://ibm.biz/IBM-Bluemix">IBM Bluemix</a>. While I'm not sure I'll actually release this application (I'm building something I actually <i>want</i>, so I kinda want to), my intent here is to build a full application demonstrating multiple facets of Ionic with Bluemix handling the back end. Let me start off by talking about what this application actually does.

<!--more-->

<h2>The App</h2>

I'm a huge fan of <a href="https://untappd.com/">Untappd</a> and <a href="https://www.goodreads.com/">Goodreads</a>. For me, these apps help me organize two of my favorite passions in life - good beer and good books. (And hey, Budweiser, you can officially take your anti-micro-brew campaign and shove it where the sun doesn't shine.) Both sites/apps follow the same basic principle - they allow you to track and rate things are you consuming. I have pretty crap memory, so I find both apps to be incredibly useful. Both also include a social aspect to them that - honestly - I don't really care about. I <i>do</i> like to know what beers my friends are enjoying and what books they've read, but I typically talk about that in the real world. I can't honestly remember the last time I used either app to check what <i>other</i> people are doing. 

My application, SauceDB, is basically a BBQ Sauce version of Untappd. The features will be:

<ul>
<li>Sauce stream (um, that sounds kinda gross): Essentially a 'feed' of the most recent sauce ratings. As I mentioned, I don't necessarily care much for the social aspect, so this app won't have "friends". Basically you see what everyone has posted. (And since this is a 'proof of concept' with few users, it will make it easier to see content.)</li>
<li>Add a sauce review: Sauces include a name, a company, your rating, and a description of the sauce. Optionally a picture as well. The app will recognize existing sauces and not add a new record for the sauce if it already exists.</li>
</ul>

I whipped up a quick prototype on paper first. Here is my completely incomprehensible attempt at drawing screens.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/IMAG2260.jpg" alt="IMAG2260" width="565" height="1000" class="aligncenter size-full wp-image-6383" />

I'm actually pretty impressed by how bad my drawing is. If I was a D&D character and Drawing was a skill, I'd have a -5 in it. In case you can't read my chicken scratch, the screens are:

<ul>
<li>Login</li>
<li>Feed</li>
<li>Feed item (ie, a sauce review)</li>
<li>Search to add a new review</li>
<li>New item (ie, adding a new sauce + review)</li>
<li>New review only (adding a review to an existing sauce</lli>
</ul>

I don't create prototypes often, but I definitely see the value. Just typing out the list there makes me realize I don't have a page that is Sauce-centric, ie a Sauce with all the reviews. I went ahead and set up a "real" prototype using <a href="http://creator.ionic.io">Ionic Creator.</a>

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/Ionic_Creator.png" alt="Ionic_Creator" width="800" height="659" class="aligncenter size-full wp-image-6384 imgborder" />

I essentially built all the screens you saw from the pen drawing above and added some basic interactivity. So for example, the login button goes right to the feed. Doing this was also helpful. For example, the 'feed' page (see the shot above) used a list view, but I'm pretty sure I'll switch to a card view to give the reviews more space. 

Ionic Creator has multiple export options, including a way to use it as a seed for a new project. 

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot13.png" alt="shot1" width="462" height="241" class="aligncenter size-full wp-image-6385 imgborder" />

I find the output of Ionic Creator to be a bit undesirable, so I used this in a new project just for the Creator output. I then <a href="https://surge.sh">Surged</a> it up to a real site: <a href="http://jittery-bait.surge.sh">http://jittery-bait.surge.sh</a>. 

<h2>The Tech</h2>

So what does my stack look like?

<ul>
<li>Obviously, Ionic. I've made no secret of my opinion that Ionic is the absolute best tool to use for building hybrid mobile applications with Cordova. 
<li><a href="https://github.com/ccoenraets/OpenFB">OpenFB</a>, a Facebook API library by Christophe Coenraets. I've used <a href="https://github.com/nraboy/ng-cordova-oauth">ng-cordova-oauth</a> in the past, but I just need FB now and I need a way to use their API as well.
<li>Node.js running on Bluemix. This will essentially be a proxy to...
<li><a href="https://cloudant.com/">IBM Cloudant</a> for the database. 
</ul>

Some "possible" stuff I want to add too - time permitting:

<ul>
<li>Ionic Analytics
<li>Pictures (no idea where I'll store the file blobs yet)
<li>Push (maybe a notice for every new review - again - this will be a pretty low used app)
</ul>

I'll also be sharing everything I've built up on Github. My code base is currently a bit messy, so the repo is empty, but it will be here: <a href="https://github.com/cfjedimaster/SauceDB">https://github.com/cfjedimaster/SauceDB</a>.