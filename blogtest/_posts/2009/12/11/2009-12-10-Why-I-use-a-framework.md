---
layout: post
title: "Why I use a framework..."
date: "2009-12-11T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/11/Why-I-use-a-framework
guid: 3642
---

A colleague on Facebook sent me a quick question asking me about frameworks:

<blockquote>
Why use a framework?<br/>
What are the positives about having a framework?<br/>
If you made a very simple framework without trying to code it what would you LIKE it to do?<br/>
Is there anything you think it should NOT do?<br/>
</blockquote>

So one by one....

<b>Why use a framework?</b><br/>

I use a framework because it solves a problem. I try to apply that to <i>anything</i> cool I see in regards to frameworks, design patterns, etc. If it doesn't solve a problem I have, then it isn't something I need at the moment. As to what problem it solves for me - it helps me deal with how I organize my files and structure the 'flow' of my application. That may seem minor, but it really relieves me of a lot of 'grunt thinking' - ie, thinking about simple crap. It lets me focus on more difficult stuff. 

<b>What are the positives about having a framework?</b><br/>

Well along with what I described above, it also gives my application a standard that makes it easier for other folks to work with. So given that an application uses framework X, I can hop on the web site, check the docs, and I'll be able to more easily understand it. 

<b>If you made a very simple framework without trying to code it what would you LIKE it to do?</b><br/>

Well, I'd look at what I like in Model-Glue and FW/1 - mainly the mechanics of handling the flow of my application. I hate to sound like I'm repeating myself, but what I described above as what I liked is obviously what I'd build into a new framework. (But let me just add - before creating a new framework, you probably want to look into working with an existing one!)

<b>Is there anything you think it should NOT do?</b><br/>

As I said above, a good framework handles the flow and layout of an application. I get to focus on business logic and UI. To me - that's all a framework should do. Anything else is cow bell and not strictly necessary. I'm happy, for example, that Model-Glue doesn't do what ColdSpring does. Let each take care of their own domain.

<b>What do you not use a framework?</b><br/>

There isn't a hard and fast rule for this. For "smaller" sites I probably wouldn't bother, but I've rarely seen sites shrink. Most sites grow. I didn't use a framework for ColdFusion Bloggers and I wish I had. Also, it depends on your framework. Something like FW/1 which runs completely by convention has an extremely small amount of overhead. In cases where I feel an application is too small for Model-Glue I might still consider FW/1. 

In general, I tend to work with sites. I don't build tiny one page applications. So I almost always use a framework.