---
layout: post
title: "A tip for testing Alexa Skills"
date: "2017-03-08T09:35:00-07:00"
categories: [development]
tags: [alexa]
banner_image: 
permalink: /2017/03/08/a-tip-for-testing-alexa-skills
---

A week or so ago I got my first Echo device (a Dot as a speaker gift from <a href="https://www.devnexus.com/s/index">Devnexus</a>) and I fell in love with it so much that I've already purchased the larger model. My wife ands kids like it too. So naturally I decided to take a look at building custom skills for it. (For folks who don't know, a "Skill" is basically a program that lets the device respond to voice commands.) While I plan on blogging about the process of getting it to work with OpenWhisk, I wanted to share a really, really important tip.

As part of the skill design process, Amazon has a web based interface that, for the most part, works just fine. I had my action up and running on OpenWhisk and I tried my first test, again, via the web interface. When I ran my test, I got an error:

<img src="https://static.raymondcamden.com/images/2017/3/alexa1.png" class="imgborder">

The error, which you can't read completely on screen there, is:

	The remote endpoint could not be called, or the 
	response it returned was invalid.

And... bam. That was it. I was completely stuck. I had some logging on my OpenWhisk side and as far as I could see, nothing was executing at all. I really didn't know what to do. 

Then - on a whim - I looked at my phone's Alexa app. This is the app you install to work with your hardware, configure it and the like, but isn't required for building the skill itself. I just opened it up for the heck of it honestly, and that's when I saw it. 

The app keeps a record of everything you ask it and presents it in a nice card interface. What I didn't realize was that it also recorded my tests from the web interface and - crucially - returned much more detailed information:

<img src="https://static.raymondcamden.com/images/2017/3/alexa2.png" class="imgborder">

For the life of me, I can't imagine why this level of information isn't available on the developer web site, but it was exactly the information I needed to fix the problem<sup>*</sup>. Once I corrected it, I was able to connect to my skill (both in the web app and via voice) just fine.

<img src="https://static.raymondcamden.com/images/2017/3/alexa3.png" class="imgborder">

As I said, I'll share more details about doing this with OpenWhisk once I get a better demo done.

<blockquote>* For folks curious about the issue, I'll document this in my larger post later, but the issue was that I needed to select "My development endpoint is a sub-domain of a domain that has a wildcard certificate from a certificate authority" on the SSL setting. Thanks to <a href="https://twitter.com/csantanapr">Carlos Santana</a> for helping me with that.</blockquote>