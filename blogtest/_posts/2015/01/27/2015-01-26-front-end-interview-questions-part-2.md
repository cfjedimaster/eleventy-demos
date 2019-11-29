---
layout: post
title: "Front-End Interview Questions - Part 2"
date: "2015-01-27T08:55:31+06:00"
categories: [development]
tags: [front-end-interview-questions]
banner_image: 
permalink: /2015/01/27/front-end-interview-questions-part-2
guid: 5588
---

<blockquote>This post is part of a series I'm writing where I attempt to answer, to the best of my ability, a set of <a href="https://github.com/h5bp/Front-end-Developer-Interview-Questions">Front-End developer questions</a>. I expect/hope my readers will disagree, augment, and generally hash out my answers in the comments below.</blockquote>

<strong>What did you learn yesterday/this week?</strong>
Not that it is terribly important per se, but I learned that in some browsers, you can drag and drop a file onto an input/file field. I thought that was cool. It also got me thinking about what other browser features I may be missing out on. I tend to focus on what the browser supports in terms of HTML/JS/CSS, but in regards to UX like this (that’s how I’d classify it), I wonder how much stuff I’m missing (and how much “casual” users are aware of).

<strong>What excites or interests you about coding?</strong>
Mainly figuring things out - although a lot of times it is simply seeing my input converted into actions on the computer. That sounds lame, or, well, what all programming does, but it is honest as well. I remember my first experience with coding and the joy I felt when I actually got the computer (Apple 2e FTW!) to do what I wanted. That joy was like a drug I’ve not been able to shake off since then. 

I’d say I get more excitement though from sharing with others. That’s why I write on this blog and do presentations.

<strong>What is a recent technical challenge you experienced and how did you solve it?</strong>
I wish it were more exciting, but, I’m dealing with moving a large Mongo database from my local machine to a remote server. I had to learn how to make backups and how to restore. I also had to deal with timeout issues. How did I solve it? I Googled. But in order to be sure I could get to the answers easier next time, I stored the command line calls in Evernote. I tend to have pretty crappy memory, especially with CLIs, so I use Evernote as a reference for things like this.

<strong>What UI, Security, Performance, SEO, Maintainability or Technology considerations do you make while building a web application or site?</strong>
Ah, a big one. :) Let me try to break this down a bit.

In terms of UI, as I’m mostly doing small POCs (proof of concepts), I try to keep things as simple as possible. If I need things to look nice quickly, I’ll use Bootstrap. If I’m building something in Cordova and it will be a medium to large demo, I’ll use <a href=“http://www.ionicframework.com”>Ionic</a>.

In terms of security, it really depends. Almost all of my work is client-side now, and I know that you can’t trust <i>anything</i> from the client when speaking to a server. So I know, for example, that if I’ve built a mobile app that stores data on the server, I have to employ authentication/authorization rules on the client and on the server, and I damn well better get it right on the server. One of the things I do when playing with a cool front end web app is open up the dev tools and look at the network requests being made. I’ll then - sometimes - open up those requests in other tabs and see how well things are locked down. I'll combine this with curl in the terminal if I really feel like testing out an API.

In terms of performance, guess what - it depends. :) I’ll be honest and say that performance of client-side code is not something I’ve explored deeply yet. I’m certainly <i>aware</i> of the tools browser vendors provide in this area and I know where to begin if I'm seeing "jank" in my front-end code. Maybe I’m biased, but this is exactly the kind of answer I’d hope from someone about this. I.e., "I don't know, but I know the tools exist, where to find it, and how to start Googling to dig deeper."

SEO - nope - I don’t care. :) Ok, I guess I do care, but, it isn’t something I think about. (Maybe I need to more. There is a SEO plugin for WordPress that a friend recommended to me.)

Maintainability - I suppose this falls into basic things I’ve been aware of since I started my career. Proper documentation, clean code, source control to help keep track of what’s changed, using a bug tracker to help manage requests versus email, etc. I’m not sure how well this is taught now. I don’t remember it being taught back when I was in comp sci, but that was decades ago. I think I just found something to blog deeper about later on.

Technology - This part of the question is a bit open ended. At the end of the day, whether I use ColdFusion or Node or - heck - Perl CGI - I want to ensure my technology stack performs well, can be secured, and is generally stable. I’d think most of the common stacks out there match those criteria so it comes down to what is best for the team developing the project. On the client-side, the biggest thing that comes to mind here is progressive enhancement. Given technology X that may only be supported on 10{% raw %}% of browsers, you can add it to your project in such a way that the other 90%{% endraw %} are not impacted by the lack of said technology.